import { usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { API_BASE } from "./api";

export const authClient = createAuthClient({
	baseURL: API_BASE || window.location.origin,
	plugins: [usernameClient()],
});

export const { useSession, signIn, signUp, signOut } = authClient;

/**
 * Re-reads the session from the database, bypassing the cookie cache, so
 * profile changes (like a new username) show up immediately.
 */
export async function refreshSession() {
	await authClient.getSession({ query: { disableCookieCache: true } });
}
