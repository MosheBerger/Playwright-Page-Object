import { Locator, Page } from "@playwright/test";

async function catchNewPage(page: Page, buttonToPress: Locator, closeCurrentPage?: boolean) {
    const nextPagePromise = page.context().waitForEvent('page')
    await buttonToPress.click()
    const nextPage= await nextPagePromise
    await nextPage.waitForLoadState()

    if (closeCurrentPage) {
        await page.close()
    }
    return nextPage
}

export default catchNewPage