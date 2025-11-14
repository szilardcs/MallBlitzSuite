import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class BlogPage extends BasePage {
	/// jozsinak:
	// IDs for:
	// category filter wrapper
	// featured articles wrapper
	// latest articles wrapper
	// searched articles wrapper
	// article wrapper
	// related articles wrapper
	// poster, post info wrapper
	// maybe more categories to select on blog page? // search for categories?
	//
	//
	//
	//

	// === Search ===

	protected readonly searchField: Locator;
	protected readonly noArticlesText: Locator;

	constructor(protected readonly page: Page) {
		super(page);

		this.searchField = page.getByRole("textbox", { name: "Search articles..." });
		this.noArticlesText = page.getByText("No articles found");
	}

	async verifyPage(): Promise<void> {
		await expect(this.page).toHaveURL("https://mallblitz.com/blog");
	}

	async goToBlogPage(): Promise<void> {
		await this.page.goto("https://mallblitz.com/blog");
	}

	// === Search ===

	async fillSearchField(query: string): Promise<void> {
		await this.searchField.fill(query);
	}

	async verifyNoArticlesFound(): Promise<void> {
		await expect(this.noArticlesText).toBeVisible();
	}
}
