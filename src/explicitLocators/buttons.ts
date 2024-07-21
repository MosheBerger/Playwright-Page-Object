import { BaseLocator } from '../base'
import { LinkOptions, Locator, Page } from '../types'


export class ButtonLocator extends BaseLocator {
    click: Locator['click'] = this.$.click.bind(this.$)
}

export class LinkLocator<T> extends ButtonLocator {
    private nextPage: (new (page: Page) => T) | undefined
    private toUrl: string | RegExp | undefined

    constructor(page: Page, locator: Locator | string, options?: LinkOptions<T>) {
        super(page, locator, options)

        this.nextPage = options?.nextPageClass
        this.toUrl = options?.toUrl
    }

    navigate = async () => {
        await this.$.click()

        if (this.toUrl) {
            await this.page.waitForURL(this.toUrl)
        }

        if (this.nextPage) {
            return new this.nextPage(this.page)
        }
    }
}
