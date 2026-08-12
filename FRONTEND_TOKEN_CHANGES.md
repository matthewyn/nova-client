# Frontend Token Migration Guide

The backend authentication contract now uses short-lived access tokens and rotating refresh tokens. The frontend must implement the changes below before deploying the new backend authentication flow.

## Backend contract

`POST /auth/login` and `POST /auth/signup` now return:

```json
{
  "token": "<access-token>",
  "refresh_token": "<refresh-token>",
  "token_type": "bearer",
  "expires_in": 900,
  "refresh_expires_in": 604800
}
```

- `token` is the access token. It expires after 15 minutes by default.
- `refresh_token` is an opaque, single-use token. It expires after seven days by default.
- Every successful refresh returns a new access token and a new refresh token. The previous refresh token becomes invalid immediately.
- Existing tokens issued before this change are invalid. Existing users must log in again after deployment.

## Required frontend changes

### 1. Update the stored session model

Store the entire token response rather than only `token`:

```ts
type AuthSession = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;
  refreshTokenExpiresAt: number;
};
```

Calculate absolute expiration times when receiving a token response:

```ts
type TokenResponse = {
  token: string;
  refresh_token: string;
  token_type: "bearer";
  expires_in: number;
  refresh_expires_in: number;
};

function createSession(response: TokenResponse): AuthSession {
  const now = Date.now();

  return {
    accessToken: response.token,
    refreshToken: response.refresh_token,
    accessTokenExpiresAt: now + response.expires_in * 1000,
    refreshTokenExpiresAt: now + response.refresh_expires_in * 1000,
  };
}
```

Prefer secure, HTTP-only cookies for long-lived credentials where the application architecture supports them. The current backend returns tokens in JSON, so if browser storage is used, keep the refresh token out of application logs, analytics, error reports, URLs, and query parameters.

### 2. Stop using JWT claims as the user profile

The access token no longer contains `email`, `country`, `tier`, or `role`. Do not decode the JWT to populate the current user.

Load current account data from:

```http
GET /auth/me
Authorization: Bearer <access-token>
```

Response:

```json
{
  "user": {
    "user_id": "...",
    "email": "user@example.com",
    "country": "Indonesia",
    "tier": "trial",
    "role": "user"
  }
}
```

Treat this response as the authoritative user state. Reload it after login, token refresh when appropriate, subscription changes, or other account updates.

### 3. Add refresh-token rotation

Before an authenticated request, refresh the access token if it is expired or close to expiration. A small safety window, such as 30 seconds, avoids sending a token that expires in transit.

```ts
const ACCESS_TOKEN_SAFETY_WINDOW_MS = 30_000;

function shouldRefresh(session: AuthSession): boolean {
  return Date.now() >= session.accessTokenExpiresAt - ACCESS_TOKEN_SAFETY_WINDOW_MS;
}
```

Refresh with:

```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "<current-refresh-token>"
}
```

The response has the same shape as login. Replace the complete stored token pair immediately:

```ts
async function refreshSession(session: AuthSession): Promise<AuthSession> {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: session.refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Session refresh failed");
  }

  return createSession((await response.json()) as TokenResponse);
}
```

Never keep using the old refresh token after a successful refresh.

### 4. Prevent concurrent refresh requests

Refresh tokens are single-use. If several requests receive `401` simultaneously and each calls `/auth/refresh`, only the first refresh can succeed.

Use one shared in-flight refresh promise:

```ts
let refreshPromise: Promise<AuthSession> | null = null;

async function refreshOnce(session: AuthSession): Promise<AuthSession> {
  if (!refreshPromise) {
    refreshPromise = refreshSession(session).finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}
```

All requests waiting for a refresh must use the token pair returned by the same promise.

### 5. Update the authenticated API client

The API client should:

1. Load the current session.
2. Refresh proactively if the access token is close to expiration.
3. Add `Authorization: Bearer <access-token>`.
4. If the request returns `401`, refresh once and retry the original request once.
5. If refresh fails, clear the session and redirect to login.
6. Never retry `/auth/login`, `/auth/signup`, or `/auth/refresh` through the refresh interceptor.
7. Never retry a request more than once after authentication failure.

Example outline:

```ts
async function authenticatedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  let session = requireSession();

  if (shouldRefresh(session)) {
    session = await refreshOnce(session);
    saveSession(session);
  }

  const send = (accessToken: string) =>
    fetch(input, {
      ...init,
      headers: {
        ...init.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

  let response = await send(session.accessToken);

  if (response.status === 401) {
    try {
      session = await refreshOnce(requireSession());
      saveSession(session);
      response = await send(session.accessToken);
    } catch {
      clearSession();
      redirectToLogin();
    }
  }

  return response;
}
```

Adapt this pattern to the frontend's existing Axios, Fetch, React Query, or other networking layer. With Axios, implement the same behavior in one request/response interceptor pair and mark retried requests with a private flag.

### 6. Update logout

Logout is now an authenticated server operation:

```http
POST /auth/logout
Authorization: Bearer <access-token>
```

It revokes all current access and refresh tokens for the user. Clear the local session in a `finally` block so local credentials are removed even when the network request fails:

```ts
async function logout(): Promise<void> {
  const session = getSession();

  try {
    if (session) {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
    }
  } finally {
    clearSession();
    redirectToLogin();
  }
}
```

If the access token has already expired, attempt one refresh before logout. If that refresh fails, clear the local session anyway.

### 7. Handle migration from legacy sessions

On application startup, inspect the stored session. If it contains only the old `token` field and no refresh token:

1. Delete the legacy session.
2. Clear cached user/profile data.
3. Redirect the user to login.
4. Optionally show a one-time message explaining that the session expired after a security update.

Do not repeatedly call `/auth/refresh` for a legacy session because no valid refresh token exists.

### 8. Update state synchronization

If the application runs in multiple browser tabs, synchronize login, refresh, and logout state through a `BroadcastChannel` or a storage event. In particular:

- A logout in one tab should clear sessions in all tabs.
- A token rotation in one tab should update the current token pair in the other tabs.
- Only one tab should perform a refresh for a shared refresh token where practical.

## Error handling

Use the following behavior:

| Condition | Frontend action |
| --- | --- |
| Access token near expiry | Refresh before making the request |
| Protected endpoint returns `401` | Refresh once, then retry once |
| `/auth/refresh` returns `401` | Clear session and require login |
| Retried request still returns `401` | Clear session and require login |
| Authenticated endpoint returns `403` | Keep the session; show an authorization error |
| Logout request fails | Clear local session regardless |
| No refresh token or expired refresh deadline | Clear session and require login |

Do not treat `403` as an expired session. It means the authenticated user lacks permission, such as the required admin role.

## Acceptance checklist

- [x] Login stores both access and refresh tokens.
- [x] Signup stores both access and refresh tokens.
- [x] Access-token expiration is tracked using `expires_in`.
- [x] Refresh-token expiration is tracked using `refresh_expires_in`.
- [x] The frontend refreshes shortly before access-token expiration.
- [x] A successful refresh atomically replaces both stored tokens.
- [x] Concurrent requests share one refresh operation.
- [x] A request is retried at most once after a `401`.
- [x] Refresh failures clear the session and return the user to login.
- [x] `/auth/me` supplies role, tier, email, country, and user ID.
- [x] The frontend no longer reads role or tier from JWT claims.
- [x] Logout calls the authenticated backend endpoint.
- [x] Logout always clears local authentication state.
- [x] Legacy token-only sessions are removed during migration.
- [x] Multi-tab login, refresh, and logout behavior is synchronized or explicitly tested.
- [x] Tokens are excluded from logs, analytics, error reports, URLs, and query strings.

## Suggested tests

Add frontend tests for:

1. Login and signup session persistence.
2. Proactive refresh before expiry.
3. Refresh followed by retry of the original request.
4. Several simultaneous `401` responses causing only one refresh request.
5. Replacement of the old refresh token after rotation.
6. Refresh failure clearing the session.
7. A `403` response not triggering token refresh or logout.
8. Authenticated logout and local cleanup on success or network failure.
9. Legacy session migration.
10. Loading current role and tier from `/auth/me` rather than JWT decoding.
