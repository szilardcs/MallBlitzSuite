import { Page } from "@playwright/test";
import { BlogPage } from "./BlogPage";
import { HeaderComponent } from "./components/HeaderComponent";
import { HomePage } from "./HomePage";
import { DashboardPage } from "./LoggedIn/DashboardPage";
import { ProfilePage } from "./LoggedIn/ProfilePage";
import { SettingsPage } from "./LoggedIn/SettingsPage";
import { LoginPage } from "./LoginPage";
import { ForgotPasswordPage } from "./Password/ForgotPasswordPage";
import { ResetPasswordPage } from "./Password/ResetPasswordPage";
import { RegisterPage } from "./RegisterPage";

export default class ManagePage {
	constructor(private readonly page: Page) {}

	private _home?: HomePage;
	private _dashboard?: DashboardPage;
	private _profile?: ProfilePage;
	private _settings?: SettingsPage;
	private _login?: LoginPage;
	private _register?: RegisterPage;
	private _header?: HeaderComponent;
	private _blog?: BlogPage;
	private _forgotPasswordPage?: ForgotPasswordPage;
	private _resetPasswordPage?: ResetPasswordPage;

	get dashboardPage(): DashboardPage {
		return (this._dashboard ??= new DashboardPage(this.page));
	}

	get profilePage(): ProfilePage {
		return (this._profile ??= new ProfilePage(this.page));
	}

	get settingsPage(): SettingsPage {
		return (this._settings ??= new SettingsPage(this.page));
	}

	get loginPage(): LoginPage {
		return (this._login ??= new LoginPage(this.page));
	}

	get registerPage(): RegisterPage {
		return (this._register ??= new RegisterPage(this.page));
	}

	get homePage(): HomePage {
		return (this._home ??= new HomePage(this.page));
	}

	get header(): HeaderComponent {
		return (this._header ??= new HeaderComponent(this.page));
	}

	get blogPage(): BlogPage {
		return (this._blog ??= new BlogPage(this.page));
	}

	get forgotPasswordPage(): ForgotPasswordPage {
		return (this._forgotPasswordPage ??= new ForgotPasswordPage(this.page));
	}

	get resetPasswordPage(): ResetPasswordPage {
		return (this._resetPasswordPage ??= new ResetPasswordPage(this.page));
	}
}
