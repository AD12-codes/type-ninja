import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { metaQuery } from "@/lib/queries";

const PROVIDERS = {
	github: { label: "GitHub", icon: IconBrandGithub },
	google: { label: "Google", icon: IconBrandGoogle },
} as const;

export function SocialButtons() {
	const meta = useQuery(metaQuery);
	const providers = (meta.data?.socialProviders ?? []).filter(
		(p): p is keyof typeof PROVIDERS => p in PROVIDERS
	);
	if (providers.length === 0) {
		return null;
	}
	return (
		<div className="flex flex-col gap-2">
			{providers.map((provider) => {
				const { label, icon: Icon } = PROVIDERS[provider];
				return (
					<Button
						key={provider}
						onClick={() =>
							signIn.social({
								provider,
								callbackURL: window.location.origin,
							})
						}
						type="button"
						variant="outline"
					>
						<Icon className="size-4" /> continue with {label}
					</Button>
				);
			})}
		</div>
	);
}
