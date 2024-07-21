import { ButtonLocator, CheckboxLocator, InputLocator, LinkLocator, TypographyLocator } from '../explicitLocators';
import type { LinkOptions, Locator, LocatorOptions, Page } from '../types';
import { BaseLocator } from "./base.locator";

export abstract class BasePage {

    page: Page

    abstract $: { [key: string]: Locator | BaseLocator }

    constructor(page: Page) {
        this.page = page
    }


    protected is = {
        Button: (locator: Locator | string, options?: LocatorOptions) => {
            return new ButtonLocator(this.page, locator, options)
        },
        Link: <T>(locator: Locator | string, options?: LinkOptions<T>) => {
            return new LinkLocator<T>(this.page, locator, options)
        },
        Input: (locator: Locator | string, options?: LocatorOptions) => {
            return new InputLocator(this.page, locator, options)
        },
        Checkbox: (locator: Locator | string, options?: LocatorOptions) => {
            return new CheckboxLocator(this.page, locator, options)
        },
        Typography: (locator: Locator | string, options?: LocatorOptions) => {
            return new TypographyLocator(this.page, locator, options)
        },
        // Radio: (locator: Locator | string, options?: LocatorOptions) => {
        //     return new RadioLocator(this.page, locator, options)
        // },
        // SaveButton: (locator: Locator | string, options?: LocatorOptions) => {
        //     return new SaveButtonLocator(this.page, locator, options)
        // },
    }



}

// class test extends BasePage {

//     $ = {
//         username: this.is.Input('#username'),
//         password: this.is.Input('#password'),
//         login: this.is.Button('#login'),
//     }
// }


// const t = new test({} as Page)
// t.$.username.specialFill('test', {
//     click: true,
//     clear: true,
//     multipleValueBy: 200,
//     force: true
// })