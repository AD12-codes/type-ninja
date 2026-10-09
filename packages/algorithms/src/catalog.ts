/**
 * The algorithm catalog: metadata for every algorithm typeninja ships.
 *
 * Snippet source lives in `content/snippets/<language>/<slug>.<ext>` and the
 * language-agnostic explanation lives in `content/explanations/<slug>.md`.
 */
export const CATEGORIES = [
	{ id: "sorting", name: "Sorting" },
	{ id: "searching", name: "Searching" },
	{ id: "math", name: "Math & Recursion" },
	{ id: "data-structures", name: "Data Structures" },
	{ id: "graphs", name: "Graphs & Trees" },
	{ id: "dynamic-programming", name: "Dynamic Programming" },
	{ id: "strings-arrays", name: "Strings & Arrays" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export interface Complexity {
	timeBest: string;
	timeAverage: string;
	timeWorst: string;
	space: string;
}

export interface AlgorithmMeta {
	slug: string;
	name: string;
	category: CategoryId;
	difficulty: Difficulty;
	/** One-sentence summary shown in lists and tooltips. */
	summary: string;
	tags: string[];
	complexity: Complexity;
}

const O1 = "O(1)";
const ON = "O(n)";
const ON2 = "O(n²)";
const ONLOGN = "O(n log n)";
const OLOGN = "O(log n)";

export const ALGORITHMS: AlgorithmMeta[] = [
	// ── Sorting ────────────────────────────────────────────────────────────
	{
		slug: "bubble-sort",
		name: "Bubble Sort",
		category: "sorting",
		difficulty: "easy",
		summary: "Repeatedly swaps adjacent out-of-order elements until sorted.",
		tags: ["sorting", "comparison", "in-place", "stable"],
		complexity: { timeBest: ON, timeAverage: ON2, timeWorst: ON2, space: O1 },
	},
	{
		slug: "selection-sort",
		name: "Selection Sort",
		category: "sorting",
		difficulty: "easy",
		summary:
			"Selects the minimum of the unsorted part and moves it to the front.",
		tags: ["sorting", "comparison", "in-place"],
		complexity: { timeBest: ON2, timeAverage: ON2, timeWorst: ON2, space: O1 },
	},
	{
		slug: "insertion-sort",
		name: "Insertion Sort",
		category: "sorting",
		difficulty: "easy",
		summary:
			"Builds the sorted array one element at a time by inserting in place.",
		tags: ["sorting", "comparison", "in-place", "stable", "online"],
		complexity: { timeBest: ON, timeAverage: ON2, timeWorst: ON2, space: O1 },
	},
	{
		slug: "merge-sort",
		name: "Merge Sort",
		category: "sorting",
		difficulty: "medium",
		summary: "Divides the array in halves, sorts each, then merges them back.",
		tags: ["sorting", "divide-and-conquer", "recursion", "stable"],
		complexity: {
			timeBest: ONLOGN,
			timeAverage: ONLOGN,
			timeWorst: ONLOGN,
			space: ON,
		},
	},
	{
		slug: "quick-sort",
		name: "Quick Sort",
		category: "sorting",
		difficulty: "medium",
		summary: "Partitions around a pivot and recursively sorts both sides.",
		tags: ["sorting", "divide-and-conquer", "recursion", "in-place"],
		complexity: {
			timeBest: ONLOGN,
			timeAverage: ONLOGN,
			timeWorst: ON2,
			space: OLOGN,
		},
	},
	{
		slug: "heap-sort",
		name: "Heap Sort",
		category: "sorting",
		difficulty: "hard",
		summary:
			"Builds a max-heap, then repeatedly extracts the maximum to the end.",
		tags: ["sorting", "heap", "in-place"],
		complexity: {
			timeBest: ONLOGN,
			timeAverage: ONLOGN,
			timeWorst: ONLOGN,
			space: O1,
		},
	},
	{
		slug: "counting-sort",
		name: "Counting Sort",
		category: "sorting",
		difficulty: "medium",
		summary:
			"Counts occurrences of each value to sort integers without comparisons.",
		tags: ["sorting", "non-comparison", "integers", "stable"],
		complexity: {
			timeBest: "O(n + k)",
			timeAverage: "O(n + k)",
			timeWorst: "O(n + k)",
			space: "O(k)",
		},
	},
	// ── Searching ──────────────────────────────────────────────────────────
	{
		slug: "linear-search",
		name: "Linear Search",
		category: "searching",
		difficulty: "easy",
		summary: "Scans every element in order until the target is found.",
		tags: ["searching", "arrays"],
		complexity: { timeBest: O1, timeAverage: ON, timeWorst: ON, space: O1 },
	},
	{
		slug: "binary-search",
		name: "Binary Search",
		category: "searching",
		difficulty: "easy",
		summary: "Halves the search range of a sorted array on every step.",
		tags: ["searching", "sorted", "divide-and-conquer"],
		complexity: {
			timeBest: O1,
			timeAverage: OLOGN,
			timeWorst: OLOGN,
			space: O1,
		},
	},
	// ── Math & Recursion ───────────────────────────────────────────────────
	{
		slug: "factorial",
		name: "Factorial",
		category: "math",
		difficulty: "easy",
		summary: "Computes n! recursively by multiplying n by (n-1)!.",
		tags: ["math", "recursion"],
		complexity: { timeBest: ON, timeAverage: ON, timeWorst: ON, space: ON },
	},
	{
		slug: "fibonacci",
		name: "Fibonacci (Memoized)",
		category: "math",
		difficulty: "easy",
		summary: "Computes the n-th Fibonacci number with memoized recursion.",
		tags: ["math", "recursion", "memoization", "dynamic-programming"],
		complexity: { timeBest: ON, timeAverage: ON, timeWorst: ON, space: ON },
	},
	{
		slug: "gcd",
		name: "GCD (Euclid)",
		category: "math",
		difficulty: "easy",
		summary: "Finds the greatest common divisor using Euclid's remainder loop.",
		tags: ["math", "number-theory"],
		complexity: {
			timeBest: O1,
			timeAverage: "O(log min(a, b))",
			timeWorst: "O(log min(a, b))",
			space: O1,
		},
	},
	{
		slug: "sieve-of-eratosthenes",
		name: "Sieve of Eratosthenes",
		category: "math",
		difficulty: "medium",
		summary: "Marks multiples of each prime to find all primes up to n.",
		tags: ["math", "primes", "number-theory"],
		complexity: {
			timeBest: "O(n log log n)",
			timeAverage: "O(n log log n)",
			timeWorst: "O(n log log n)",
			space: ON,
		},
	},
	{
		slug: "fast-power",
		name: "Fast Exponentiation",
		category: "math",
		difficulty: "medium",
		summary: "Computes base^exp by squaring, halving the exponent each step.",
		tags: ["math", "divide-and-conquer", "bit-manipulation"],
		complexity: {
			timeBest: OLOGN,
			timeAverage: OLOGN,
			timeWorst: OLOGN,
			space: O1,
		},
	},
	// ── Data Structures ────────────────────────────────────────────────────
	{
		slug: "stack",
		name: "Stack",
		category: "data-structures",
		difficulty: "easy",
		summary: "A last-in, first-out collection with push, pop and peek.",
		tags: ["data-structures", "lifo"],
		complexity: { timeBest: O1, timeAverage: O1, timeWorst: O1, space: ON },
	},
	{
		slug: "queue",
		name: "Queue",
		category: "data-structures",
		difficulty: "easy",
		summary: "A first-in, first-out collection with enqueue and dequeue.",
		tags: ["data-structures", "fifo"],
		complexity: { timeBest: O1, timeAverage: O1, timeWorst: O1, space: ON },
	},
	{
		slug: "reverse-linked-list",
		name: "Reverse Linked List",
		category: "data-structures",
		difficulty: "medium",
		summary: "Reverses a singly linked list in place by re-pointing each node.",
		tags: ["data-structures", "linked-list", "pointers"],
		complexity: { timeBest: ON, timeAverage: ON, timeWorst: ON, space: O1 },
	},
	{
		slug: "inorder-traversal",
		name: "Inorder Traversal",
		category: "data-structures",
		difficulty: "medium",
		summary: "Visits a binary tree left subtree, node, then right subtree.",
		tags: ["data-structures", "binary-tree", "recursion"],
		complexity: { timeBest: ON, timeAverage: ON, timeWorst: ON, space: "O(h)" },
	},
	// ── Graphs & Trees ─────────────────────────────────────────────────────
	{
		slug: "breadth-first-search",
		name: "Breadth-First Search",
		category: "graphs",
		difficulty: "medium",
		summary: "Explores a graph level by level using a queue.",
		tags: ["graphs", "traversal", "queue"],
		complexity: {
			timeBest: "O(V + E)",
			timeAverage: "O(V + E)",
			timeWorst: "O(V + E)",
			space: "O(V)",
		},
	},
	{
		slug: "depth-first-search",
		name: "Depth-First Search",
		category: "graphs",
		difficulty: "medium",
		summary: "Explores a graph as deep as possible before backtracking.",
		tags: ["graphs", "traversal", "recursion"],
		complexity: {
			timeBest: "O(V + E)",
			timeAverage: "O(V + E)",
			timeWorst: "O(V + E)",
			space: "O(V)",
		},
	},
	{
		slug: "dijkstra",
		name: "Dijkstra's Algorithm",
		category: "graphs",
		difficulty: "hard",
		summary: "Finds shortest paths from a source in a weighted graph.",
		tags: ["graphs", "shortest-path", "priority-queue", "greedy"],
		complexity: {
			timeBest: "O((V + E) log V)",
			timeAverage: "O((V + E) log V)",
			timeWorst: "O((V + E) log V)",
			space: "O(V)",
		},
	},
	{
		slug: "topological-sort",
		name: "Topological Sort (Kahn)",
		category: "graphs",
		difficulty: "hard",
		summary: "Orders DAG nodes so every edge points forward using in-degrees.",
		tags: ["graphs", "dag", "queue"],
		complexity: {
			timeBest: "O(V + E)",
			timeAverage: "O(V + E)",
			timeWorst: "O(V + E)",
			space: "O(V)",
		},
	},
	// ── Dynamic Programming ────────────────────────────────────────────────
	{
		slug: "longest-common-subsequence",
		name: "Longest Common Subsequence",
		category: "dynamic-programming",
		difficulty: "hard",
		summary:
			"Finds the longest subsequence shared by two strings with a 2D table.",
		tags: ["dynamic-programming", "strings", "2d-table"],
		complexity: {
			timeBest: "O(m·n)",
			timeAverage: "O(m·n)",
			timeWorst: "O(m·n)",
			space: "O(m·n)",
		},
	},
	{
		slug: "knapsack",
		name: "0/1 Knapsack",
		category: "dynamic-programming",
		difficulty: "hard",
		summary: "Maximizes value under a weight limit with a 1D DP array.",
		tags: ["dynamic-programming", "optimization"],
		complexity: {
			timeBest: "O(n·W)",
			timeAverage: "O(n·W)",
			timeWorst: "O(n·W)",
			space: "O(W)",
		},
	},
	{
		slug: "coin-change",
		name: "Coin Change",
		category: "dynamic-programming",
		difficulty: "medium",
		summary: "Finds the fewest coins that sum to an amount with bottom-up DP.",
		tags: ["dynamic-programming", "optimization"],
		complexity: {
			timeBest: "O(n·amount)",
			timeAverage: "O(n·amount)",
			timeWorst: "O(n·amount)",
			space: "O(amount)",
		},
	},
	// ── Strings & Arrays ───────────────────────────────────────────────────
	{
		slug: "palindrome-check",
		name: "Palindrome Check",
		category: "strings-arrays",
		difficulty: "easy",
		summary: "Compares characters from both ends moving inward.",
		tags: ["strings", "two-pointers"],
		complexity: { timeBest: O1, timeAverage: ON, timeWorst: ON, space: O1 },
	},
	{
		slug: "reverse-string",
		name: "Reverse String",
		category: "strings-arrays",
		difficulty: "easy",
		summary: "Reverses a string by swapping characters from both ends.",
		tags: ["strings", "two-pointers"],
		complexity: { timeBest: ON, timeAverage: ON, timeWorst: ON, space: ON },
	},
	{
		slug: "anagram-check",
		name: "Anagram Check",
		category: "strings-arrays",
		difficulty: "easy",
		summary: "Checks if two strings are anagrams by counting characters.",
		tags: ["strings", "hashing", "counting"],
		complexity: { timeBest: ON, timeAverage: ON, timeWorst: ON, space: "O(k)" },
	},
	{
		slug: "two-sum",
		name: "Two Sum",
		category: "strings-arrays",
		difficulty: "easy",
		summary: "Finds two indices whose values add to a target using a hash map.",
		tags: ["arrays", "hashing"],
		complexity: { timeBest: O1, timeAverage: ON, timeWorst: ON, space: ON },
	},
	{
		slug: "max-subarray",
		name: "Max Subarray (Kadane)",
		category: "strings-arrays",
		difficulty: "medium",
		summary: "Finds the contiguous subarray with the largest sum in one pass.",
		tags: ["arrays", "dynamic-programming", "greedy"],
		complexity: { timeBest: ON, timeAverage: ON, timeWorst: ON, space: O1 },
	},
	{
		slug: "valid-parentheses",
		name: "Valid Parentheses",
		category: "strings-arrays",
		difficulty: "easy",
		summary: "Validates bracket nesting with a stack of expected closers.",
		tags: ["strings", "stack"],
		complexity: { timeBest: ON, timeAverage: ON, timeWorst: ON, space: ON },
	},
];

export const ALGORITHM_SLUGS = ALGORITHMS.map((a) => a.slug);

export function getAlgorithm(slug: string): AlgorithmMeta | undefined {
	return ALGORITHMS.find((a) => a.slug === slug);
}
