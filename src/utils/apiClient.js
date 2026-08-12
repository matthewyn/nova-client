import axios from "axios";
import { generateApiOrigin } from "@/utils/apiOrigin";
import {
  clearSession,
  createSession,
  getSession,
  saveSession,
} from "@/utils/token";

const ACCESS_TOKEN_SAFETY_WINDOW_MS = 30_000;
const REFRESH_LOCK_NAME = "nova-auth-refresh";
const API_BASE_URL = generateApiOrigin("");
const NON_REFRESHABLE_AUTH_PATHS = [
  "/auth/login",
  "/auth/signup",
  "/auth/refresh",
];

let refreshPromise = null;

function getRequestUrl(config) {
  try {
    return new URL(config.url, config.baseURL || window.location.origin);
  } catch {
    return null;
  }
}

function isBackendRequest(config) {
  const requestUrl = getRequestUrl(config);
  try {
    return requestUrl?.origin === new URL(API_BASE_URL).origin;
  } catch {
    return false;
  }
}

function isNonRefreshableAuthRequest(config) {
  const pathname = getRequestUrl(config)?.pathname;
  return NON_REFRESHABLE_AUTH_PATHS.some((path) => pathname?.endsWith(path));
}

function shouldRefresh(session) {
  return (
    Date.now() >=
    session.accessTokenExpiresAt - ACCESS_TOKEN_SAFETY_WINDOW_MS
  );
}

function redirectToLogin() {
  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
}

function failAuthentication() {
  clearSession();
  redirectToLogin();
}

async function requestNewSession(session) {
  if (Date.now() >= session.refreshTokenExpiresAt) {
    throw new Error("Refresh token expired");
  }

  const response = await axios.post(generateApiOrigin("/auth/refresh"), {
    refresh_token: session.refreshToken,
  });
  return createSession(response.data);
}

async function rotateSession(session) {
  const refreshWithLatestSession = async () => {
    const latestSession = getSession();
    if (!latestSession) throw new Error("No active session");

    if (latestSession.refreshToken !== session.refreshToken) {
      return latestSession;
    }

    const nextSession = await requestNewSession(latestSession);
    const currentSession = getSession();
    if (!currentSession) throw new Error("Session ended during refresh");
    if (currentSession.refreshToken !== latestSession.refreshToken) {
      return currentSession;
    }

    saveSession(nextSession);
    return nextSession;
  };

  if (navigator.locks?.request) {
    return navigator.locks.request(REFRESH_LOCK_NAME, refreshWithLatestSession);
  }

  return refreshWithLatestSession();
}

export function refreshOnce(session) {
  if (!refreshPromise) {
    refreshPromise = rotateSession(session).finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

const apiClient = axios.create();

apiClient.interceptors.request.use(async (config) => {
  if (!isBackendRequest(config) || isNonRefreshableAuthRequest(config)) {
    return config;
  }

  let session = getSession();
  if (!session) return config;

  try {
    if (shouldRefresh(session)) session = await refreshOnce(session);
  } catch (error) {
    failAuthentication();
    return Promise.reject(error);
  }

  config.headers.Authorization = `Bearer ${session.accessToken}`;
  config._authAccessToken = session.accessToken;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    const isAuthenticatedFailure =
      error.response?.status === 401 &&
      config?._authAccessToken &&
      isBackendRequest(config) &&
      !isNonRefreshableAuthRequest(config);

    if (!isAuthenticatedFailure) return Promise.reject(error);

    if (config._authRetry) {
      failAuthentication();
      return Promise.reject(error);
    }

    config._authRetry = true;

    try {
      let session = getSession();
      if (!session) throw new Error("No active session");

      if (session.accessToken === config._authAccessToken) {
        session = await refreshOnce(session);
      }

      config.headers.Authorization = `Bearer ${session.accessToken}`;
      config._authAccessToken = session.accessToken;
      return apiClient(config);
    } catch (refreshError) {
      failAuthentication();
      return Promise.reject(refreshError);
    }
  },
);

apiClient.isAxiosError = axios.isAxiosError;

export async function logoutSession() {
  try {
    if (getSession()) {
      await apiClient.post(generateApiOrigin("/auth/logout"));
    }
  } finally {
    clearSession();
  }
}

export default apiClient;
