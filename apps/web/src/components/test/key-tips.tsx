import type { UserConfig } from "@type-ninja/shared/config";

function Key({ children }: { children: React.ReactNode }) {
	return (
		<kbd className="rounded bg-sub px-1.5 py-0.5 font-mono text-bg text-xs">
			{children}
		</kbd>
	);
}

export function KeyTips({
	config,
}: {
	config: Pick<UserConfig, "quickRestart">;
}) {
	const restart =
		config.quickRestart === "off" ? (
			<>
				<Key>tab</Key> + <Key>enter</Key>
			</>
		) : (
			<Key>{config.quickRestart}</Key>
		);
	return (
		<div className="flex flex-col items-center gap-1 text-sub text-xs">
			<div>{restart} - restart test</div>
			<div>
				<Key>esc</Key> or <Key>ctrl</Key> + <Key>shift</Key> + <Key>p</Key> -
				command line
			</div>
		</div>
	);
}
