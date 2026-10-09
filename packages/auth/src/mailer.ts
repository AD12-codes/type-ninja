import { logger } from "@type-ninja/core/logger";
import { env } from "@type-ninja/env/server";
import nodemailer, { type Transporter } from "nodemailer";

export interface Mail {
	to: string;
	subject: string;
	text: string;
	html?: string;
}

let transporter: Transporter | null | undefined;

function getTransporter(): Transporter | null {
	if (transporter !== undefined) {
		return transporter;
	}
	if (!(env.SMTP_HOST && env.SMTP_PORT)) {
		transporter = null;
		return transporter;
	}
	const SECURE_PORT = 465;
	transporter = nodemailer.createTransport({
		host: env.SMTP_HOST,
		port: env.SMTP_PORT,
		secure: env.SMTP_PORT === SECURE_PORT,
		auth:
			env.SMTP_USER && env.SMTP_PASS
				? { user: env.SMTP_USER, pass: env.SMTP_PASS }
				: undefined,
	});
	return transporter;
}

/**
 * Sends an email through SMTP when configured. Without SMTP settings the
 * message is logged instead so password resets still work in development.
 */
export async function sendMail(mail: Mail): Promise<void> {
	const transport = getTransporter();
	if (!transport) {
		logger.warn(
			{ to: mail.to, subject: mail.subject, text: mail.text },
			"SMTP not configured; email logged instead of sent"
		);
		return;
	}
	await transport.sendMail({
		from: env.SMTP_FROM ?? env.SMTP_USER,
		to: mail.to,
		subject: mail.subject,
		text: mail.text,
		html: mail.html,
	});
	logger.info({ to: mail.to, subject: mail.subject }, "email sent");
}
