import { useQuery } from "@tanstack/react-query";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import type { ResultDto } from "@type-ninja/shared/api";
import type { UserConfig } from "@type-ninja/shared/config";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	formatDateTime,
	formatPercent,
	formatSeconds,
	formatSpeed,
} from "@/lib/format";
import { resultsQuery } from "@/lib/queries";

const PAGE_SIZE = 25;

interface ResultsTableProps {
	config: Pick<UserConfig, "typingSpeedUnit" | "alwaysShowDecimalPlaces">;
}

export function ResultsTable({ config }: ResultsTableProps) {
	const [page, setPage] = useState(0);
	const [sorting, setSorting] = useState<SortingState>([]);
	const query = useQuery(resultsQuery({ page, pageSize: PAGE_SIZE }));

	const columns = useMemo<ColumnDef<ResultDto>[]>(
		() => [
			{
				accessorKey: "wpm",
				header: config.typingSpeedUnit,
				cell: ({ row }) => (
					<span className="text-main">
						{formatSpeed(row.original.wpm, config)}
						{row.original.isPersonalBest && (
							<span className="ml-1 text-xs">★</span>
						)}
					</span>
				),
			},
			{
				accessorKey: "raw",
				header: "raw",
				cell: ({ row }) => formatSpeed(row.original.raw, config),
			},
			{
				accessorKey: "accuracy",
				header: "acc",
				cell: ({ row }) => formatPercent(row.original.accuracy, config),
			},
			{
				accessorKey: "consistency",
				header: "consistency",
				cell: ({ row }) => formatPercent(row.original.consistency, config),
			},
			{
				id: "chars",
				header: "chars",
				cell: ({ row }) =>
					`${row.original.chars.correct}/${row.original.chars.incorrect}/${row.original.chars.extra}/${row.original.chars.missed}`,
			},
			{ accessorKey: "language", header: "language" },
			{ accessorKey: "algorithmName", header: "algorithm" },
			{ accessorKey: "difficulty", header: "mode" },
			{
				accessorKey: "durationMs",
				header: "time",
				cell: ({ row }) => formatSeconds(row.original.durationMs),
			},
			{
				accessorKey: "createdAt",
				header: "date",
				cell: ({ row }) => formatDateTime(row.original.createdAt),
			},
		],
		[config]
	);

	const table = useReactTable({
		data: query.data?.results ?? [],
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	const total = query.data?.total ?? 0;
	const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<h2 className="font-semibold text-main text-xl">results</h2>
				<span className="text-sm text-sub">{total} total</span>
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
						{query.isPending && (
							<TableRow>
								<TableCell className="text-sub" colSpan={columns.length}>
									loading…
								</TableCell>
							</TableRow>
						)}
						{query.data?.results.length === 0 && (
							<TableRow>
								<TableCell className="text-sub" colSpan={columns.length}>
									no results yet. complete a test to see it here.
								</TableCell>
							</TableRow>
						)}
						{table.getRowModel().rows.map((row) => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<TableCell className="whitespace-nowrap" key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			{pages > 1 && (
				<div className="flex items-center justify-end gap-2 text-sm text-sub">
					<Button
						disabled={page === 0}
						onClick={() => setPage((p) => p - 1)}
						size="sm"
						variant="ghost"
					>
						previous
					</Button>
					<span>
						page {page + 1} / {pages}
					</span>
					<Button
						disabled={page + 1 >= pages}
						onClick={() => setPage((p) => p + 1)}
						size="sm"
						variant="ghost"
					>
						next
					</Button>
				</div>
			)}
		</div>
	);
}
