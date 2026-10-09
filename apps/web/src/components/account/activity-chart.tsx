import { useQuery } from "@tanstack/react-query";
import {
	Bar,
	BarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { activityQuery } from "@/lib/queries";

const DAYS = 90;
const MS_PER_DAY = 86_400_000;

export function ActivityChart() {
	const query = useQuery(activityQuery);
	const byDate = new Map(
		(query.data?.activity ?? []).map((d) => [d.date, d.tests])
	);
	const today = new Date();
	const data = Array.from({ length: DAYS }, (_, i) => {
		const date = new Date(today.getTime() - (DAYS - 1 - i) * MS_PER_DAY);
		const key = date.toISOString().slice(0, 10);
		return { date: key, label: key.slice(5), tests: byDate.get(key) ?? 0 };
	});

	return (
		<div className="flex flex-col gap-2">
			<h2 className="font-semibold text-main text-xl">
				activity (last {DAYS} days)
			</h2>
			<div className="rounded-lg bg-sub-alt p-3">
				<ResponsiveContainer height={140} width="100%">
					<BarChart
						data={data}
						margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
					>
						<XAxis
							dataKey="label"
							interval={Math.floor(DAYS / 6)}
							stroke="var(--sub-color)"
							tick={{ fill: "var(--sub-color)", fontSize: 11 }}
							tickLine={false}
						/>
						<YAxis
							allowDecimals={false}
							stroke="var(--sub-color)"
							tick={{ fill: "var(--sub-color)", fontSize: 11 }}
							tickLine={false}
						/>
						<Tooltip
							contentStyle={{
								background: "var(--bg-color)",
								border: "none",
								borderRadius: 6,
								color: "var(--text-color)",
								fontSize: 12,
							}}
							cursor={{
								fill: "color-mix(in srgb, var(--sub-color) 20%, transparent)",
							}}
							formatter={(value) => [value ?? 0, "tests"]}
						/>
						<Bar
							dataKey="tests"
							fill="var(--main-color)"
							isAnimationActive={false}
							radius={[2, 2, 0, 0]}
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
