import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { SocialLoginButton } from "./social-login-button";

interface AuthCardProps {
	mode: "login" | "signup";
}

export function AuthCard({ mode }: AuthCardProps) {
	const isLogin = mode === "login";

	return (
		<Card className="w-full max-w-sm shadow-lg">
			<CardHeader className="text-center">
				<CardTitle className="font-semibold text-xl">
					{isLogin ? "Welcome back" : "Create an account"}
				</CardTitle>
				<CardDescription>
					{isLogin
						? "Sign in to continue to your dashboard"
						: "Get started by creating your account"}
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<SocialLoginButton provider="google" />

				<div className="flex items-center gap-3">
					<Separator className="flex-1" />
					<span className="text-muted-foreground text-xs uppercase">or</span>
					<Separator className="flex-1" />
				</div>

				<SocialLoginButton provider="github" />
			</CardContent>
		</Card>
	);
}
