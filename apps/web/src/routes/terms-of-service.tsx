import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/layout/static-page";

export const Route = createFileRoute("/terms-of-service")({
	component: UtermsUofUservicePage,
});

function UtermsUofUservicePage() {
	return <StaticPage page="terms-of-service" title="terms of service" />;
}
