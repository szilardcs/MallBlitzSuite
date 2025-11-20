import { test } from "../../fixtures/pomManager";

test.describe("Search field tests", async () => {
	test.beforeEach("Go to blog page", async ({ pomManager }) => {
		await pomManager.blogPage.goToBlogPage();
	});

	test("Enter correct search term", async ({ pomManager }) => {
		await pomManager.blogPage.fillSearchField("tempora");
	});

	test("Enter invalid search term", async ({ pomManager }) => {
		await pomManager.blogPage.fillSearchField("$$$$$");
		await pomManager.blogPage.verifyNoArticlesFound();
	});
});
