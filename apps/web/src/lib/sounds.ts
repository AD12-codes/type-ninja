import type { UserConfig } from "@type-ninja/shared/config";

let context: AudioContext | null = null;

function getContext(): AudioContext | null {
	if (typeof window === "undefined" || !("AudioContext" in window)) {
		return null;
	}
	if (!context) {
		context = new AudioContext();
	}
	if (context.state === "suspended") {
		context.resume().catch(() => undefined);
	}
	return context;
}

function tone(
	frequency: number,
	durationMs: number,
	type: OscillatorType,
	gainValue: number
) {
	const ctx = getContext();
	if (!ctx) {
		return;
	}
	const oscillator = ctx.createOscillator();
	const gain = ctx.createGain();
	oscillator.type = type;
	oscillator.frequency.value = frequency;
	gain.gain.setValueAtTime(gainValue, ctx.currentTime);
	gain.gain.exponentialRampToValueAtTime(
		0.0001,
		ctx.currentTime + durationMs / 1000
	);
	oscillator.connect(gain).connect(ctx.destination);
	oscillator.start();
	oscillator.stop(ctx.currentTime + durationMs / 1000);
}

export function playClick(mode: UserConfig["soundOnClick"]) {
	switch (mode) {
		case "click":
			tone(1800, 30, "square", 0.04);
			break;
		case "beep":
			tone(880, 60, "sine", 0.06);
			break;
		case "typewriter":
			tone(220, 45, "triangle", 0.08);
			break;
		default:
			break;
	}
}

export function playError() {
	tone(160, 120, "sawtooth", 0.06);
}
