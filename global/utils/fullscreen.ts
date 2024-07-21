import { Page } from "@playwright/test";

const fullScreen = {

    enter: async (page: Page) => {

        await changeWindowState(page, "fullscreen");
    },

    exit: async (page: Page) => {

        await changeWindowState(page, "normal");
    }
}


async function changeWindowState(page: Page, state: "fullscreen" | "normal") {
    const client = await page.context().newCDPSession(page);
    // get window id from CDP session
    const { windowId } = await client.send("Browser.getWindowForTarget");
    await client.send("Browser.setWindowBounds", {
        windowId: windowId,
        bounds: { windowState: state },
    });
}

export default fullScreen