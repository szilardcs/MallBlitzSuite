import { Page } from "@playwright/test";

export abstract class BasePage {
	constructor(protected readonly page: Page) {}

	protected async goToHomePage() {
		await this.page.goto("");
	}

	public abstract verifyPage(): Promise<void>;
}
