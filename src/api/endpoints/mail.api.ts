import { z } from "zod";
import type { ApiClient } from "../client/apiClient";
import { env } from "../../config/env";
import {
	EmailMessage,
	LinkCheckEntry,
	LinkCheckResponseSchema,
	MessagesResponseSchema,
} from "../contracts/mail.contracts";

const EmailSchema = z.string().email();
const MessageIdSchema = z.string().min(1);
const MAIL_API_PREFIX = "v1";

type WaitOptions = {
	maxAttempts?: number;
	intervalMs?: number;
};

const delay = (ms: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});

const sortByCreatedDesc = (messages: EmailMessage[]): EmailMessage[] =>
	[...messages].sort(
		(a, b) => new Date(b.Created).getTime() - new Date(a.Created).getTime()
	);

export class MailApi {
	constructor(private readonly client: ApiClient) {}

	async listMessages() {
		return this.client.get(`${MAIL_API_PREFIX}/messages`, {
			expectedStatus: 200,
			schema: MessagesResponseSchema,
		});
	}

	async getLinkCheck(messageId: string) {
		const parsedMessageId = MessageIdSchema.parse(messageId);

		return this.client.get(`${MAIL_API_PREFIX}/message/${parsedMessageId}/link-check`, {
			expectedStatus: 200,
			schema: LinkCheckResponseSchema,
		});
	}

	async findLatestMessageForRecipient(email: string): Promise<EmailMessage | undefined> {
		const parsedEmail = EmailSchema.parse(email);
		const response = await this.listMessages();
		const messages = sortByCreatedDesc(response.data.messages);

		return messages.find((message) =>
			message.To.some((recipient) => recipient.Address.toLowerCase() === parsedEmail.toLowerCase())
		);
	}

	async waitForVerificationLink(email: string, options?: WaitOptions): Promise<string> {
		return this.waitForLink(email, (link) => link.StatusCode === 302, options);
	}

	async waitForPasswordResetLink(email: string, options?: WaitOptions): Promise<string> {
		return this.waitForLink(email, (link) => link.URL.includes("password-reset"), options);
	}

	private async waitForLink(
		email: string,
		match: (link: LinkCheckEntry) => boolean,
		options?: WaitOptions
	): Promise<string> {
		const attempts = options?.maxAttempts ?? env.MAIL_API_MAX_ATTEMPTS;
		const interval = options?.intervalMs ?? env.MAIL_API_POLL_INTERVAL_MS;
		const normalizedEmail = EmailSchema.parse(email);

		for (let attempt = 1; attempt <= attempts; attempt++) {
			const message = await this.findLatestMessageForRecipient(normalizedEmail);
			if (message) {
				const linkResponse = await this.getLinkCheck(message.ID);
				const link = linkResponse.data.Links.find(match);

				if (link) {
					return link.URL;
				}
			}

			if (attempt < attempts) {
				await delay(interval);
			}
		}

		throw new Error(`No matching link found for ${normalizedEmail} after ${attempts} attempts.`);
	}
}
