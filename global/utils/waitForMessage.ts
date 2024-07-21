import { Locator, Page } from "@playwright/test";
import SAVE_MESSAGE_LOCATORS from "../locators/saveMessage.locator";


async function waitForSaveMessage(page: Page, buttonLocatorToPressAgain?: string | Locator,): Promise<string | null | undefined> {
    console.info('check save message');

    if (buttonLocatorToPressAgain) {
        return await tryAgainWhenIsBusy(page, buttonLocatorToPressAgain)

    } else {
        await page.waitForSelector(SAVE_MESSAGE_LOCATORS.SAVED);
    }
}

async function tryAgainWhenIsBusy(page: Page, buttonLocator: string | Locator) {

    const message = await page.waitForSelector('alert')

    const thereIsSuccessMessage = await page.locator('alert[type="success"]').isVisible()
    //todo check if it's working
    if (thereIsSuccessMessage) {
        return await page.textContent(SAVE_MESSAGE_LOCATORS.TEXT_CONTENT)

    } else {
        // await page.waitForTimeout(100)
        console.info('wait for message to be hidden');
        await message.waitForElementState('hidden')

        console.info('click submit button again');
        if (typeof buttonLocator === 'string') {
            await page.click(buttonLocator)

        } else {
            await buttonLocator.click()
        }

        return await tryAgainWhenIsBusy(page, buttonLocator)
    }
}

export default waitForSaveMessage