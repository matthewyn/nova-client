const SESSION_KEY = "authSession";
const LEGACY_TOKEN_KEY = "authToken";
const AUTH_CHANNEL_NAME = "nova-auth-session";

const authChannel =
  typeof BroadcastChannel !== "undefined"
    ? new BroadcastChannel(AUTH_CHANNEL_NAME)
    : null;

function isSession(value) {
  return (
    value &&
    typeof value.accessToken === "string" &&
    value.accessToken.length > 0 &&
    typeof value.refreshToken === "string" &&
    value.refreshToken.length > 0 &&
    Number.isFinite(value.accessTokenExpiresAt) &&
    Number.isFinite(value.refreshTokenExpiresAt)
  );
}

function notifyOtherTabs() {
  authChannel?.postMessage({ type: "session-changed" });
}

export function createSession(response) {
  const now = Date.now();
  const session = {
    accessToken: response?.token,
    refreshToken: response?.refresh_token,
    accessTokenExpiresAt: now + response?.expires_in * 1000,
    refreshTokenExpiresAt: now + response?.refresh_expires_in * 1000,
  };

  if (!isSession(session)) {
    throw new Error("The server returned an invalid authentication session");
  }

  return session;
}

export function saveSession(session) {
  if (!isSession(session)) {
    throw new Error("Cannot store an invalid authentication session");
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  notifyOtherTabs();
}

export function getSession() {
  const storedSession = localStorage.getItem(SESSION_KEY);
  if (!storedSession) return null;

  try {
    const session = JSON.parse(storedSession);
    return isSession(session) ? session : null;
  } catch {
    return null;
  }
}

export function requireSession() {
  const session = getSession();
  if (!session) throw new Error("No active session");
  return session;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  notifyOtherTabs();
}

export function migrateLegacySession() {
  const legacyToken = localStorage.getItem(LEGACY_TOKEN_KEY);
  const storedSession = localStorage.getItem(SESSION_KEY);
  let hasInvalidStoredSession = false;

  if (storedSession) {
    try {
      hasInvalidStoredSession = !isSession(JSON.parse(storedSession));
    } catch {
      hasInvalidStoredSession = true;
    }
  }

  if (!legacyToken && !hasInvalidStoredSession) return false;

  clearSession();
  return true;
}

export function subscribeToSessionChanges(listener) {
  const handleStorage = (event) => {
    if (event.key === SESSION_KEY || event.key === LEGACY_TOKEN_KEY) {
      listener(getSession());
    }
  };
  const handleBroadcast = (event) => {
    if (event.data?.type === "session-changed") listener(getSession());
  };

  if (authChannel) {
    authChannel.addEventListener("message", handleBroadcast);
  } else {
    window.addEventListener("storage", handleStorage);
  }

  return () => {
    if (authChannel) {
      authChannel.removeEventListener("message", handleBroadcast);
    } else {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

export function getAuthHeader() {
  const session = getSession();
  return session
    ? { Authorization: `Bearer ${session.accessToken}` }
    : {};
}
