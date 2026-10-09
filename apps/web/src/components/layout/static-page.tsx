const CONTENT: Record<string, React.ReactNode> = {
	contact: (
		<>
			<p>
				typeninja is an open source project. Questions, bug reports and new
				algorithm or language requests are welcome on the GitHub repository
				linked in the footer.
			</p>
			<p>
				Pull requests that add snippets or explanations are especially
				appreciated.
			</p>
		</>
	),
	"privacy-policy": (
		<>
			<p>
				typeninja stores the minimum data it needs to work. Without an account,
				your settings live only in your browser's local storage and nothing is
				sent to the server except the requests needed to load snippets.
			</p>
			<p>
				With an account we store your email, username, hashed password (or the
				identity returned by the social provider you chose), your settings, and
				every completed test result including per-second speed data. This is
				used to show your profile, statistics and the leaderboards.
			</p>
			<p>
				Your username, best results and profile fields are public. Your email is
				never shown. You can delete every result or your entire account from the
				settings page at any time; deletion is immediate and permanent.
			</p>
			<p>No analytics, advertising or tracking scripts are used.</p>
		</>
	),
	"terms-of-service": (
		<>
			<p>
				typeninja is provided as-is, free of charge, with no warranty. The
				service may change or be unavailable at any time.
			</p>
			<p>
				You may use one account per person. Do not attempt to manipulate
				results, automate typing, or interfere with other users. Suspicious
				results can be removed and accounts that cheat can be deleted without
				notice.
			</p>
			<p>
				Content you provide (username, bio) must not be offensive, impersonate
				others or infringe anyone's rights.
			</p>
		</>
	),
	"security-policy": (
		<>
			<p>
				If you discover a security vulnerability, please report it privately
				through the GitHub repository's security advisories or by contacting the
				maintainer directly, rather than opening a public issue.
			</p>
			<p>
				Passwords are hashed and never stored in plain text. Sessions use
				secure, HTTP-only cookies. Result submissions are re-validated on the
				server.
			</p>
		</>
	),
};

export function StaticPage({ page, title }: { page: string; title: string }) {
	return (
		<div className="flex max-w-3xl flex-col gap-4 py-4">
			<h1 className="font-semibold text-3xl text-main">{title}</h1>
			<div className="space-y-3 text-sm text-text leading-relaxed">
				{CONTENT[page]}
			</div>
		</div>
	);
}
