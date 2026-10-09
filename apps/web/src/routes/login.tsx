import { useForm } from "@tanstack/react-form";
import {
	createFileRoute,
	Link,
	redirect,
	useNavigate,
} from "@tanstack/react-router";
import {
	PASSWORD_MIN,
	USERNAME_MAX,
	USERNAME_MIN,
	USERNAME_REGEX,
} from "@type-ninja/shared/api";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { FieldError } from "@/components/auth/field-error";
import { SocialButtons } from "@/components/auth/social-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient, signIn, signUp } from "@/lib/auth-client";

export const Route = createFileRoute("/login")({
	beforeLoad: async () => {
		const { data: session } = await authClient.getSession();
		if (session) {
			throw redirect({ to: "/account" });
		}
	},
	component: LoginPage,
});

const registerSchema = z
	.object({
		username: z
			.string()
			.min(USERNAME_MIN, `at least ${USERNAME_MIN} characters`)
			.max(USERNAME_MAX, `at most ${USERNAME_MAX} characters`)
			.regex(
				USERNAME_REGEX,
				"letters, numbers, dots, dashes and underscores only"
			),
		email: z.email("enter a valid email"),
		password: z
			.string()
			.min(PASSWORD_MIN, `at least ${PASSWORD_MIN} characters`),
		confirm: z.string(),
	})
	.refine((v) => v.password === v.confirm, {
		message: "passwords do not match",
		path: ["confirm"],
	});

const loginSchema = z.object({
	identifier: z.string().min(1, "required"),
	password: z.string().min(1, "required"),
	remember: z.boolean(),
});

function RegisterForm() {
	const navigate = useNavigate();
	const [submitting, setSubmitting] = useState(false);
	const form = useForm({
		defaultValues: { username: "", email: "", password: "", confirm: "" },
		validators: { onSubmit: registerSchema },
		onSubmit: async ({ value }) => {
			setSubmitting(true);
			const { error } = await signUp.email({
				email: value.email,
				password: value.password,
				name: value.username,
				username: value.username,
				displayUsername: value.username,
			});
			setSubmitting(false);
			if (error) {
				toast.error(error.message ?? "could not create account");
				return;
			}
			toast.success("account created");
			navigate({ to: "/" });
		},
	});

	return (
		<form
			className="flex flex-col gap-3"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<h2 className="text-sub">register</h2>
			<form.Field name="username">
				{(field) => (
					<div className="flex flex-col gap-1">
						<Label className="sr-only" htmlFor={field.name}>
							username
						</Label>
						<Input
							autoComplete="username"
							id={field.name}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							placeholder="username"
							value={field.state.value}
						/>
						<FieldError errors={field.state.meta.errors} />
					</div>
				)}
			</form.Field>
			<form.Field name="email">
				{(field) => (
					<div className="flex flex-col gap-1">
						<Label className="sr-only" htmlFor={field.name}>
							email
						</Label>
						<Input
							autoComplete="email"
							id={field.name}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							placeholder="email"
							type="email"
							value={field.state.value}
						/>
						<FieldError errors={field.state.meta.errors} />
					</div>
				)}
			</form.Field>
			<form.Field name="password">
				{(field) => (
					<div className="flex flex-col gap-1">
						<Label className="sr-only" htmlFor={field.name}>
							password
						</Label>
						<Input
							autoComplete="new-password"
							id={field.name}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							placeholder="password"
							type="password"
							value={field.state.value}
						/>
						<FieldError errors={field.state.meta.errors} />
					</div>
				)}
			</form.Field>
			<form.Field name="confirm">
				{(field) => (
					<div className="flex flex-col gap-1">
						<Label className="sr-only" htmlFor={field.name}>
							verify password
						</Label>
						<Input
							autoComplete="new-password"
							id={field.name}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							placeholder="verify password"
							type="password"
							value={field.state.value}
						/>
						<FieldError errors={field.state.meta.errors} />
					</div>
				)}
			</form.Field>
			<Button disabled={submitting} type="submit">
				sign up
			</Button>
		</form>
	);
}

function LoginForm() {
	const navigate = useNavigate();
	const [submitting, setSubmitting] = useState(false);
	const form = useForm({
		defaultValues: { identifier: "", password: "", remember: true },
		validators: { onSubmit: loginSchema },
		onSubmit: async ({ value }) => {
			setSubmitting(true);
			const isEmail = value.identifier.includes("@");
			const { error } = isEmail
				? await signIn.email({
						email: value.identifier,
						password: value.password,
						rememberMe: value.remember,
					})
				: await signIn.username({
						username: value.identifier,
						password: value.password,
						rememberMe: value.remember,
					});
			setSubmitting(false);
			if (error) {
				toast.error(error.message ?? "could not sign in");
				return;
			}
			navigate({ to: "/" });
		},
	});

	return (
		<form
			className="flex flex-col gap-3"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<h2 className="text-sub">login</h2>
			<SocialButtons />
			<form.Field name="identifier">
				{(field) => (
					<div className="flex flex-col gap-1">
						<Label className="sr-only" htmlFor="login-identifier">
							email or username
						</Label>
						<Input
							autoComplete="username"
							id="login-identifier"
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							placeholder="email or username"
							value={field.state.value}
						/>
						<FieldError errors={field.state.meta.errors} />
					</div>
				)}
			</form.Field>
			<form.Field name="password">
				{(field) => (
					<div className="flex flex-col gap-1">
						<Label className="sr-only" htmlFor="login-password">
							password
						</Label>
						<Input
							autoComplete="current-password"
							id="login-password"
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							placeholder="password"
							type="password"
							value={field.state.value}
						/>
						<FieldError errors={field.state.meta.errors} />
					</div>
				)}
			</form.Field>
			<form.Field name="remember">
				{(field) => (
					<label className="flex items-center gap-2 text-sm text-sub">
						<input
							checked={field.state.value}
							className="accent-main"
							onChange={(e) => field.handleChange(e.target.checked)}
							type="checkbox"
						/>
						remember me
					</label>
				)}
			</form.Field>
			<Button disabled={submitting} type="submit">
				sign in
			</Button>
			<Link
				className="text-center text-sub text-xs hover:text-text"
				to="/forgot-password"
			>
				forgot password?
			</Link>
		</form>
	);
}

function LoginPage() {
	return (
		<div className="flex flex-1 items-center justify-center py-8">
			<div className="grid w-full max-w-3xl gap-12 md:grid-cols-2">
				<RegisterForm />
				<LoginForm />
			</div>
		</div>
	);
}
