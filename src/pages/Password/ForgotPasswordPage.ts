import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";

export class ForgotPasswordPage extends BasePage {
	// forgot password

	protected readonly emailAddressField: Locator;
	protected readonly sendResetLinkButton: Locator;

	constructor(protected readonly page: Page) {
		super(page);
		this.emailAddressField = page.getByRole("textbox", { name: "Email Address *" });
		this.sendResetLinkButton = page.getByRole("button", { name: "Send reset link" });
	}

	async verifyPage(): Promise<void> {
		await expect(this.page).toHaveURL("https://mallblitz.com/forgot-password");
	}

	// forgot password

	async fillEmailField(email: string): Promise<void> {
		await this.emailAddressField.fill(email);
	}

	async clickSendResetButton(): Promise<void> {
		await this.sendResetLinkButton.click();
	}
}
