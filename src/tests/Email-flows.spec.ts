import { test } from "../fixtures/pomManager";
import { API } from "../pages/API";

test.only("Verify email address", async ({ pomManager, request, page }) => {
	const api = new API(request);

	let userData: {
		fullName: string;
		email: string;
		password: string;
	};

	let verificationURL: string;

	await test.step("Verify home page and click register button", async () => {
		await pomManager.homePage.goToHomePage();
		await pomManager.homePage.verifyPage();
		await pomManager.homePage.clickSignUpButton();
	});

	await test.step("Verify register page and complete registration", async () => {
		await pomManager.registerPage.verifyPage();
		userData = {
			fullName: await pomManager.registerPage.fillNameFieldAndReturnIt(),
			email: await pomManager.registerPage.fillEmailFieldAndReturnIt(),
			password: await pomManager.registerPage.fillPasswordFieldsAndReturnIt(),
		};
		await pomManager.registerPage.checkTermsBox();
		await pomManager.registerPage.clickRegisterButton();
	});

	await test.step("Complete account verification via API", async () => {
		await page.waitForTimeout(5000);
		const messageId = await api.callMessagesList(userData.email);
		verificationURL = await api.getVerificationLink(messageId);
		await page.goto(verificationURL);
	});

	await test.step("Verify email verification on dashboard page", async () => {
		await pomManager.dashboardPage.verifyVerifiedText();
	});

	await test.step("Cleanup - delete account", async () => {
		await pomManager.header.clickDropdownProfile(userData.fullName);
		await pomManager.profilePage.clickDeleteAccountButton();
		await pomManager.profilePage.fillPasswordAndDeleteAccount(userData.password);
	});
});

test("Reset password", async ({ pomManager, request }) => {
	let userData: {
		fullName: string;
		email: string;
		password: string;
	};

	await test.step("Verify register page and complete registration", async () => {
		await pomManager.registerPage.verifyPage();
		userData = {
			fullName: await pomManager.registerPage.fillNameFieldAndReturnIt(),
			email: await pomManager.registerPage.fillEmailFieldAndReturnIt(),
			password: await pomManager.registerPage.fillPasswordFieldsAndReturnIt(),
		};
		await pomManager.registerPage.checkTermsBox();
		await pomManager.registerPage.clickRegisterButton();
	});

	await test.step("Log out", async () => {
		await pomManager.header.clickDropdownSignOut(userData.fullName);
	});

	await test.step("Verify home page, click login button and click forgot password", async () => {
		await pomManager.homePage.goToHomePage();
		await pomManager.homePage.verifyPage();
		await pomManager.homePage.clickSignInButton();
		await pomManager.loginPage.clickForgotPassword();
	});

	await test.step("Go forgot password page and input already registered email", async () => {
		await pomManager.forgotPassword.verifyPage();
		await pomManager.forgotPassword.fillEmailField(userData.email);
		await pomManager.forgotPassword.clickSendResetButton();
	});

	await test.step("", async () => {});
});
