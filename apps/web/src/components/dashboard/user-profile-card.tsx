import { IconCalendar, IconMail } from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserProfileCardProps {
	name: string;
	email: string;
	image: string | null | undefined;
	createdAt: Date;
}

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

function formatDate(date: Date): string {
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(new Date(date));
}

export function UserProfileCard({
	name,
	email,
	image,
	createdAt,
}: UserProfileCardProps) {
	return (
		<Card className="w-full max-w-md shadow-lg">
			<CardHeader className="items-center pb-2 text-center">
				<Avatar className="mb-3 size-20" size="lg">
					{image && <AvatarImage alt={name} src={image} />}
					<AvatarFallback className="font-semibold text-lg">
						{getInitials(name)}
					</AvatarFallback>
				</Avatar>
				<CardTitle className="font-semibold text-xl">{name}</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">
				<div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
					<IconMail className="size-4 shrink-0 text-muted-foreground" />
					<span className="truncate text-sm">{email}</span>
				</div>
				<div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
					<IconCalendar className="size-4 shrink-0 text-muted-foreground" />
					<span className="text-sm">Joined {formatDate(createdAt)}</span>
				</div>
			</CardContent>
		</Card>
	);
}
