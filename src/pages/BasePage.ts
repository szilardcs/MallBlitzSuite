import { Page } from "@playwright/test";

export abstract class BasePage {
	constructor(protected readonly page: Page) {}

	protected async goToHomePage() {
		await this.page.goto("");
	}

	protected async waitForNuxtAppHydration(selector = "[data-v-app]"): Promise<void> {
		await this.page.waitForFunction(
			(selector) => {
				const el = document.querySelector(selector) as HTMLElement & { __vue_app__?: unknown };
				return !!el?.__vue_app__;
			},
			selector
		);
	}

	public abstract verifyPage(): Promise<void>;
}
