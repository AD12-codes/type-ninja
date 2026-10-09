import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const providerConfig = {
	github: {
		label: "GitHub",
		icon: IconBrandGithub,
	},
	google: {
		label: "Google",
		icon: IconBrandGoogle,
	},
} as const;

type Provider = keyof typeof providerConfig;

interface SocialLoginButtonProps {
	provider: Provider;
	callbackURL?: string;
}

export function SocialLoginButton({
	provider,
	callbackURL = `${window.location.origin}/dashboard`,
}: SocialLoginButtonProps) {
	const [isLoading, setIsLoading] = useState(false);
	const config = providerConfig[provider];
	const Icon = config.icon;

	const handleLogin = async () => {
		setIsLoading(true);
		try {
			await authClient.signIn.social({
				provider,
				callbackURL,
			});
		} catch {
			setIsLoading(false);
		}
	};

	return (
		<Button
			className="w-full gap-3 font-medium text-sm"
			disabled={isLoading}
			onClick={handleLogin}
			size="lg"
			variant="outline"
		>
			<Icon className="size-5" />
			<span>Continue with {config.label}</span>
		</Button>
	);
}
