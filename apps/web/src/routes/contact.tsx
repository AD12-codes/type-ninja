import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/layout/static-page";

export const Route = createFileRoute("/contact")({
	component: UcontactPage,
});

function UcontactPage() {
	return <StaticPage page="contact" title="contact" />;
}
