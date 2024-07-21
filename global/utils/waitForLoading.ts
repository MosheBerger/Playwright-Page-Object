import { Page } from "@playwright/test";

const loadingBarLocator = (page: Page) => {
    return page.locator('#loading-bar')
}

const isLoading = async (page: Page) => {
    return await loadingBarLocator(page).count() > 0
}

const waitForLoading = async (page: Page) => {
    if (await isLoading(page)) {
        console.info('we found loading bar');
        await loadingBarLocator(page).waitFor({ state: 'detached' })

        // await page.waitForTimeout(500)
        try {
            await loadingBarLocator(page).waitFor({ state: 'attached', timeout: 500 })
            await waitForLoading(page)
        } catch (error) {
            console.info(`can't find loading bar`);
        }
    } else {

    }
}

export { isLoading }

export default waitForLoading;