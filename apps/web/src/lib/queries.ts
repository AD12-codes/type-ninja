import {
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import type {
	ActivityDay,
	AlgorithmDto,
	ExplanationDto,
	LanguageDto,
	LeaderboardQuery,
	LeaderboardResponse,
	PaginatedResults,
	ProfileDto,
	SnippetDto,
	SubmitResult,
	SubmitResultResponse,
	UpdateProfile,
} from "@type-ninja/shared/api";
import type { UserConfig } from "@type-ninja/shared/config";
import { api, query } from "./api";

const LONG_STALE = 1000 * 60 * 30;

export const metaQuery = queryOptions({
	queryKey: ["meta"],
	queryFn: () => api<{ socialProviders: string[]; version: string }>("/meta"),
	staleTime: LONG_STALE,
});

export const languagesQuery = queryOptions({
	queryKey: ["languages"],
	queryFn: () => api<{ languages: LanguageDto[] }>("/languages"),
	staleTime: LONG_STALE,
});

export const algorithmsQuery = queryOptions({
	queryKey: ["algorithms"],
	queryFn: () => api<{ algorithms: AlgorithmDto[] }>("/algorithms"),
	staleTime: LONG_STALE,
});

export const algorithmQuery = (slug: string) =>
	queryOptions({
		queryKey: ["algorithm", slug],
		queryFn: () =>
			api<{ algorithm: AlgorithmDto; explanation: ExplanationDto }>(
				`/algorithms/${slug}`
			),
		staleTime: LONG_STALE,
	});

export interface RandomSnippetParams {
	language: string;
	category: string;
	algorithm: string;
	exclude?: number;
}

export function fetchRandomSnippet(params: RandomSnippetParams) {
	return api<{ snippet: SnippetDto }>(
		`/snippets/random${query({ ...params })}`
	);
}

export const profileQuery = (username: string) =>
	queryOptions({
		queryKey: ["profile", username],
		queryFn: () =>
			api<{ profile: ProfileDto }>(`/users/${encodeURIComponent(username)}`),
	});

export const meQuery = queryOptions({
	queryKey: ["me"],
	queryFn: () => api<{ profile: ProfileDto }>("/users/me"),
});

export const activityQuery = queryOptions({
	queryKey: ["me", "activity"],
	queryFn: () => api<{ activity: ActivityDay[] }>("/users/me/activity"),
});

export const serverConfigQuery = queryOptions({
	queryKey: ["me", "config"],
	queryFn: () =>
		api<{ config: UserConfig | null; updatedAt: string | null }>(
			"/users/me/config"
		),
});

export const resultsQuery = (params: { page: number; pageSize: number }) =>
	queryOptions({
		queryKey: ["me", "results", params],
		queryFn: () => api<PaginatedResults>(`/results${query(params)}`),
	});

export const leaderboardQuery = (params: Partial<LeaderboardQuery>) =>
	queryOptions({
		queryKey: ["leaderboard", params],
		queryFn: () =>
			api<LeaderboardResponse>(
				`/leaderboards${query(params as Record<string, string | number | undefined>)}`
			),
	});

export function useSubmitResult() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: (body: SubmitResult) =>
			api<SubmitResultResponse>("/results", {
				method: "POST",
				body: JSON.stringify(body),
			}),
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ["me"] });
			client.invalidateQueries({ queryKey: ["leaderboard"] });
		},
	});
}

export function useSaveServerConfig() {
	return useMutation({
		mutationFn: (config: UserConfig) =>
			api<{ config: UserConfig }>("/users/me/config", {
				method: "PUT",
				body: JSON.stringify(config),
			}),
	});
}

export function useUpdateProfile() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: (body: UpdateProfile) =>
			api<{ profile: ProfileDto }>("/users/me", {
				method: "PATCH",
				body: JSON.stringify(body),
			}),
		onSuccess: () => client.invalidateQueries({ queryKey: ["me"] }),
	});
}

export function useResetAccount() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: () => api<{ ok: true }>("/results", { method: "DELETE" }),
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ["me"] });
			client.invalidateQueries({ queryKey: ["leaderboard"] });
		},
	});
}

export function useResetPersonalBests() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: () =>
			api<{ ok: true }>("/users/me/personal-bests", { method: "DELETE" }),
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ["me"] });
			client.invalidateQueries({ queryKey: ["leaderboard"] });
		},
	});
}

export function useAlgorithms() {
	return useQuery(algorithmsQuery);
}

export function useLanguages() {
	return useQuery(languagesQuery);
}
