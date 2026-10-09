import { cn } from "@/lib/utils";

interface LogoProps {
	className?: string;
	/** Colour of the shuriken; defaults to the theme's main colour. */
	accent?: string;
}

/**
 * typeninja mark: a shuriken slicing a keyboard in two. The keyboard uses
 * `currentColor` so it follows the surrounding text colour; the shuriken uses
 * the theme's main colour.
 */
export function Logo({ className, accent = "var(--main-color)" }: LogoProps) {
	return (
		<svg
			aria-hidden="true"
			className={cn("shrink-0", className)}
			fill="none"
			viewBox="0 0 72 48"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>typeninja</title>
			{/* left half of the keyboard, knocked downwards */}
			<g transform="rotate(-9 17 26)">
				<path
					d="M5 15h25l-2 4 3 4-2 4 2 4-1 3H5a2 2 0 0 1-2-2V17a2 2 0 0 1 2-2Z"
					stroke="currentColor"
					strokeLinejoin="round"
					strokeWidth="2"
				/>
				<path
					d="M8 20h17M8 25h15M8 30h16"
					stroke="currentColor"
					strokeDasharray="3 1.6"
					strokeLinecap="round"
					strokeWidth="1.8"
				/>
			</g>
			{/* right half of the keyboard, knocked upwards */}
			<g transform="rotate(9 55 22)">
				<path
					d="M67 15H42l2 4-3 4 2 4-2 4 1 3h25a2 2 0 0 0 2-2V17a2 2 0 0 0-2-2Z"
					stroke="currentColor"
					strokeLinejoin="round"
					strokeWidth="2"
				/>
				<path
					d="M47 20h17M49 25h15M47 30h17"
					stroke="currentColor"
					strokeDasharray="3 1.6"
					strokeLinecap="round"
					strokeWidth="1.8"
				/>
			</g>
			{/* sparks */}
			<path
				d="M26 7l-3-4M46 7l3-4M24 43l-3 4M48 43l3 4"
				stroke={accent}
				strokeLinecap="round"
				strokeWidth="1.6"
			/>
			{/* shuriken */}
			<g transform="rotate(22 36 24)">
				<path
					d="M36 6l3.5 14.5L54 24l-14.5 3.5L36 42l-3.5-14.5L18 24l14.5-3.5Z"
					fill={accent}
					strokeLinejoin="round"
				/>
				<circle cx="36" cy="24" fill="var(--bg-color)" r="2.6" />
			</g>
		</svg>
	);
}
