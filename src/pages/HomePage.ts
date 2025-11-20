import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
	// header
	protected readonly headerWrapper: Locator;
	protected readonly homeLogo: Locator;
	// protected readonly languageSelector: Locator;
	// protected readonly darkModeToggle: Locator;
	// protected readonly lightModeToggle: Locator
	protected readonly signInButton: Locator;
	protected readonly signUpButton: Locator;
	// protected readonly blogButton: Locator;

	//body
	protected readonly bodyWrapper: Locator;
	protected readonly getStartedButton: Locator;
	protected readonly bodySignInButton: Locator;

	// footer

	constructor(protected readonly page: Page) {
		super(page);

		// header
		this.headerWrapper = page.getByRole("navigation");
		this.homeLogo = this.headerWrapper.getByRole("heading", { name: "MallBlitz" });
		this.signInButton = this.headerWrapper.getByRole("link", { name: "Sign In" });
		this.signUpButton = this.headerWrapper.getByRole("link", { name: "Sign Up" });

		// body
		this.bodyWrapper = page.getByRole("main");
		this.getStartedButton = this.bodyWrapper.getByRole("link", { name: "Get Started" });
		this.bodySignInButton = this.bodyWrapper.getByRole("link", { name: "Sign In" });
	}

	async goToHomePage(): Promise<void> {
		await this.page.goto("/");
	}

	async verifyPage(): Promise<void> {
		await expect(this.page).toHaveURL("https://mallblitz.com/");
	}

	async clickLogo(): Promise<void> {
		await this.homeLogo.click();
	}

	async clickSignInButton(): Promise<void> {
		await this.signInButton.click();
	}

	async clickSignUpButton(): Promise<void> {
		await this.signUpButton.click();
	}
}
