import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/forgot-password")({
	component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [sent, setSent] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const submit = async (event: React.FormEvent) => {
		event.preventDefault();
		setSubmitting(true);
		const { error } = await authClient.requestPasswordReset({
			email,
			redirectTo: `${window.location.origin}/reset-password`,
		});
		setSubmitting(false);
		if (error) {
			toast.error(error.message ?? "could not send reset email");
			return;
		}
		setSent(true);
	};

	return (
		<div className="flex flex-1 items-center justify-center py-8">
			<form className="flex w-full max-w-sm flex-col gap-3" onSubmit={submit}>
				<h2 className="text-sub">forgot password</h2>
				{sent ? (
					<p className="text-sm text-text">
						If an account exists for that email, a reset link has been sent.
					</p>
				) : (
					<>
						<Label className="sr-only" htmlFor="email">
							email
						</Label>
						<Input
							autoComplete="email"
							id="email"
							onChange={(e) => setEmail(e.target.value)}
							placeholder="email"
							required
							type="email"
							value={email}
						/>
						<Button disabled={submitting} type="submit">
							send reset link
						</Button>
					</>
				)}
				<Link
					className="text-center text-sub text-xs hover:text-text"
					to="/login"
				>
					back to login
				</Link>
			</form>
		</div>
	);
}
