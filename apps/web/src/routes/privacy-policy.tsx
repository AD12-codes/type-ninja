import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/layout/static-page";

export const Route = createFileRoute("/privacy-policy")({
	component: UprivacyUpolicyPage,
});

function UprivacyUpolicyPage() {
	return <StaticPage page="privacy-policy" title="privacy policy" />;
}
