import { Locator, Page } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";

export class FooterComponent extends BaseComponent {
	protected readonly footerWrapper: Locator;
	protected readonly footerBlog: Locator;
	protected readonly footerContactUs: Locator;
	protected readonly footerSiteMap: Locator;
	protected readonly footerTOS: Locator;
	protected readonly footerPrivacy: Locator;
	protected readonly footerCookies: Locator;

	constructor(protected readonly page: Page) {
		super(page);

		this.footerWrapper = page.locator("footer");
		this.footerBlog = this.footerWrapper.getByRole("link", { name: "Blog" });
		this.footerContactUs = this.footerWrapper.getByRole("link", { name: "Contact Us" });
		this.footerSiteMap = this.footerWrapper.getByRole("link", { name: "Site Map" });
		this.footerTOS = this.footerWrapper.getByRole("link", { name: "Terms of Service" });
		this.footerPrivacy = this.footerWrapper.getByRole("link", { name: "Privacy Policy" });
		this.footerCookies = this.footerWrapper.getByRole("link", { name: "Cookies Policy" });
	}

	async clickFooterBlog(): Promise<void> {
		await this.footerBlog.click();
	}

	async clickFooterContactUs(): Promise<void> {
		await this.footerContactUs.click();
	}

	async clickFooterSiteMap(): Promise<void> {
		await this.footerSiteMap.click();
	}

	async clickFooterTOS(): Promise<void> {
		await this.footerTOS.click();
	}

	async clickFooterPrivacy(): Promise<void> {
		await this.footerPrivacy.click();
	}

	async clickFooterCookies(): Promise<void> {
		await this.footerCookies.click();
	}
}
