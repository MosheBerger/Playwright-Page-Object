import { Page } from "@playwright/test";
import LoginPage from "../../pages/login/login.page";

export async function checkForLogin(page: Page) {

    // This login function is running in parallel to the main test and will not block the test.
    setTimeout(async () => {
        try {
            console.log('checking for login...');

            const login = new LoginPage(page)
            await login.login()

            await page.waitForURL('**\/ac/#/**')

            await page.context().storageState({ path: 'storageState.json' })
            console.log('saved login state');

        } catch (error) {
            console.log('no login needed');
        }
    }, 10) 


}