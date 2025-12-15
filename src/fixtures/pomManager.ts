import { test as base } from "@playwright/test";
import { ApiClient } from "../api/client/apiClient";
import { MailApi } from "../api/endpoints/mail.api";
import PomManager from "../pages/ManagePage";

type Fixture = {
	pomManager: PomManager;
	apiClient: ApiClient;
	mailApi: MailApi;
};

export const test = base.extend<Fixture>({
	pomManager: async ({ page }, use) => {
		await use(new PomManager(page));
	},
	apiClient: async ({ request }, use) => {
		const client = new ApiClient(request);
		await use(client);
	},
	mailApi: async ({ apiClient }, use) => {
		await use(new MailApi(apiClient));
	},
});

export { expect } from "@playwright/test";
