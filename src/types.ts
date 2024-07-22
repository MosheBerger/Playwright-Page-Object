import { Locator, Page } from "playwright-core"
export type { Locator, Page }

type nth = number

export type LocatorOptions = {
    parent?: Locator | string,
    position?: 'first' | 'last' | nth
}

export type LinkOptions<T> = LocatorOptions & {
    nextPageClass?: new (page: Page) => T
    toUrl?: string
}
