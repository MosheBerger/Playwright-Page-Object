import { Locator, Page } from "playwright-core";
import { BaseLocator } from "../base";

class TableLocator<columns extends string> extends BaseLocator {

    constructor(page: Page, locator: Locator | string,) {
        super(page, locator)


    }
}


///-----------------

class ButtonLocator {
    constructor(private page: Page, private locator: string) { }
    click() { }
}

class LinkLocator<L> {
    constructor(private page: Page, private locator: string, private options?: L) { }
    navigate() { }
}

// using default generic param value
type ExLocator<L = unknown> = ButtonLocator | LinkLocator<L>


type ExLocatorAsText = 'Button' | 'Link'

// using {type:'a'}| {type:'b'}
// type ExLocatorTextObject<L = unknown> =
//     | { type: Exclude<ExLocatorAsText, 'Link'> }
//     | { type: 'Link', options?: L }

type ExLocatorTextObject<T extends ExLocatorAsText, L = unknown> =
    T extends 'Link' ? { type: 'Link', options?: L } :
    { type: T }

type TextToExLocator<T extends ExLocatorAsText, L = unknown> =
    T extends 'Button' ? ButtonLocator :
    T extends 'Link' ? LinkLocator<L> :
    never

//// declare function stringToExLocator<T extends ExLocatorAsText, L> (type: T): TextToExLocator<T, L>

//// ReturnType<typeof stringToExLocator<T['type'],T extends {options:any}? T['options'] : unknown>>

declare function objToEx<T extends ExLocatorAsText, U extends ExLocatorTextObject<T>>(obj: U): TextToExLocator<U['type'], U extends { options: unknown } ? U['options'] : unknown>

const a = objToEx({type: 'Link', options:'knono'} as const)
//     ^?

const b = objToEx({ type: 'Button' })
//     ^?


//✌️

type ExObjArray<Text extends ExLocatorAsText, T extends ExLocatorTextObject<Text>[]> = {
    [K in keyof T]: TextToExLocator<
        T[K]['type'],
        T[K] extends { type: 'Link' } ? T[K]['options'] : unknown
    >
}

declare function fromArray<Text extends ExLocatorAsText, T extends ExLocatorTextObject<Text>[]>(obj: readonly [...T]): ExObjArray<Text,T>

const c = fromArray([{ type: 'Link', options: 'S' }, { type: 'Button' },] as const)
//     ^?

type withName<T extends ExLocatorAsText, N extends string> = {
    locator: TextToExLocator<T>,
    name: N
}

declare function TupleToObj<T extends Array<withName<ExLocatorAsText, string>>>(obj: [...T]): { [K in T[number]as K['name']]: K['locator'] };
//                                                                                        

const d = TupleToObj([{ locator: new LinkLocator<"S">({} as Page, ''), name: 'a' }, { locator: new ButtonLocator({} as Page, ''), name: 'b' }] as const)
//     ^?

