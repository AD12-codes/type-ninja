import type { ChartPoint } from "@type-ninja/typing-engine";
import {
	CartesianGrid,
	ComposedChart,
	Legend,
	Line,
	ResponsiveContainer,
	Scatter,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface ResultChartProps {
	chart: ChartPoint[];
	unit: string;
}

function ErrorDot(props: { cx?: number; cy?: number; payload?: ChartPoint }) {
	const { cx, cy, payload } = props;
	if (
		cx === undefined ||
		cy === undefined ||
		!payload ||
		payload.errors === 0
	) {
		return null;
	}
	return (
		<g>
			<line
				stroke="var(--error-color)"
				strokeWidth={2}
				x1={cx - 4}
				x2={cx + 4}
				y1={cy - 4}
				y2={cy + 4}
			/>
			<line
				stroke="var(--error-color)"
				strokeWidth={2}
				x1={cx - 4}
				x2={cx + 4}
				y1={cy + 4}
				y2={cy - 4}
			/>
		</g>
	);
}

export function ResultChart({ chart, unit }: ResultChartProps) {
	const data = chart.map((point) => ({
		...point,
		errorY: point.errors > 0 ? 0 : null,
	}));
	return (
		<ResponsiveContainer height={220} width="100%">
			<ComposedChart
				data={data}
				margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
			>
				<CartesianGrid
					stroke="var(--sub-alt-color)"
					strokeDasharray="0"
					vertical={false}
				/>
				<XAxis
					dataKey="second"
					stroke="var(--sub-color)"
					tick={{ fill: "var(--sub-color)", fontSize: 12 }}
					tickLine={false}
				/>
				<YAxis
					stroke="var(--sub-color)"
					tick={{ fill: "var(--sub-color)", fontSize: 12 }}
					tickLine={false}
					width={36}
				/>
				<Tooltip
					contentStyle={{
						background: "var(--sub-alt-color)",
						border: "none",
						borderRadius: 6,
						color: "var(--text-color)",
						fontSize: 12,
					}}
					cursor={{ stroke: "var(--sub-color)" }}
					formatter={(value, name) => [value ?? 0, String(name)]}
					labelFormatter={(label) => `${label}s`}
				/>
				<Legend
					iconSize={10}
					wrapperStyle={{ color: "var(--sub-color)", fontSize: 12 }}
				/>
				<Line
					dataKey="raw"
					dot={false}
					isAnimationActive={false}
					name={`raw ${unit}`}
					stroke="var(--sub-color)"
					strokeWidth={2}
					type="monotone"
				/>
				<Line
					dataKey="wpm"
					dot={false}
					isAnimationActive={false}
					name={unit}
					stroke="var(--main-color)"
					strokeWidth={2}
					type="monotone"
				/>
				<Scatter
					dataKey="errorY"
					fill="var(--error-color)"
					isAnimationActive={false}
					legendType="cross"
					name="errors"
					shape={<ErrorDot />}
				/>
			</ComposedChart>
		</ResponsiveContainer>
	);
}
