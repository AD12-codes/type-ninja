import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
	component: AboutPage,
});

function Section({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<section className="flex flex-col gap-2">
			<h2 className="font-semibold text-main text-xl">{title}</h2>
			<div className="space-y-2 text-sm text-text leading-relaxed">
				{children}
			</div>
		</section>
	);
}

function AboutPage() {
	return (
		<div className="flex max-w-3xl flex-col gap-8 py-4">
			<h1 className="font-semibold text-3xl text-main">about</h1>
			<Section title="what is typeninja?">
				<p>
					typeninja is a minimalistic typing test built for programmers. Instead
					of English words you type real algorithm implementations - bubble
					sort, dijkstra, binary search and more - in the language of your
					choice. It is inspired by monkeytype and follows the same conventions
					for measuring speed so that your numbers mean what you expect.
				</p>
				<p>
					There is no timer. A test ends when you finish the snippet, and your
					speed is calculated from the time between your first and last key
					press. Nothing about the code is executed or checked for correctness:
					this is purely about typing speed and accuracy.
				</p>
			</Section>
			<Section title="stats">
				<p>
					<span className="text-main">wpm</span> - words per minute. A "word" is
					five characters including spaces and newlines. Only correctly typed
					characters count. Indentation skipped by auto indent is never counted,
					so it cannot inflate your result.
				</p>
				<p>
					<span className="text-main">raw wpm</span> - the same calculation
					using every character you typed, including incorrect and extra ones.
				</p>
				<p>
					<span className="text-main">acc</span> - percentage of key presses
					that were correct. Fixing a mistake does not undo it.
				</p>
				<p>
					<span className="text-main">consistency</span> - how even your pace
					was, based on the variation of your raw speed per second. 100% means
					you typed at a perfectly steady pace.
				</p>
				<p>
					<span className="text-main">characters</span> - correct / incorrect /
					extra / missed.
				</p>
			</Section>
			<Section title="leaderboards">
				<p>
					Your best run per language is placed on the all-time leaderboard, as
					long as its accuracy is at least 80% and blind mode was off. The daily
					board shows the best run of each user in the last 24 hours. You need
					an account so that results can be stored.
				</p>
			</Section>
			<Section title="explanations">
				<p>
					Every algorithm has an "explain" button that shows how the algorithm
					works, a flow diagram, its complexity and the common pitfalls.
					Explanations are written once in plain English and are the same
					regardless of programming language. Browse them on the{" "}
					<Link className="text-main hover:underline" to="/algorithms">
						algorithms page
					</Link>
					.
				</p>
			</Section>
			<Section title="keyboard shortcuts">
				<p>
					tab or esc - restart with a new snippet (configurable in settings)
				</p>
				<p>esc or ctrl/cmd + shift + p - open the command line</p>
				<p>ctrl/cmd + backspace - delete the previous word</p>
			</Section>
		</div>
	);
}
