import {
	USERNAME_MAX,
	USERNAME_MIN,
	USERNAME_REGEX,
} from "@type-ninja/shared/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { refreshSession, useSession } from "@/lib/auth-client";
import { useUpdateProfile } from "@/lib/queries";

function suggestUsername(
	name: string | undefined,
	email: string | undefined
): string {
	const base = (name || email?.split("@")[0] || "")
		.toLowerCase()
		.replace(/[^a-z0-9_.-]+/g, "_")
		.replace(/^_+|_+$/g, "")
		.slice(0, USERNAME_MAX);
	return base.length >= USERNAME_MIN ? base : "";
}

/**
 * Users who sign in with GitHub or Google have no username yet. The
 * leaderboard and profile URLs need one, so ask once before they continue.
 */
export function UsernamePrompt() {
	const { data: session, refetch } = useSession();
	const update = useUpdateProfile();
	const user = session?.user as
		| { username?: string | null; name?: string; email?: string }
		| undefined;
	const [value, setValue] = useState("");
	const needsUsername = Boolean(session?.user) && !user?.username;
	const suggestion = suggestUsername(user?.name, user?.email);

	// The session loads after the first render, so seed the suggestion once it arrives.
	useEffect(() => {
		if (suggestion) {
			setValue((current) => current || suggestion);
		}
	}, [suggestion]);

	if (!needsUsername) {
		return null;
	}

	const valid =
		value.length >= USERNAME_MIN &&
		value.length <= USERNAME_MAX &&
		USERNAME_REGEX.test(value);

	const submit = (event: React.FormEvent) => {
		event.preventDefault();
		if (!valid) {
			return;
		}
		update.mutate(
			{ username: value },
			{
				onSuccess: async () => {
					toast.success(`welcome, ${value}`);
					await refreshSession();
					await refetch();
				},
				onError: (error) => toast.error(error.message),
			}
		);
	};

	return (
		<Dialog open>
			<DialogContent showCloseButton={false}>
				<DialogHeader>
					<DialogTitle className="text-main">pick a username</DialogTitle>
					<DialogDescription>
						This is the name shown on the leaderboard and your public profile.{" "}
						{USERNAME_MIN}–{USERNAME_MAX} characters: letters, numbers, dots,
						dashes and underscores.
					</DialogDescription>
				</DialogHeader>
				<form className="flex flex-col gap-3" onSubmit={submit}>
					<Label className="sr-only" htmlFor="pick-username">
						username
					</Label>
					<Input
						autoComplete="username"
						autoFocus
						id="pick-username"
						onChange={(e) => setValue(e.target.value)}
						placeholder="username"
						value={value}
					/>
					{value.length > 0 && !valid && (
						<p className="text-error text-xs">
							use {USERNAME_MIN}–{USERNAME_MAX} letters, numbers, dots, dashes
							or underscores
						</p>
					)}
					<Button disabled={!valid || update.isPending} type="submit">
						continue
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
