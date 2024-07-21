import { LocatorOptions, Page, Locator } from "../types"

export class BaseLocator {
    protected page: Page
    public $: Locator

    constructor(page: Page, locator: Locator | string, options?: LocatorOptions) {
        this.page = page

        if (typeof locator === 'string') {
            this.$ = page.locator(locator)

        } else {
            this.$ = locator
        }


        if (!options) { return }
        const { position, parent } = options

        if (parent) {
            const dad = new BaseLocator(this.page, parent)
            this.$ = dad.$.locator(this.$)
        }

        if (position === 'first') {
            this.$ = this.$.first()

        } else if (position === 'last') {
            this.$ = this.$.last()

        } else if (typeof position === 'number') {
            this.$ = this.$.nth(position)
        }
    }
}