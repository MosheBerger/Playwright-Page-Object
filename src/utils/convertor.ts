import { Locator, Page } from "playwright-core"
import { ButtonLocator, CheckboxLocator, InputLocator, LinkLocator, RadioLocator, TextContainerLocator } from "../explicitLocators"


// basic locators
type ExplicitLocatorType = 'Button' | 'Input' | 'Checkbox' | 'TextContainer' | 'Link' | 'Radio'


// convert string to explicit-locator
type ExplicitLocator<T extends ExplicitLocatorType, U, V extends string = string> =
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


export function convertor<T extends ExplicitLocatorType>(
    page: Page, Locator: string | Locator, explicitCreatorObject: ExplicitCreatorObject<T, undefined>
): ExplicitLocator<T, undefined>

export function convertor<T extends ExplicitLocatorType, V extends string>(
    page: Page, Locator: string | Locator, explicitCreatorObject: ExplicitCreatorObject<T, undefined, V>
): ExplicitLocator<T, undefined, V>

export function convertor<T extends ExplicitLocatorType, U>(
    page: Page, Locator: string | Locator, explicitCreatorObject: ExplicitCreatorObject<T, U>
): ExplicitLocator<T, U>

export function convertor<T extends ExplicitLocatorType, U, V extends string>(page: Page, Locator: string | Locator, explicitCreatorObject: ExplicitCreatorObject<T, U, V>) {
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
