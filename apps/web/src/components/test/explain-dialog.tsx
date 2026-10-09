import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ExplanationMarkdown } from "@/components/explanation/explanation-markdown";
import { Badge } from "@/components/ui/badge";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { algorithmQuery } from "@/lib/queries";
import { useTestStore } from "@/store/test-store";
import { useUIStore } from "@/store/ui-store";

export function ExplainDialog() {
	const open = useUIStore((s) => s.explainOpen);
	const setOpen = useUIStore((s) => s.setExplainOpen);
	const snippet = useTestStore((s) => s.snippet);
	const slug = snippet?.algorithm.slug;
	const query = useQuery({
		...algorithmQuery(slug ?? ""),
		enabled: open && Boolean(slug),
	});

	return (
		<Sheet onOpenChange={setOpen} open={open}>
			<SheetContent
				className="w-full overflow-y-auto sm:max-w-2xl"
				side="right"
			>
				<SheetHeader>
					<SheetTitle className="text-main">
						{snippet?.algorithm.name ?? "Algorithm"}
					</SheetTitle>
					<SheetDescription>{snippet?.algorithm.summary}</SheetDescription>
					{snippet && (
						<div className="flex flex-wrap gap-2 pt-1">
							<Badge variant="secondary">{snippet.algorithm.category}</Badge>
							<Badge variant="secondary">{snippet.algorithm.difficulty}</Badge>
							<Badge variant="outline">
								time {snippet.algorithm.complexity.timeAverage} · space{" "}
								{snippet.algorithm.complexity.space}
							</Badge>
						</div>
					)}
				</SheetHeader>
				<div className="px-4 pb-8">
					{query.isPending && (
						<p className="text-sm text-sub">loading explanation…</p>
					)}
					{query.isError && (
						<p className="text-error text-sm">could not load the explanation</p>
					)}
					{query.data && (
						<>
							<ExplanationMarkdown
								hideTitle
								markdown={query.data.explanation.markdown}
							/>
							<p className="mt-6 text-sm text-sub">
								<Link
									className="text-main hover:underline"
									onClick={() => setOpen(false)}
									params={{ slug: query.data.algorithm.slug }}
									to="/algorithms/$slug"
								>
									open full page
								</Link>
							</p>
						</>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
