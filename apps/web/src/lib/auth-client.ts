import { usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { API_BASE } from "./api";

export const authClient = createAuthClient({
	baseURL: API_BASE || window.location.origin,
	plugins: [usernameClient()],
});

export const { useSession, signIn, signUp, signOut } = authClient;
