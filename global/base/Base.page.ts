import { Locator, Page, /* chromium */ } from "@playwright/test";
import waitForSaveMessage from "../utils/waitForMessage";
import { ButtonLocator, CheckboxLocator, InputLocator, Link as LinkLocator, RadioLocator, SaveButtonLocator, TypographyLocator } from "../../src/Elements.locator";



abstract class BasePage {
    page: Page
    abstract $: { [key: string]: Locator|BaseLocator } 
    constructor(page: Page) {
        this.page = page
    }

    protected is = {
        Button: (locator: Locator | string, options?: LocatorOptions) => {
            return new ButtonLocator(this.page, locator, options)
        },
        Input: (locator: Locator | string, options?: LocatorOptions) => {
            return new InputLocator(this.page, locator, options)
        },
        Checkbox: (locator: Locator | string, options?: LocatorOptions) => {
            return new CheckboxLocator(this.page, locator, options)
        },
        Radio: (locator: Locator | string, options?: LocatorOptions) => {
            return new RadioLocator(this.page, locator, options)
        },
        Textual: (locator: Locator | string, options?: LocatorOptions) => {
            return new TypographyLocator(this.page, locator, options)
        },
        SaveButton: (locator: Locator | string, options?: LocatorOptions) => {
            return new SaveButtonLocator(this.page, locator, options)
        },
        Link: <T>(locator: Locator | string, options?: LinkOptions<T>) => {
            return new LinkLocator<T>(this.page, locator, options)
        }
    }
}

// === LOCATORS ====

type LocatorOptions = {
    parent?: Locator,
    pos?: 'first' | 'last' | number
}

class BaseLocator {
    protected page: Page
    $: Locator

    constructor(page: Page, locator: Locator | string, options?: LocatorOptions) {
        this.page = page

        if (typeof locator === 'string') {
            this.$ = page.locator(locator)

        } else {
            this.$ = locator
        }

        
        if (!options) { return }

        const { pos, parent } = options

        if (parent) {
            this.$ = parent.locator(this.$)
        }

        if (pos === 'first') {
            this.$ = this.$.first()

        } else if (pos === 'last') {
            this.$ = this.$.last()

        } else if (typeof pos === 'number') {
            this.$ = this.$.nth(pos)
        }
    }
}
//todo?
// export class SaveButtonLocator extends ButtonLocator {
//     clickAndWaitForSaveMessage = async () => {
//         await this.click()
//         await waitForSaveMessage(this.page, this.$)
//     }
// }


// interface ItemOptions {
//     title?: string
//     editButton?: string
//     deleteButton?: string

// }
// class Item extends BaseLocator {
//     title?: Locator
//     editButton?: Locator
//     deleteButton?: Locator

//     constructor(page: Page, divLocator: Locator | string, options: ItemOptions) {
//         super(page, divLocator)

//         if (options.title) {
//             this.title = this.$.locator(options.title)
//         }
//         if (options.editButton) {
//             this.editButton = this.$.locator(options.editButton)
//         }
//         if (options.deleteButton) {
//             this.deleteButton = this.$.locator(options.deleteButton)
//         }
//     }

//     async getTitle() {
//         return await this.title?.innerText()
//     }

//     async edit() {
//         await this.editButton?.click()
//     }

//     async delete() {
//         await this.deleteButton?.click()
//     }

// }

async function test() {
    // const a = await chromium.launch()
    // const page = await a.newPage()

    // const t = new Item(page, 'div',{title: 'test', })
    // t.editButton?.click()
    // const c = new Button(page, 'button')
    // await c.fill('test', { force: true })

    // // const child = new ParentAndChildren(page, 'div', [
    // //     ['child1', page.locator('div')],
    // //     ['child3', page.locator('div')],
    // //     ['child2', page.locator('div')],
    // // ])

    // // child.child1.click()
    // // const d = new Input(page, 'input')
    // const z = parentAndChildren(c.$, [c.$, c.$,])
    // z.
}
// test()

// export { Button, Input, Textual, Item }
export default BasePage
