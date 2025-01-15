import { Locator, Page } from "playwright-core"
import { ButtonLocator, CheckboxLocator, InputLocator, LinkLocator, RadioLocator, TextContainerLocator } from "../explicitLocators"


// basic locators
type ExplicitLocatorType = 'Button' | 'Input' | 'Checkbox' | 'TextContainer' | 'Link' | 'Radio'


// convert string to explicit-locator
export type ExplicitLocator<T extends ExplicitLocatorType, U, V extends string = string> =
    T extends 'Button' ? ButtonLocator :
    T extends 'Input' ? InputLocator :
    T extends 'Checkbox' ? CheckboxLocator :
    T extends 'TextContainer' ? TextContainerLocator :
    T extends 'Link' ? LinkLocator<U> :
    T extends 'Radio' ? RadioLocator<V> :
    never

// convert helper. use when you need just one parameter in the generic
// type ExplicitOneParam<T extends ExplicitLocatorType> = ExplicitLocator<T, undefined>
// type ExplicitTwoParamsString<T extends ExplicitLocatorType, V extends string> = ExplicitLocator<T, undefined, V>
// type ExplicitTwoParams<T extends ExplicitLocatorType, U> = ExplicitLocator<T, U>


// the object that the function gets
type ExplicitCreatorObject<T extends ExplicitLocatorType, U, V extends string = string> =
    T extends 'Link' ? { type: T, nextPageClass?: new (page: Page) => U, toUrl?: string } :
    T extends 'Radio' ? { type: T, radioOptions: V[] } :
    { type: T }


function convertor<T extends ExplicitLocatorType>(
    page: Page, Locator: string | Locator, explicitCreatorObject: ExplicitCreatorObject<T, undefined>
): ExplicitLocator<T, undefined>

function convertor<T extends ExplicitLocatorType, V extends string>(
    page: Page, Locator: string | Locator, explicitCreatorObject: ExplicitCreatorObject<T, undefined, V>
): ExplicitLocator<T, undefined, V>

function convertor<T extends ExplicitLocatorType, U>(
    page: Page, Locator: string | Locator, explicitCreatorObject: ExplicitCreatorObject<T, U>
): ExplicitLocator<T, U>

function convertor<T extends ExplicitLocatorType, U, V extends string>(page: Page, Locator: string | Locator, explicitCreatorObject: ExplicitCreatorObject<T, U, V>) {
    const { type } = explicitCreatorObject

    switch (type) {
        case 'Button':
            return new ButtonLocator(page, Locator) //as ExplicitLocator<T, undefined>
        case 'Input':
            return new InputLocator(page, Locator)// as ReturnHelper<T>
        case 'Checkbox':
            return new CheckboxLocator(page, Locator) //as ReturnHelper<T>
        case 'TextContainer':
            return new TextContainerLocator(page, Locator) //as ReturnHelper<T>
        case 'Link':
            const { nextPageClass, toUrl } = explicitCreatorObject
            return new LinkLocator(page, Locator, { nextPageClass, toUrl })// as ExplicitLocator<T, U extends (new (page: Page) => infer U) ? U : undefined>

        case 'Radio':
            const { radioOptions } = explicitCreatorObject
            return new RadioLocator(page, Locator, radioOptions)// as ExplicitLocator<T, typeof radioOptions[number]>
    }
}


// ------WITH NAME------------------------

type withName<T extends ExplicitLocatorType, U, V extends string, W extends string> =
    { name: W } & ExplicitCreatorObject<T, U, V>

function fromName<T extends ExplicitLocatorType, U, V extends string, W extends string>(
    page: Page, Locator: string | Locator, explicitCreatorObject: withName<T, U, V, W>
): Record<W, ReturnType<typeof convertor>> {

    const result: Record<string, ReturnType<typeof convertor>> = {};

    const { name } = explicitCreatorObject
    result[name] = convertor(page, Locator, { ...explicitCreatorObject })

    return result
}

const z = fromName({} as Page, '', { type: 'Button', name: 'key' })
z.key

class testClass { constructor(page: Page) { } }
class testClass2 { constructor(page: Page) { } }

const button = convertor({} as Page, '', { type: 'Button' })
const input = convertor({} as Page, '', { type: 'Input' })

const radio = convertor({} as Page, '', { type: 'Radio', radioOptions: ['a', 'b', 'c'] })
const r = convertor({} as Page, '', { type: 'Radio', radioOptions: [] })

const Link = convertor({} as Page, '', { type: 'Link' })
const LinkClass1 = convertor({} as Page, '', { type: 'Link', nextPageClass: testClass })
const LinkClass2 = convertor({} as Page, '', { type: 'Link', nextPageClass: testClass2 })

/// until here is working
/// -----------------------------

type ArrayOfLocators = withName<>
const arrayOfLocators= [
    // { name: 'Link', type: 'Link', nextPageClass: testClass, toUrl: '' },
    { type: 'Button', name: 'button' },
]

function fromArray<T extends ExplicitLocatorType, U, V extends string, W extends string>(
    page: Page, Locator: string | Locator, arrayOfLocators: withName<T, U, V, W>[]
) {
    const a = arrayOfLocators.map(x => fromName(page, Locator, x))
    a[0]
}
fromArray({} as Page, '', arrayOfLocators as withName<typeof arrayOfLocators[number]['type'], any, any, any, >[])



/// -----------------------------

const keys = ['key1', 'key2', 'key3'] as const
type tup = [number, string, boolean]
const tuptup: tup = [1, '2', true]

function objFromArray<T extends string, tu extends tup>(keys: readonly T[], tup:tu) : Record<T, tu[number]> {
    const obj = keys.reduce(<i extends number>(obj:{}, key:T, index:i) => ({ ...obj, [key]: tup[index] }), {})
    return obj as Record<T, tu[number]>
}

const res =objFromArray(keys, tuptup)
res.key1
