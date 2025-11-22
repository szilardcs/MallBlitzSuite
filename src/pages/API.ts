import { expect, type APIRequestContext } from "@playwright/test";
import type { EmailMessage, LinkCheckResponse, MessagesResponse } from "../types/email";

export class API {
	constructor(protected readonly request: APIRequestContext) {}

	async callMessagesList(email: string): Promise<string> {
		const firstResponse = await this.request.get("http://16.16.128.139:8025/api/v1/messages");
		const firstBody: MessagesResponse = await firstResponse.json();

		expect(firstResponse.status()).toBe(200);

		// Find the message with the matching email address (case-insensitive)
		const targetMessage: EmailMessage | undefined = firstBody.messages.find((message: EmailMessage) =>
			message.To.some((recipient) => recipient.Address.toLowerCase() === email.toLowerCase())
		);

		if (!targetMessage) {
			throw new Error(`No message found for email: ${email}. Available emails listed above.`);
		}

		const firstMessageId = targetMessage.ID;
		return firstMessageId;
	}

	async getVerificationLink(firstMessageId: string): Promise<string> {
		const secondResponse = await this.request.get(
			`http://16.16.128.139:8025/api/v1/message/${firstMessageId}/link-check`
		);
		const secondBody: LinkCheckResponse = await secondResponse.json();
		expect(secondResponse.status()).toBe(200);

		// Find the link with status code 302 (redirect/verification link)
		const verificationLink = secondBody.Links.find((link) => link.StatusCode === 302);

		if (!verificationLink) {
			throw new Error("No verification link (302 status code) found in the response");
		}

		const secondResponseLink: string = verificationLink.URL;
		return secondResponseLink;
	}

	async getPasswordResetLink(firstMessageId: string): Promise<string> {
		const secondResponse = await this.request.get(
			`http://16.16.128.139:8025/api/v1/message/${firstMessageId}/link-check`
		);
		const secondBody: LinkCheckResponse = await secondResponse.json();
		expect(secondResponse.status()).toBe(200);

		// Find the link that contains "password-reset" in the URL
		const passwordResetLink = secondBody.Links.find((link) => link.URL.includes("password-reset"));

		if (!passwordResetLink) {
			throw new Error("No password reset link found in the response");
		}

		const secondResponseLink: string = passwordResetLink.URL;
		return secondResponseLink;
	}
}
