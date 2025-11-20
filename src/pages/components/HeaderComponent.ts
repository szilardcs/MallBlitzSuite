import { expect, Locator, Page } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";

export class HeaderComponent extends BaseComponent {
	// Dropdowns
	protected readonly dropdownDashboardButton: Locator;
	protected readonly dropdownProfileButton: Locator;
	protected readonly dropdownSettingsButton: Locator;
	protected readonly dropdownSignoutButton: Locator;

	protected readonly successfulRegisterToast: Locator;
	protected readonly successfulLoginToast: Locator;
	protected readonly successfulAvatarToast: Locator;

	constructor(protected readonly page: Page) {
		super(page);

		// Dropdowns
		this.dropdownDashboardButton = this.page.getByRole("menuitem", { name: "Dashboard" });
		this.dropdownProfileButton = this.page.getByRole("menuitem", { name: "Profile" });
		this.dropdownSettingsButton = this.page.getByRole("menuitem", { name: "Settings" });
		this.dropdownSignoutButton = this.page.getByRole("menuitem", { name: "Sign out" });

		// Success messages
		this.successfulRegisterToast = page.getByText("Account created successfully");
		this.successfulLoginToast = page.getByText("Successfully signed in!");
		this.successfulAvatarToast = page.getByText("Profile picture updated successfully.");
	}

	// === Profile dropdown ===

	// helper to find dropdown by user full name
	private async clickProfileButton(fullName: string): Promise<void> {
		const navigation = this.page.getByRole("navigation");
		await this.successfulRegisterToast.waitFor({ state: "hidden" });
		await this.successfulLoginToast.waitFor({ state: "hidden" });
		await navigation
			.getByRole("button", { name: `${fullName}` })
			.first()
			.click();
	}

	async clickDropdownDashboard(fullName: string): Promise<void> {
		await this.clickProfileButton(fullName);
		await this.dropdownDashboardButton.click();
	}

	async clickDropdownProfile(fullName: string): Promise<void> {
		await this.clickProfileButton(fullName);
		await this.dropdownProfileButton.click();
	}

	async clickDropdownSettings(fullName: string): Promise<void> {
		await this.clickProfileButton(fullName);
		await this.dropdownSettingsButton.click();
	}

	async clickDropdownSignOut(fullName: string): Promise<void> {
		await this.clickProfileButton(fullName);
		await this.dropdownSignoutButton.click();
	}

	// Header avatar

	async verifyHeaderAvatar(fullName: string): Promise<void> {
		await this.successfulAvatarToast.waitFor({ state: "hidden" });
		const headerAvatar = this.page.getByRole("img", { name: `${fullName}`, exact: true });
		await expect(headerAvatar).toBeVisible();
	}
}
