import { expect, Locator, Page } from "@playwright/test";
import { createContactUsInfoFaker } from "../../factories/conctactUs.factory";
import { BasePage } from "../BasePage";

export class ContactUsPage extends BasePage {
	protected readonly yourNameField: Locator;
	protected readonly emailAddressField: Locator;
	protected readonly subjectField: Locator;
	protected readonly messageField: Locator;
	protected readonly sendMessageButton: Locator;

	protected readonly messageSentSuccessMessage: Locator;

	constructor(protected readonly page: Page) {
		super(page);

		this.yourNameField = page.getByRole("textbox", { name: "Your Name *" });
		this.emailAddressField = page.getByRole("textbox", { name: "Email Address *" });
		this.subjectField = page.getByRole("textbox", { name: "Subject *" });
		this.messageField = page.getByRole("textbox", { name: "Tell us more about your inquiry..." });
		this.sendMessageButton = page.getByRole("button", { name: "Send Message" });

		this.messageSentSuccessMessage = page.getByText(
			"Thank you for contacting us! We'll get back to you as soon as possible."
		);
	}

	async verifyPage(): Promise<void> {
		await expect(this.page).toHaveURL("https://mallblitz.com/contact");
	}

	// input your own values or leave empty for faker
	async fillNameField(name?: string): Promise<void> {
		const usedName = name ?? createContactUsInfoFaker().name;
		await this.yourNameField.fill(usedName);
	}

	async fillEmailField(email?: string): Promise<void> {
		const usedEmail = email ?? createContactUsInfoFaker().emailAddress;
		await this.emailAddressField.fill(usedEmail);
	}

	async fillSubjectField(subject?: string): Promise<void> {
		const usedSubject = subject ?? createContactUsInfoFaker().subject;
		await this.subjectField.fill(usedSubject);
	}

	async fillMessageField(message?: string): Promise<void> {
		const usedMessage = message ?? createContactUsInfoFaker().message;
		await this.messageField.fill(usedMessage);
	}

	async clickSendMessageButton(): Promise<void> {
		await this.sendMessageButton.click();
	}

	async verifySuccessMessage(): Promise<void> {
		await expect(this.messageSentSuccessMessage.first()).toBeVisible();
	}
}
