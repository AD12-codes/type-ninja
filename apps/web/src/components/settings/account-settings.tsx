import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { PASSWORD_MIN } from "@type-ninja/shared/api";
import { useState } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient, signOut, useSession } from "@/lib/auth-client";
import {
	useResetAccount,
	useResetPersonalBests,
	useUpdateProfile,
} from "@/lib/queries";
import { useConfigStore } from "@/store/config-store";

function Row({
	title,
	description,
	children,
}: {
	title: string;
	description: string;
	children: React.ReactNode;
}) {
	return (
		<div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-start">
			<div>
				<h3 className="text-lg text-text">{title}</h3>
				<p className="text-sm text-sub">{description}</p>
			</div>
			<div className="flex flex-col gap-2 md:w-72">{children}</div>
		</div>
	);
}

function DangerButton({
	label,
	title,
	description,
	onConfirm,
	requirePassword,
}: {
	label: string;
	title: string;
	description: string;
	onConfirm: (password: string) => Promise<void>;
	requirePassword?: boolean;
}) {
	const [password, setPassword] = useState("");
	const [busy, setBusy] = useState(false);
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="destructive">{label}</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				{requirePassword && (
					<Input
						autoComplete="current-password"
						onChange={(e) => setPassword(e.target.value)}
						placeholder="confirm with your password"
						type="password"
						value={password}
					/>
				)}
				<AlertDialogFooter>
					<AlertDialogCancel>cancel</AlertDialogCancel>
					<AlertDialogAction
						disabled={busy || (requirePassword && password === "")}
						onClick={async (e) => {
							e.preventDefault();
							setBusy(true);
							try {
								await onConfirm(password);
							} finally {
								setBusy(false);
							}
						}}
					>
						{label}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export function AccountSettings() {
	const { data: session } = useSession();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const updateProfile = useUpdateProfile();
	const resetAccount = useResetAccount();
	const resetPersonalBests = useResetPersonalBests();
	const resetConfig = useConfigStore((s) => s.resetConfig);
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");

	const hasAccount = Boolean(session?.user);

	return (
		<div className="flex flex-col gap-8">
			<Row
				description="Reset every setting on this page back to the defaults. Your results are not affected."
				title="reset settings"
			>
				<DangerButton
					description="All settings will be restored to their defaults."
					label="reset settings"
					onConfirm={() => {
						resetConfig();
						toast.success("settings reset");
						return Promise.resolve();
					}}
					title="Reset settings?"
				/>
			</Row>

			{hasAccount && (
				<>
					<Row
						description="Change the name shown on the leaderboard and your profile."
						title="update username"
					>
						<Input
							autoComplete="username"
							onChange={(e) => setUsername(e.target.value)}
							placeholder="new username"
							value={username}
						/>
						<Button
							disabled={username.length === 0 || updateProfile.isPending}
							onClick={() =>
								updateProfile.mutate(
									{ username },
									{
										onSuccess: () => {
											toast.success("username updated");
											setUsername("");
											queryClient.invalidateQueries();
										},
										onError: (error) => toast.error(error.message),
									}
								)
							}
						>
							update username
						</Button>
					</Row>

					<Row
						description="Change the email used to sign in."
						title="update email"
					>
						<Input
							autoComplete="email"
							onChange={(e) => setEmail(e.target.value)}
							placeholder="new email"
							type="email"
							value={email}
						/>
						<Button
							disabled={email.length === 0}
							onClick={async () => {
								const { error } = await authClient.changeEmail({
									newEmail: email,
								});
								if (error) {
									toast.error(error.message ?? "could not update email");
									return;
								}
								toast.success("email updated");
								setEmail("");
							}}
						>
							update email
						</Button>
					</Row>

					<Row
						description="Change your password. Other sessions will be signed out."
						title="update password"
					>
						<Label className="sr-only" htmlFor="current-password">
							current password
						</Label>
						<Input
							autoComplete="current-password"
							id="current-password"
							onChange={(e) => setCurrentPassword(e.target.value)}
							placeholder="current password"
							type="password"
							value={currentPassword}
						/>
						<Label className="sr-only" htmlFor="new-password">
							new password
						</Label>
						<Input
							autoComplete="new-password"
							id="new-password"
							onChange={(e) => setNewPassword(e.target.value)}
							placeholder="new password"
							type="password"
							value={newPassword}
						/>
						<Button
							disabled={
								currentPassword.length === 0 ||
								newPassword.length < PASSWORD_MIN
							}
							onClick={async () => {
								const { error } = await authClient.changePassword({
									currentPassword,
									newPassword,
									revokeOtherSessions: true,
								});
								if (error) {
									toast.error(error.message ?? "could not update password");
									return;
								}
								toast.success("password updated");
								setCurrentPassword("");
								setNewPassword("");
							}}
						>
							update password
						</Button>
					</Row>

					<Row
						description="Removes every personal best. Your results and stats stay intact."
						title="reset personal bests"
					>
						<DangerButton
							description="All personal bests will be removed. This cannot be undone."
							label="reset personal bests"
							onConfirm={async () => {
								await resetPersonalBests.mutateAsync();
								toast.success("personal bests reset");
							}}
							title="Reset personal bests?"
						/>
					</Row>

					<Row
						description="Deletes every result, personal best and statistic, but keeps your account."
						title="reset account"
					>
						<DangerButton
							description="All of your results and stats will be permanently deleted."
							label="reset account"
							onConfirm={async () => {
								await resetAccount.mutateAsync();
								toast.success("account reset");
							}}
							title="Reset account?"
						/>
					</Row>

					<Row
						description="Permanently deletes your account and everything in it."
						title="delete account"
					>
						<DangerButton
							description="Your account and all of its data will be permanently deleted."
							label="delete account"
							onConfirm={async (password) => {
								const { error } = await authClient.deleteUser({ password });
								if (error) {
									toast.error(error.message ?? "could not delete account");
									return;
								}
								toast.success("account deleted");
								await signOut();
								navigate({ to: "/" });
							}}
							requirePassword
							title="Delete account?"
						/>
					</Row>
				</>
			)}
		</div>
	);
}
