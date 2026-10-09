import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ExplanationMarkdown } from "@/components/explanation/explanation-markdown";
import { OptionButton } from "@/components/settings/setting-group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { algorithmQuery, useLanguages } from "@/lib/queries";
import { useConfigStore } from "@/store/config-store";

export const Route = createFileRoute("/algorithms/$slug")({
	component: AlgorithmPage,
});

function AlgorithmPage() {
	const { slug } = Route.useParams();
	const navigate = useNavigate();
	const query = useQuery(algorithmQuery(slug));
	const languages = useLanguages();
	const config = useConfigStore((s) => s.config);
	const setConfig = useConfigStore((s) => s.setConfig);

	if (query.isPending) {
		return <p className="py-8 text-sub">loading…</p>;
	}
	if (query.isError || !query.data) {
		return <p className="py-8 text-error">algorithm not found</p>;
	}
	const { algorithm, explanation } = query.data;

	const practice = () => {
		setConfig("algorithm", algorithm.slug);
		navigate({ to: "/" });
	};

	return (
		<div className="grid gap-8 py-4 lg:grid-cols-[1fr_280px]">
			<div className="min-w-0">
				<Link className="text-sm text-sub hover:text-text" to="/algorithms">
					← all algorithms
				</Link>
				<div className="mt-2 mb-6 flex flex-wrap items-center gap-2">
					<h1 className="font-semibold text-3xl text-main">{algorithm.name}</h1>
					<Badge variant="secondary">{algorithm.category}</Badge>
					<Badge variant="secondary">{algorithm.difficulty}</Badge>
				</div>
				<ExplanationMarkdown hideTitle markdown={explanation.markdown} />
			</div>
			<aside className="flex h-fit flex-col gap-4 rounded-lg bg-sub-alt p-4 lg:sticky lg:top-4">
				<div>
					<div className="text-sub text-xs">complexity</div>
					<dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-3 text-sm">
						<dt className="text-sub">best</dt>
						<dd>{algorithm.complexity.timeBest}</dd>
						<dt className="text-sub">average</dt>
						<dd>{algorithm.complexity.timeAverage}</dd>
						<dt className="text-sub">worst</dt>
						<dd>{algorithm.complexity.timeWorst}</dd>
						<dt className="text-sub">space</dt>
						<dd>{algorithm.complexity.space}</dd>
					</dl>
				</div>
				<div>
					<div className="text-sub text-xs">tags</div>
					<div className="mt-1 flex flex-wrap gap-1">
						{algorithm.tags.map((tag) => (
							<Badge key={tag} variant="outline">
								{tag}
							</Badge>
						))}
					</div>
				</div>
				<div>
					<div className="text-sub text-xs">practice in</div>
					<div className="mt-1 flex flex-wrap gap-1">
						{(languages.data?.languages ?? [])
							.filter((l) => algorithm.languages.includes(l.id))
							.map((l) => (
								<OptionButton
									active={config.language === l.id}
									key={l.id}
									onClick={() => setConfig("language", l.id)}
								>
									{l.name.toLowerCase()}
								</OptionButton>
							))}
					</div>
				</div>
				<Button onClick={practice}>practice this algorithm</Button>
			</aside>
		</div>
	);
}
