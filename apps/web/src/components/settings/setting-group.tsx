import type { UserConfig } from "@type-ninja/shared/config";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import type { SettingDefinition } from "@/lib/settings";
import { cn } from "@/lib/utils";
import { useConfigStore } from "@/store/config-store";

export function OptionButton({
	active,
	onClick,
	children,
}: {
	active: boolean;
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<button
			className={cn(
				"rounded-md px-3 py-1.5 text-sm transition-colors",
				active
					? "bg-main text-bg"
					: "bg-sub-alt text-text hover:bg-sub hover:text-bg"
			)}
			onClick={onClick}
			type="button"
		>
			{children}
		</button>
	);
}

export function SettingGroup({ setting }: { setting: SettingDefinition }) {
	const value = useConfigStore((s) => s.config[setting.key]);
	const setConfig = useConfigStore((s) => s.setConfig);
	const [custom, setCustom] = useState("");

	const set = (next: UserConfig[typeof setting.key]) =>
		setConfig(setting.key, next as never);

	return (
		<div
			className="grid gap-2 md:grid-cols-[1fr_auto] md:items-center"
			id={setting.key}
		>
			<div>
				<h3 className="text-lg text-text">{setting.title}</h3>
				<p className="text-sm text-sub">{setting.description}</p>
			</div>
			<div className="flex flex-wrap gap-1 md:justify-end">
				{setting.type === "boolean" && (
					<>
						<OptionButton
							active={value === false}
							onClick={() => set(false as never)}
						>
							off
						</OptionButton>
						<OptionButton
							active={value === true}
							onClick={() => set(true as never)}
						>
							on
						</OptionButton>
					</>
				)}
				{setting.type === "enum" &&
					setting.options.map((option) => (
						<OptionButton
							active={value === option.value}
							key={String(option.value)}
							onClick={() => set(option.value as never)}
						>
							{option.label}
						</OptionButton>
					))}
				{setting.type === "number" && (
					<>
						{setting.presets.map((preset) => (
							<OptionButton
								active={value === preset.value}
								key={String(preset.value)}
								onClick={() => set(preset.value as never)}
							>
								{preset.label}
							</OptionButton>
						))}
						<Input
							aria-label={`custom ${setting.title}`}
							className="w-20"
							max={setting.max}
							min={setting.min}
							onBlur={() => {
								const parsed = Number(custom);
								if (custom !== "" && Number.isFinite(parsed)) {
									const clamped = Math.min(
										setting.max,
										Math.max(setting.min, parsed)
									);
									set(clamped as never);
									setCustom("");
								}
							}}
							onChange={(e) => setCustom(e.target.value)}
							placeholder={String(value)}
							step={setting.step}
							type="number"
							value={custom}
						/>
					</>
				)}
			</div>
		</div>
	);
}
