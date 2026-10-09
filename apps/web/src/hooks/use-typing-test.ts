import { useQueryClient } from "@tanstack/react-query";
import type { SubmitResult } from "@type-ninja/shared/api";
import type { UserConfig } from "@type-ninja/shared/config";
import type { KeyEvent, TestState } from "@type-ninja/typing-engine";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { ApiRequestError } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { fetchRandomSnippet, useSubmitResult } from "@/lib/queries";
import { playClick, playError } from "@/lib/sounds";
import { randomThemeName } from "@/lib/theme";
import { useConfigStore } from "@/store/config-store";
import { useTestStore } from "@/store/test-store";
import { useUIStore } from "@/store/ui-store";

/**
 * Wires the keyboard to the typing engine, loads snippets and submits results.
 * Returns handlers for the hidden input and the restart buttons.
 */
export function useTypingTest() {
	const config = useConfigStore((s) => s.config);
	const setConfig = useConfigStore((s) => s.setConfig);
	const phase = useTestStore((s) => s.phase);
	const snippet = useTestStore((s) => s.snippet);
	const test = useTestStore((s) => s.test);
	const { data: session } = useSession();
	const submit = useSubmitResult();
	const queryClient = useQueryClient();
	const openPalette = useUIStore((s) => s.openPalette);
	const loadToken = useRef(0);

	const load = useCallback(
		async (exclude?: number) => {
			const store = useTestStore.getState();
			const token = ++loadToken.current;
			store.startLoading();
			try {
				const { snippet: next } = await fetchRandomSnippet({
					language: config.language,
					category: config.category,
					algorithm: config.algorithm,
					exclude,
				});
				if (token !== loadToken.current) {
					return;
				}
				useTestStore
					.getState()
					.beginTest(next, useConfigStore.getState().config);
			} catch (error) {
				if (token !== loadToken.current) {
					return;
				}
				const message =
					error instanceof ApiRequestError
						? error.message
						: "Could not reach the server. Is the API running?";
				useTestStore.getState().setError(message);
			}
		},
		[config.language, config.category, config.algorithm]
	);

	/** Starts a fresh test with a new snippet. */
	const nextTest = useCallback(() => {
		const store = useTestStore.getState();
		if (store.phase === "typing" && store.test?.status === "running") {
			store.countRestart();
		}
		load(store.snippet?.id);
	}, [load]);

	/** Restarts the current snippet from the beginning. */
	const repeatTest = useCallback(() => {
		const store = useTestStore.getState();
		if (!store.snippet) {
			load();
			return;
		}
		if (store.phase === "typing" && store.test?.status === "running") {
			store.countRestart();
		}
		store.beginTest(store.snippet, useConfigStore.getState().config);
	}, [load]);

	// Load a snippet whenever the test selection changes.
	useEffect(() => {
		load();
	}, [load]);

	// Re-create the engine when behaviour settings change before typing starts.
	useEffect(() => {
		const store = useTestStore.getState();
		if (
			store.phase === "typing" &&
			store.test?.status === "idle" &&
			store.snippet
		) {
			store.beginTest(store.snippet, config);
		}
	}, [config]);

	const finishTest = useCallback(() => {
		const store = useTestStore.getState();
		const result = store.finish(config);
		if (!result) {
			return;
		}
		if (config.randomTheme !== "off") {
			setConfig("theme", randomThemeName(config.randomTheme, config.theme));
		}
		if (!session?.user) {
			return;
		}
		const body: SubmitResult = {
			snippetId: result.snippet.id,
			difficulty: result.config.difficulty,
			wpm: result.stats.wpm,
			raw: result.stats.raw,
			accuracy: result.stats.accuracy,
			consistency: result.stats.consistency,
			durationMs: result.stats.durationMs,
			chars: result.stats.chars,
			keypresses: result.state.keypresses,
			chart: result.stats.chart,
			stopOnError: result.config.stopOnError,
			autoIndent: result.config.autoIndent,
			blindMode: result.config.blindMode,
			restartCount: store.restartCount,
		};
		store.setSubmission({ saving: true });
		submit.mutate(body, {
			onSuccess: (response) => {
				useTestStore
					.getState()
					.setSubmission({ submission: response, saving: false });
				useTestStore.getState().resetRestartCount();
				if (response.isPersonalBest) {
					toast.success("New personal best!");
				}
				queryClient.invalidateQueries({ queryKey: ["me"] });
			},
			onError: (error) => {
				useTestStore.getState().setSubmission({
					submissionError:
						error instanceof Error ? error.message : "Could not save result",
					saving: false,
				});
				toast.error("Could not save your result");
			},
		});
	}, [config, session?.user, setConfig, submit, queryClient]);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>) => {
			const shortcut = handleShortcut(
				event,
				config.quickRestart,
				nextTest,
				openPalette
			);
			if (shortcut) {
				return;
			}
			const store = useTestStore.getState();
			if (store.phase !== "typing" || !store.test) {
				return;
			}
			const time = performance.now();
			if (event.ctrlKey || event.metaKey) {
				if (event.key === "Backspace" || event.key === "h") {
					event.preventDefault();
					store.dispatch({ type: "backspace", word: true, time });
				}
				return;
			}
			const keyEvent = toKeyEvent(event, time);
			if (!keyEvent) {
				return;
			}
			event.preventDefault();
			const before = store.test;
			const after = store.dispatch(keyEvent);
			if (keyEvent.type === "char" || keyEvent.type === "enter") {
				playFeedback(before, after, config);
			}
			if (after?.status === "finished") {
				finishTest();
			}
		},
		[config, nextTest, openPalette, finishTest]
	);

	/** Text inserted without keydown events (mobile keyboards, IME composition). */
	const handleInsertText = useCallback(
		(text: string) => {
			const store = useTestStore.getState();
			if (store.phase !== "typing" || !store.test) {
				return;
			}
			for (const char of text) {
				const time = performance.now();
				const before = useTestStore.getState().test;
				const keyEvent: KeyEvent =
					char === "\n"
						? { type: "enter", time }
						: { type: "char", char, time };
				const after = useTestStore.getState().dispatch(keyEvent);
				playFeedback(before, after, config);
				if (after?.status === "finished") {
					finishTest();
					return;
				}
			}
		},
		[config, finishTest]
	);

	// Failed tests (expert/master) restart automatically after a short notice.
	useEffect(() => {
		if (test?.status !== "failed") {
			return;
		}
		toast.error(test.failReason ?? "Test failed");
		const timer = window.setTimeout(repeatTest, 800);
		return () => window.clearTimeout(timer);
	}, [test?.status, test?.failReason, repeatTest]);

	return {
		phase,
		snippet,
		test,
		handleKeyDown,
		handleInsertText,
		nextTest,
		repeatTest,
	};
}

/** Handles tab/esc shortcuts. Returns true when the key was consumed. */
function handleShortcut(
	event: React.KeyboardEvent<HTMLInputElement>,
	quickRestart: UserConfig["quickRestart"],
	nextTest: () => void,
	openPalette: () => void
): boolean {
	if (event.key === "Tab" && quickRestart === "tab") {
		event.preventDefault();
		nextTest();
		return true;
	}
	if (event.key === "Escape") {
		event.preventDefault();
		if (quickRestart === "esc") {
			nextTest();
		} else {
			openPalette();
		}
		return true;
	}
	return false;
}

function toKeyEvent(
	event: React.KeyboardEvent<HTMLInputElement>,
	time: number
): KeyEvent | null {
	switch (event.key) {
		case "Backspace":
			return { type: "backspace", word: event.altKey, time };
		case "Enter":
			return { type: "enter", time };
		case "Tab":
			return { type: "tab", time };
		default:
			if (event.key.length !== 1 || event.altKey) {
				return null;
			}
			return { type: "char", char: event.key, time };
	}
}

function playFeedback(
	before: TestState | null,
	after: TestState | null,
	config: UserConfig
) {
	if (!(before && after)) {
		return;
	}
	if (after.keypresses.incorrect > before.keypresses.incorrect) {
		if (config.soundOnError) {
			playError();
		} else {
			playClick(config.soundOnClick);
		}
		return;
	}
	if (after !== before) {
		playClick(config.soundOnClick);
	}
}
