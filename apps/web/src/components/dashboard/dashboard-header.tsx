import { IconLogout } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function DashboardHeader() {
	const navigate = useNavigate();
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const handleSignOut = async () => {
		setIsLoggingOut(true);
		try {
			await authClient.signOut();
			navigate({ to: "/login" });
		} catch {
			setIsLoggingOut(false);
		}
	};

	return (
		<header className="border-b bg-background">
			<div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
				<h1 className="font-semibold text-lg tracking-tight">type-ninja</h1>
				<Button
					className="gap-2 text-muted-foreground hover:text-foreground"
					disabled={isLoggingOut}
					onClick={handleSignOut}
					size="sm"
					variant="ghost"
				>
					<IconLogout className="size-4" />
					<span className="hidden sm:inline">Sign out</span>
				</Button>
			</div>
		</header>
	);
}
