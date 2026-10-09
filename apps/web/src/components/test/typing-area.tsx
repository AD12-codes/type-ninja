import type { UserConfig } from "@type-ninja/shared/config";
import { charStates, type TestState } from "@type-ninja/typing-engine";
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { cn } from "@/lib/utils";

interface TypingAreaProps {
	test: TestState;
	config: UserConfig;
	testId: number;
	onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
	/** Fallback for text inserted without key events (mobile keyboards, IME). */
	onInsertText?: (text: string) => void;
}

const VISIBLE_LINES = 10;
const ACTIVE_ROW = 3;
const OUT_OF_FOCUS_DELAY_MS = 1000;
const CARET_IDLE_MS = 1000;

export function TypingArea({
	test,
	config,
	testId,
	onKeyDown,
	onInsertText,
}: TypingAreaProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const linesRef = useRef<HTMLDivElement>(null);
	const caretRef = useRef<HTMLDivElement>(null);
	const [focused, setFocused] = useState(true);
	const [showUnfocused, setShowUnfocused] = useState(false);
	const [capsLock, setCapsLock] = useState(false);
	const [caretIdle, setCaretIdle] = useState(true);
	const idleTimer = useRef<number | null>(null);

	const focusInput = useCallback(() => {
		inputRef.current?.focus({ preventScroll: true });
	}, []);

	// Focus on mount and whenever a new test starts.
	// biome-ignore lint/correctness/useExhaustiveDependencies: testId triggers refocus
	useEffect(() => {
		focusInput();
	}, [focusInput, testId]);

	// Any key press while unfocused returns focus to the test.
	useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			if (document.activeElement === inputRef.current) {
				return;
			}
			const target = event.target as HTMLElement | null;
			const typingElsewhere =
				target &&
				(target.tagName === "INPUT" ||
					target.tagName === "TEXTAREA" ||
					target.isContentEditable ||
					target.closest("[cmdk-root]"));
			if (typingElsewhere || event.ctrlKey || event.metaKey) {
				return;
			}
			if (
				event.key.length === 1 ||
				event.key === "Enter" ||
				event.key === "Backspace"
			) {
				focusInput();
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [focusInput]);

	useEffect(() => {
		if (focused) {
			setShowUnfocused(false);
			return;
		}
		const timer = window.setTimeout(
			() => setShowUnfocused(true),
			OUT_OF_FOCUS_DELAY_MS
		);
		return () => window.clearTimeout(timer);
	}, [focused]);

	// Caret blinks only while idle.
	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run on every keystroke
	useEffect(() => {
		setCaretIdle(false);
		if (idleTimer.current) {
			window.clearTimeout(idleTimer.current);
		}
		idleTimer.current = window.setTimeout(
			() => setCaretIdle(true),
			CARET_IDLE_MS
		);
		return () => {
			if (idleTimer.current) {
				window.clearTimeout(idleTimer.current);
			}
		};
	}, [test]);

	// Position the caret on the active character.
	useLayoutEffect(() => {
		const container = linesRef.current;
		const caret = caretRef.current;
		if (!(container && caret)) {
			return;
		}
		const line = container.querySelector<HTMLElement>(
			`[data-line="${test.lineIndex}"]`
		);
		if (!line) {
			return;
		}
		const col = test.lines[test.lineIndex]?.typed.length ?? 0;
		const chars = line.querySelectorAll<HTMLElement>(".char");
		const containerRect = container.getBoundingClientRect();
		let x: number;
		let y: number;
		let height: number;
		const target = chars[col];
		if (target) {
			const rect = target.getBoundingClientRect();
			x = rect.left - containerRect.left;
			y = rect.top - containerRect.top;
			height = rect.height;
		} else {
			const last = chars.item(chars.length - 1);
			const content = line.querySelector<HTMLElement>(".line-content");
			const rect = (last ?? content ?? line).getBoundingClientRect();
			x = (last ? rect.right : rect.left) - containerRect.left;
			y = rect.top - containerRect.top;
			height = rect.height;
		}
		caret.style.transform = `translate(${x}px, ${y}px)`;
		caret.style.height = `${height}px`;
	}, [test]);

	const lineHeight = "calc(var(--test-font-size) * 1.6)";
	const scrollRow = Math.max(0, test.lineIndex - ACTIVE_ROW);
	const visibleLines = Math.min(VISIBLE_LINES, test.lines.length);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (config.capsLockWarning) {
			setCapsLock(event.getModifierState("CapsLock"));
		}
		onKeyDown(event);
	};

	const smoothClass =
		config.smoothCaret === "off" ? "" : `smooth-${config.smoothCaret}`;

	return (
		<div className="relative">
			{config.capsLockWarning && capsLock && (
				<div className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-main px-3 py-1 font-semibold text-bg text-sm">
					caps lock
				</div>
			)}
			{/* biome-ignore lint/a11y/noStaticElementInteractions: clicking anywhere focuses the hidden input */}
			{/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: clicking anywhere focuses the hidden input */}
			<div
				className={cn(
					"relative overflow-hidden transition-[filter] duration-200",
					showUnfocused && config.outOfFocusWarning && "blur-[4px]"
				)}
				onClick={focusInput}
				onKeyDown={undefined}
				style={{ height: `calc(${lineHeight} * ${visibleLines})` }}
			>
				<div
					className={cn(
						"test-words relative",
						config.blindMode && "blind",
						config.flipTestColors && "flipped",
						config.colorfulMode && "colorful",
						config.highlightMode === "letter" && "highlight-letter"
					)}
					ref={linesRef}
					style={{
						transform: `translateY(calc(${lineHeight} * -${scrollRow}))`,
						transition: config.smoothLineScroll
							? "transform 0.25s ease"
							: undefined,
					}}
				>
					{test.lines.map((line, index) => {
						const states = charStates(line);
						const display =
							line.typed.length > line.expected.length
								? line.typed
								: line.expected;
						return (
							<div
								className={cn(
									"line flex whitespace-pre",
									index === test.lineIndex &&
										config.highlightMode === "line" &&
										"active highlight"
								)}
								data-line={index}
								// biome-ignore lint/suspicious/noArrayIndexKey: lines are positional
								key={`${testId}-${index}`}
								style={{ height: lineHeight }}
							>
								{config.showLineNumbers && (
									<span className="line-number w-[3ch] shrink-0 select-none pr-[1ch] text-right">
										{index + 1}
									</span>
								)}
								<span className="line-content">
									{Array.from(display).map((char, col) => {
										const state = states[col] ?? "pending";
										const typed = line.typed[col];
										const shown =
											state === "incorrect" &&
											!config.blindMode &&
											typed !== undefined &&
											char !== " "
												? typed
												: char;
										return (
											<span
												className={cn("char", state, char === " " && "space")}
												// biome-ignore lint/suspicious/noArrayIndexKey: characters are positional
												key={col}
											>
												{shown === " " && state === "incorrect" ? " " : shown}
											</span>
										);
									})}
									{display.length === 0 && (
										<span className="char pending">{" "}</span>
									)}
								</span>
							</div>
						);
					})}
					{config.caretStyle !== "off" && focused && (
						<div
							className={cn(
								"caret",
								config.caretStyle,
								smoothClass,
								caretIdle && "blink"
							)}
							ref={caretRef}
						/>
					)}
				</div>
				<input
					aria-label="Typing input"
					autoCapitalize="off"
					autoComplete="off"
					autoCorrect="off"
					className="absolute inset-0 h-full w-full cursor-default opacity-0"
					onBeforeInput={(event) => {
						const native = event.nativeEvent as Partial<InputEvent>;
						const inserting =
							native.inputType === undefined ||
							native.inputType === "insertText";
						if (inserting && native.data) {
							event.preventDefault();
							onInsertText?.(native.data);
						}
					}}
					onBlur={() => setFocused(false)}
					onChange={() => undefined}
					onFocus={() => setFocused(true)}
					onKeyDown={handleKeyDown}
					onPaste={(e) => e.preventDefault()}
					ref={inputRef}
					spellCheck={false}
					tabIndex={0}
					type="text"
					value=""
				/>
			</div>
			{showUnfocused && config.outOfFocusWarning && (
				<button
					className="absolute inset-0 flex items-center justify-center gap-2 text-text"
					onClick={focusInput}
					type="button"
				>
					<span className="rounded-md bg-bg/70 px-4 py-2">
						click here or press any key to focus
					</span>
				</button>
			)}
		</div>
	);
}
