import { test } from "../../fixtures/pomManager";
import { testUserData } from "../../pages/LoginPage";

test.describe("Profile page tests using preset user", async () => {
	test.beforeEach("Complete login", async ({ pomManager }) => {
		await pomManager.homePage.goToHomePage();
		await pomManager.homePage.clickSignInButton();
		await pomManager.loginPage.fillLoginEmail();
		await pomManager.loginPage.fillLoginPassword();
		await pomManager.loginPage.checkRememberMe();
		await pomManager.loginPage.clickLoginButton();

		await pomManager.dashboardPage.verifyPage();
		await pomManager.dashboardPage.verifyHeadingName(testUserData.fullName);

		await pomManager.header.clickDropdownProfile(testUserData.fullName);
		await pomManager.profilePage.verifyPage();
	});

	test.afterEach("Log out", async ({ pomManager }) => {
		await pomManager.header.clickDropdownSignOut(testUserData.fullName);
		await pomManager.loginPage.verifyUserLoggedOutText();
	});

	test("Upload avatar with invalid file type", async ({ pomManager }) => {
		await pomManager.profilePage.uploadAvatar("Invalid");
		await pomManager.profilePage.verifyAvatarErrorMessage();
	});

	test("Change full name to empty string", async ({ pomManager }) => {
		await pomManager.profilePage.changeAndGetName("");
		await pomManager.profilePage.savePersonalInfo();
		await pomManager.profilePage.verifyNameErrorMessage();
	});

	test("Change email address to valid email without incorrect password", async ({ pomManager }) => {
		await pomManager.profilePage.changeCurrentEmailAndReturnIt();
		await pomManager.profilePage.enterPasswordForEmailChange("Invalidpass");
		await pomManager.profilePage.clickUpdateEmail();
		await pomManager.profilePage.verifyPasswordIncorrectErrorMessage();
	});
});

test.describe("Profile page tests - using new users", async () => {
	let userData: {
		fullName: string;
		email: string;
		password: string;
	};

	test.beforeEach("Complete registration", async ({ pomManager }) => {
		await pomManager.homePage.goToHomePage();
		await pomManager.homePage.verifyPage();
		await pomManager.homePage.clickSignUpButton();

		await pomManager.registerPage.verifyPage();
		userData = {
			fullName: await pomManager.registerPage.fillNameFieldAndReturnIt(),
			email: await pomManager.registerPage.fillEmailFieldAndReturnIt(),
			password: await pomManager.registerPage.fillPasswordFieldsAndReturnIt(),
		};

		await pomManager.registerPage.checkTermsBox();
		await pomManager.registerPage.clickRegisterButton();

		await pomManager.dashboardPage.verifyPage();
		await pomManager.dashboardPage.verifyRegistrationSuccessMessage();
		await pomManager.dashboardPage.verifyHeadingName(userData.fullName);
		await pomManager.header.clickDropdownProfile(userData.fullName);
	});

	test.afterEach("Cleanup - delete account", async ({ pomManager }) => {
		await pomManager.profilePage.clickDeleteAccountButton();
		await pomManager.profilePage.fillPasswordAndDeleteAccount(userData.password);
		await pomManager.loginPage.verifyPage();
		await pomManager.loginPage.verifyAccountDeletedText();
	});

	test("Change full name", async ({ pomManager }) => {
		userData.fullName = await pomManager.profilePage.changeAndGetName("John Wick");
		await pomManager.profilePage.savePersonalInfo();
		await pomManager.profilePage.verifyUserFullName(userData.fullName);
	});

	test("Change email address to valid email with valid password", async ({ pomManager }) => {
		userData.email = await pomManager.profilePage.changeCurrentEmailAndReturnIt();
		await pomManager.profilePage.enterPasswordForEmailChange(userData.password);
		await pomManager.profilePage.clickUpdateEmail();
		await pomManager.profilePage.verifyUserEmail(userData.email);
	});

	test("Update password", async ({ pomManager }) => {
		await pomManager.profilePage.fillCurrentPassword(userData.password);
		await pomManager.profilePage.fillNewPassAndConfirmPassFields();
		await pomManager.profilePage.clickSavePassword();
	});
});
