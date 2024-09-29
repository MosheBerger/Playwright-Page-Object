import type { Locator, Page } from 'playwright-core';
import { ButtonLocator, CheckboxLocator, InputLocator, LinkLocator, TableLocator, TableLocatorOptions, TextContainerLocator } from '../explicitLocators';
import type { LinkOptions, LocatorOptions, } from '../types';
// import { BaseLocator } from "./base.locator";


export abstract class BasePage {

    page: Page
    // $?: { [key: string]: Locator | BaseLocator | (() => Locator | BaseLocator) }


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
            return new TextContainerLocator(this.page, locator, options)
        },
        Table: <ColumnsNames extends string>(locator: Locator | string, columnsNames: ColumnsNames[], options?: TableLocatorOptions) => {
            return new TableLocator<ColumnsNames>(this.page, locator, columnsNames, options)
        }
        // Radio: (locator: Locator | string, options?: LocatorOptions) => {
        //     return new RadioLocator(this.page, locator, options)
        // },
        // SaveButton: (locator: Locator | string, options?: LocatorOptions) => {
        //     return new SaveButtonLocator(this.page, locator, options)
        // },
    }



}
