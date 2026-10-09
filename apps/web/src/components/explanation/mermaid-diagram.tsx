import { useEffect, useId, useRef, useState } from "react";
import { useConfigStore } from "@/store/config-store";

interface MermaidDiagramProps {
	chart: string;
}

let renderCounter = 0;
const COLONS = /:/g;

/** Renders a mermaid diagram using the active theme's colours. */
export function MermaidDiagram({ chart }: MermaidDiagramProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [error, setError] = useState<string | null>(null);
	const theme = useConfigStore((s) => s.config.theme);
	const id = useId().replace(COLONS, "");

	// biome-ignore lint/correctness/useExhaustiveDependencies: theme changes must re-render the diagram
	useEffect(() => {
		let cancelled = false;
		const render = async () => {
			const { default: mermaid } = await import("mermaid");
			const styles = getComputedStyle(document.documentElement);
			const read = (name: string) => styles.getPropertyValue(name).trim();
			mermaid.initialize({
				startOnLoad: false,
				securityLevel: "strict",
				theme: "base",
				fontFamily: "inherit",
				themeVariables: {
					background: read("--bg-color"),
					primaryColor: read("--sub-alt-color"),
					primaryTextColor: read("--text-color"),
					primaryBorderColor: read("--main-color"),
					lineColor: read("--sub-color"),
					secondaryColor: read("--sub-alt-color"),
					tertiaryColor: read("--bg-color"),
					edgeLabelBackground: read("--bg-color"),
					fontSize: "14px",
				},
			});
			try {
				renderCounter += 1;
				const { svg } = await mermaid.render(
					`mermaid-${id}-${renderCounter}`,
					chart
				);
				if (!cancelled && ref.current) {
					ref.current.innerHTML = svg;
					setError(null);
				}
			} catch (err) {
				if (!cancelled) {
					setError(
						err instanceof Error ? err.message : "Could not render diagram"
					);
				}
			}
		};
		render().catch(() => undefined);
		return () => {
			cancelled = true;
		};
	}, [chart, theme, id]);

	if (error) {
		return (
			<pre className="overflow-auto rounded-md bg-sub-alt p-3 text-error text-xs">
				{error}
			</pre>
		);
	}
	return <div className="mermaid-diagram my-4 overflow-x-auto" ref={ref} />;
}
