import { test as base } from "@playwright/test";
import PomManager from "../pages/ManagePage";

type Fixture = {
	pomManager: PomManager;
};

export const test = base.extend<Fixture>({
	pomManager: async ({ page }, use) => {
		await use(new PomManager(page));
	},
});

export { expect } from "@playwright/test";
