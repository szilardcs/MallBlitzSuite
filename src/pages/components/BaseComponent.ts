import { Page } from "@playwright/test";

export abstract class BaseComponent {
	constructor(protected readonly page: Page) {}

	protected async goToHomePage() {
		await this.page.goto("");
	}
}
