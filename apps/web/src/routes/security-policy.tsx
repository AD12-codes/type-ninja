import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/layout/static-page";

export const Route = createFileRoute("/security-policy")({
	component: UsecurityUpolicyPage,
});

function UsecurityUpolicyPage() {
	return <StaticPage page="security-policy" title="security policy" />;
}
