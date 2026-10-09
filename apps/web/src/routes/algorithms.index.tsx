import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { CATEGORIES } from "@type-ninja/algorithms";
import type { AlgorithmDto } from "@type-ninja/shared/api";
import { useCallback, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useAlgorithms } from "@/lib/queries";
import { useConfigStore } from "@/store/config-store";

export const Route = createFileRoute("/algorithms/")({
	component: AlgorithmsPage,
});

function AlgorithmsPage() {
	const algorithms = useAlgorithms();
	const navigate = useNavigate();
	const setConfig = useConfigStore((s) => s.setConfig);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [filter, setFilter] = useState("");

	const categoryName = (id: string) =>
		CATEGORIES.find((c) => c.id === id)?.name ?? id;

	const practice = useCallback(
		(slug: string) => {
			setConfig("algorithm", slug);
			navigate({ to: "/" });
		},
		[setConfig, navigate]
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: categoryName is a pure module-level helper
	const columns = useMemo<ColumnDef<AlgorithmDto>[]>(
		() => [
			{
				accessorKey: "name",
				header: "algorithm",
				cell: ({ row }) => (
					<Link
						className="text-text hover:text-main"
						params={{ slug: row.original.slug }}
						to="/algorithms/$slug"
					>
						{row.original.name}
					</Link>
				),
			},
			{
				accessorKey: "category",
				header: "category",
				cell: ({ row }) => categoryName(row.original.category),
			},
			{
				accessorKey: "difficulty",
				header: "difficulty",
				cell: ({ row }) => (
					<Badge variant="secondary">{row.original.difficulty}</Badge>
				),
			},
			{
				id: "time",
				header: "time (avg)",
				accessorFn: (row) => row.complexity.timeAverage,
			},
			{
				id: "space",
				header: "space",
				accessorFn: (row) => row.complexity.space,
			},
			{
				id: "languages",
				header: "languages",
				accessorFn: (row) => row.languages.length,
			},
			{
				id: "actions",
				header: "",
				cell: ({ row }) => (
					<Button
						onClick={() => practice(row.original.slug)}
						size="sm"
						variant="outline"
					>
						practice
					</Button>
				),
			},
		],
		[practice]
	);

	const table = useReactTable({
		data: algorithms.data?.algorithms ?? [],
		columns,
		state: { sorting, globalFilter: filter },
		onSortingChange: setSorting,
		onGlobalFilterChange: setFilter,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	return (
		<div className="flex flex-col gap-6 py-4">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="font-semibold text-3xl text-main">algorithms</h1>
					<p className="text-sm text-sub">
						every algorithm ships in{" "}
						{algorithms.data?.algorithms[0]?.languages.length ?? 12} languages
						with a plain-english explanation and flow diagram.
					</p>
				</div>
				<Input
					aria-label="search algorithms"
					className="w-64"
					onChange={(e) => setFilter(e.target.value)}
					placeholder="search…"
					value={filter}
				/>
			</div>
			<div className="overflow-x-auto rounded-lg bg-sub-alt">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((group) => (
							<TableRow className="hover:bg-transparent" key={group.id}>
								{group.headers.map((header) => (
									<TableHead
										className="cursor-pointer select-none text-sub"
										key={header.id}
										onClick={header.column.getToggleSortingHandler()}
									>
										{flexRender(
											header.column.columnDef.header,
											header.getContext()
										)}
										{{ asc: " ↑", desc: " ↓" }[
											header.column.getIsSorted() as string
										] ?? ""}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{algorithms.isPending && (
							<TableRow>
								<TableCell className="text-sub" colSpan={columns.length}>
									loading…
								</TableCell>
							</TableRow>
						)}
						{table.getRowModel().rows.map((row) => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
