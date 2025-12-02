import { expect, Page } from "@playwright/test";
import { BasePage } from "../BasePage";

export class CookiesPolicyPage extends BasePage {
	constructor(protected readonly page: Page) {
		super(page);
	}

	async verifyPage(): Promise<void> {
		await expect(this.page).toHaveURL("https://mallblitz.com/cookies");
	}
}
