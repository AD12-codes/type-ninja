import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { serverConfigQuery, useSaveServerConfig } from "@/lib/queries";
import { useConfigStore } from "@/store/config-store";

const SYNC_DEBOUNCE_MS = 1500;

/**
 * Keeps the local config in sync with the server for signed-in users:
 * the server copy wins on sign-in, and later local edits are pushed back.
 */
export function useConfigSync() {
	const { data: session } = useSession();
	const userId = session?.user.id ?? null;
	const serverConfig = useQuery({
		...serverConfigQuery,
		enabled: userId !== null,
	});
	const save = useSaveServerConfig();
	const config = useConfigStore((s) => s.config);
	const updatedAt = useConfigStore((s) => s.updatedAt);
	const replaceConfig = useConfigStore((s) => s.replaceConfig);
	const hydratedFor = useRef<string | null>(null);
	const saveRef = useRef(save.mutate);
	saveRef.current = save.mutate;

	useEffect(() => {
		if (!(userId && serverConfig.isSuccess) || hydratedFor.current === userId) {
			return;
		}
		hydratedFor.current = userId;
		const remote = serverConfig.data.config;
		const remoteAt = serverConfig.data.updatedAt
			? new Date(serverConfig.data.updatedAt).getTime()
			: 0;
		if (remote && remoteAt >= updatedAt) {
			replaceConfig(remote, remoteAt);
		} else {
			saveRef.current(config);
		}
	}, [
		userId,
		serverConfig.isSuccess,
		serverConfig.data,
		replaceConfig,
		config,
		updatedAt,
	]);

	useEffect(() => {
		if (!userId || hydratedFor.current !== userId || updatedAt === 0) {
			return;
		}
		const timer = window.setTimeout(
			() => saveRef.current(config),
			SYNC_DEBOUNCE_MS
		);
		return () => window.clearTimeout(timer);
	}, [config, updatedAt, userId]);

	useEffect(() => {
		if (!userId) {
			hydratedFor.current = null;
		}
	}, [userId]);
}
