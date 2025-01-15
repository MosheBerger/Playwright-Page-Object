import type { Locator, Page } from "playwright-core"
import { ButtonLocator, CheckboxLocator, InputLocator, LinkLocator, RadioLocator, TextContainerLocator } from "./explicitLocators"


export type LocatorOptions = {
    parent?: Locator | string,
    position?: 'first' | 'last' | number
}

export type LinkOptions<T> = LocatorOptions & {
    nextPageClass?: new (page: Page) => T
    toUrl?: string
}


// == Table Locator Helpers == 👇

export type ExpLocatorType = 'Button' | 'Input' | 'Checkbox' | 'TextContainer' | 'Link' //| 'Radio'


export type TextToExplicitLocator<T extends ExpLocatorType> =
    T extends 'Button' ? ButtonLocator :
    T extends 'Input' ? InputLocator :
    T extends 'Checkbox' ? CheckboxLocator :
    T extends 'TextContainer' ? TextContainerLocator :
    T extends 'Link' ? LinkLocator<unknown> :
    never

type ExpLoNameArray<T extends ExpLocatorType[]> = {
    [K in keyof T]: TextToExplicitLocator<T[K]>
}

// declare function fromArray<T extends ExpLocatorType[]>(expLocatorText: readonly [...T]): ExpLoNameArray<T>

// const something = fromArray(['Button','Checkbox'])

export type TableColumnLocator<T extends ExpLocatorType, N extends string> = {
    locator: T,
    name: N,
}

// const check = [
//     { name: 'a', locator: 'Button' },
//     { name: 'b', locator: 'Checkbox' },
//     { name: 'c', locator: 'Input' },
// ] as const//satisfies Array<TableColumnLocator<ExpLocatorType, string>> 


export declare function TupleToObj<
    T extends Array<TableColumnLocator<ExpLocatorType, string>>
    >(
        obj: T
    ): {
        [K in T[number]as K['name']]: TextToExplicitLocator<K['locator']>
    };

// const some = [
//     { name: 's', locator:'Button' },
//     {name: 'd', locator: 'Link' }
// ] satisfies Array<TableColumnLocator<ExpLocatorName, string>>

// const z = TupleToObj([{ name: 'button', locator: 'Button' }, { name: 'liiink',  locator: 'Link' } ] as const)
//   z
// //^?