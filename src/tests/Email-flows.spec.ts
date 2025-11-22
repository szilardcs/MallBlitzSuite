import { test } from "../fixtures/pomManager";
import { API } from "../pages/API";

test("Verify email address", async ({ pomManager, request, page }) => {
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
		await page.waitForTimeout(2000);
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

test("Reset password", async ({ pomManager, request, page }) => {
	const api = new API(request);
	let verificationURL: string;

	let userData: {
		fullName: string;
		email: string;
		password: string;
	};

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

	await test.step("Log out", async () => {
		await pomManager.header.clickDropdownSignOut(userData.fullName);
	});

	await test.step("Verify home page, click login button and click forgot password", async () => {
		await pomManager.homePage.goToHomePage();
		await pomManager.homePage.verifyPage();
		await pomManager.homePage.clickSignInButton();
		await pomManager.loginPage.clickForgotPassword();
	});

	await test.step("Go to forgot password page and input already registered email", async () => {
		await pomManager.forgotPasswordPage.verifyPage();
		await pomManager.forgotPasswordPage.fillEmailField(userData.email);
		await pomManager.forgotPasswordPage.clickSendResetButton();
	});

	await test.step("Go to reset password page via API", async () => {
		await page.waitForTimeout(2000);
		const messageId = await api.callMessagesList(userData.email);
		verificationURL = await api.getPasswordResetLink(messageId);
		await page.goto(verificationURL);
	});

	await test.step("Fill password fields and reset password", async () => {
		await pomManager.resetPasswordPage.verifyPage();
		await page.waitForTimeout(500);
		userData.password = await pomManager.resetPasswordPage.fillPasswordFields();
		await pomManager.resetPasswordPage.clickResetPassword();
		await pomManager.resetPasswordPage.verifySuccessMessage();
	});

	await test.step("Login with new password", async () => {
		await pomManager.homePage.goToHomePage();
		await pomManager.homePage.clickSignInButton();

		await pomManager.loginPage.fillLoginEmail(userData.email);
		await pomManager.loginPage.fillLoginPassword(userData.password);
		await pomManager.loginPage.clickLoginButton();
	});

	await test.step("Cleanup - delete account", async () => {
		await pomManager.header.clickDropdownProfile(userData.fullName);
		await pomManager.profilePage.clickDeleteAccountButton();
		await pomManager.profilePage.fillPasswordAndDeleteAccount(userData.password);
		await pomManager.loginPage.verifyAccountDeletedText();
	});
});
