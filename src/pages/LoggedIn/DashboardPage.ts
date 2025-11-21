import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";

export class DashboardPage extends BasePage {
	// Success messages
	protected readonly successfulRegisterToast: Locator;
	protected readonly successfulLoginToast: Locator;

	protected readonly verifiedText: Locator;

	constructor(protected readonly page: Page) {
		super(page);

		// Success messages
		this.successfulRegisterToast = page.getByText("Account created successfully");
		this.successfulLoginToast = page.getByText("Successfully signed in!");

		this.verifiedText = page.getByText("Email verified successfully! Welcome to your dashboard.");
	}

	// === Basic assertions ===
	async verifyPage(): Promise<void> {
		await expect(this.page).toHaveURL("https://mallblitz.com/dashboard");
	}

	async verifyHeadingName(fullName: string): Promise<void> {
		const heading = this.page.getByRole("heading", { name: `Welcome back, ${fullName}!`, exact: true });
		await expect(heading).toBeVisible();
	}

	// === Success messages ===
	async verifyRegistrationSuccessMessage(): Promise<void> {
		await expect(this.successfulRegisterToast).toBeVisible();
	}

	async verifyLoginSuccessMessage(): Promise<void> {
		await expect(this.successfulLoginToast).toBeVisible();
	}

	async verifyVerifiedText(): Promise<void> {
		await expect(this.verifiedText).toBeVisible();
	}

	// === ===
}
