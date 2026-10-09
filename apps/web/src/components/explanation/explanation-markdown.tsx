import type { ComponentProps } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MermaidDiagram } from "./mermaid-diagram";

interface ExplanationMarkdownProps {
	markdown: string;
	/** Hide the top-level title when the surrounding UI already shows it. */
	hideTitle?: boolean;
}

type CodeProps = ComponentProps<"code"> & { node?: unknown };

const TRAILING_NEWLINE = /\n$/;
const TITLE_LINE = /^# .*\n/;

function Code({ className, children, ...props }: CodeProps) {
	const text = String(children ?? "").replace(TRAILING_NEWLINE, "");
	if (className?.includes("language-mermaid")) {
		return <MermaidDiagram chart={text} />;
	}
	const inline = !className;
	if (inline) {
		return (
			<code
				className="rounded bg-sub-alt px-1 py-0.5 text-main text-sm"
				{...props}
			>
				{children}
			</code>
		);
	}
	return (
		<code className={className} {...props}>
			{children}
		</code>
	);
}

export function ExplanationMarkdown({
	markdown,
	hideTitle,
}: ExplanationMarkdownProps) {
	const content = hideTitle ? markdown.replace(TITLE_LINE, "") : markdown;
	return (
		<div className="explanation max-w-none space-y-4 text-text leading-relaxed">
			<Markdown
				components={{
					h1: ({ children }) => (
						<h1 className="font-semibold text-2xl text-main">{children}</h1>
					),
					h2: ({ children }) => (
						<h2 className="mt-6 font-semibold text-lg text-main">{children}</h2>
					),
					p: ({ children }) => <p className="text-sm">{children}</p>,
					ol: ({ children }) => (
						<ol className="list-decimal space-y-1 pl-6 text-sm">{children}</ol>
					),
					ul: ({ children }) => (
						<ul className="list-disc space-y-1 pl-6 text-sm">{children}</ul>
					),
					li: ({ children }) => <li>{children}</li>,
					table: ({ children }) => (
						<div className="overflow-x-auto">
							<table className="w-full text-left text-sm">{children}</table>
						</div>
					),
					th: ({ children }) => (
						<th className="border-sub-alt border-b py-1 pr-4 font-medium text-sub">
							{children}
						</th>
					),
					td: ({ children }) => (
						<td className="border-sub-alt border-b py-1 pr-4">{children}</td>
					),
					pre: ({ children }) => <>{children}</>,
					code: Code,
					strong: ({ children }) => (
						<strong className="font-semibold text-text">{children}</strong>
					),
				}}
				remarkPlugins={[remarkGfm]}
			>
				{content}
			</Markdown>
		</div>
	);
}
