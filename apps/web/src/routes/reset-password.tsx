import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PASSWORD_MIN } from "@type-ninja/shared/api";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/reset-password")({
	validateSearch: (search: Record<string, unknown>) => ({
		token: typeof search.token === "string" ? search.token : "",
		error: typeof search.error === "string" ? search.error : "",
	}),
	component: ResetPasswordPage,
});

function ResetPasswordPage() {
	const { token, error } = Route.useSearch();
	const navigate = useNavigate();
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const submit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (password !== confirm) {
			toast.error("passwords do not match");
			return;
		}
		if (password.length < PASSWORD_MIN) {
			toast.error(`password must be at least ${PASSWORD_MIN} characters`);
			return;
		}
		setSubmitting(true);
		const result = await authClient.resetPassword({
			newPassword: password,
			token,
		});
		setSubmitting(false);
		if (result.error) {
			toast.error(result.error.message ?? "could not reset password");
			return;
		}
		toast.success("password updated, please sign in");
		navigate({ to: "/login" });
	};

	if (error || !token) {
		return (
			<div className="flex flex-1 items-center justify-center py-8">
				<p className="text-error">This reset link is invalid or has expired.</p>
			</div>
		);
	}

	return (
		<div className="flex flex-1 items-center justify-center py-8">
			<form className="flex w-full max-w-sm flex-col gap-3" onSubmit={submit}>
				<h2 className="text-sub">reset password</h2>
				<Label className="sr-only" htmlFor="password">
					new password
				</Label>
				<Input
					autoComplete="new-password"
					id="password"
					onChange={(e) => setPassword(e.target.value)}
					placeholder="new password"
					required
					type="password"
					value={password}
				/>
				<Label className="sr-only" htmlFor="confirm">
					verify password
				</Label>
				<Input
					autoComplete="new-password"
					id="confirm"
					onChange={(e) => setConfirm(e.target.value)}
					placeholder="verify password"
					required
					type="password"
					value={confirm}
				/>
				<Button disabled={submitting} type="submit">
					update password
				</Button>
			</form>
		</div>
	);
}
