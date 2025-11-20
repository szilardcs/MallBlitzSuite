import { expect, Locator, Page } from "@playwright/test";
import { createRegisterInfoFaker } from "../factories/register.factory";
import { BasePage } from "./BasePage";

export class RegisterPage extends BasePage {
	protected readonly fullNameField: Locator;
	protected readonly emailField: Locator;
	protected readonly passwordField: Locator;
	protected readonly confirmPassword: Locator;
	protected readonly termsCheckbox: Locator;
	protected readonly registerButton: Locator;
	protected readonly errorAlert: Locator;

	constructor(protected readonly page: Page) {
		super(page);

		this.fullNameField = page.getByRole("textbox", { name: "Full Name *" });
		this.emailField = page.getByRole("textbox", { name: "Email Address" });
		this.passwordField = page.getByRole("textbox", { name: "Password *", exact: true });
		this.confirmPassword = page.getByRole("textbox", { name: "Confirm Password *", exact: true });
		this.termsCheckbox = page.getByRole("checkbox", { name: "I agree to the terms and conditions" });
		this.registerButton = page.getByRole("button", { name: "Sign Up" });

		this.errorAlert = page.getByRole("alert").first();
	}

	async verifyPage(): Promise<void> {
		await expect(this.page).toHaveURL("https://mallblitz.com/register");
	}

	// leave arg empty for faker value or input your own
	async fillNameFieldAndReturnIt(name?: string): Promise<string> {
		const nameToUse = name ?? createRegisterInfoFaker().fullName;
		await this.fullNameField.fill(nameToUse);
		return nameToUse;
	}

	// leave arg empty for faker value or input your own
	async fillEmailFieldAndReturnIt(email?: string): Promise<string> {
		const emailToUse = email ?? createRegisterInfoFaker().emailAddress;
		await this.emailField.fill(emailToUse);
		return emailToUse;
	}

	// leave arg empty for faker value or input your own
	async fillPasswordFieldsAndReturnIt(password?: string): Promise<string> {
		const passwordToUse = password ?? createRegisterInfoFaker().password;
		await this.passwordField.fill(passwordToUse);
		await this.confirmPassword.fill(passwordToUse);
		return passwordToUse;
	}

	async checkTermsBox(): Promise<void> {
		await this.termsCheckbox.check();
	}

	async clickRegisterButton(): Promise<void> {
		await this.registerButton.click();
	}

	// error messages
	async verifyErrorMessage(error: string): Promise<void> {
		await expect(this.errorAlert).toContainText(error);
	}
}
