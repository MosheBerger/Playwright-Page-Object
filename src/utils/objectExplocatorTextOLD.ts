// == Table Locator Helpers == 👇

type ExpLocatorName = 'Button' | 'Input' | 'Checkbox' | 'TextContainer' | 'Link' //| 'Radio'

type ExpLocatorTextObject<L = unknown, /* R = unknown */> =
    | { type: 'Link', nextPageClass?: L }
    | { type: Exclude<ExpLocatorName, ('Link' | 'Radio')> }
    | never
// | { type: 'Radio', radioOptions: R[] }


type ExplicitLocator<T extends ExpLocatorName, L = unknown /*, R = unknown */> =
    T extends 'Button' ? ButtonLocator :
    T extends 'Input' ? InputLocator :
    T extends 'Checkbox' ? CheckboxLocator :
    T extends 'TextContainer' ? TextContainerLocator :
    T extends 'Link' ? LinkLocator<L> :
    // T extends 'Radio' ? RadioLocator<R extends string[] ? {} : string> :
    never

type ExpLoObjArray<T extends ExpLocatorTextObject[]> = {
    [K in keyof T]: ExplicitLocator<
        T[K]['type'],
        T[K] extends { type: 'Link' } ? T[K]['nextPageClass'] : unknown
    // T[K] extends { type: 'Radio' } ? T[K]['radioOptions'] : unknown
    >
}

type TableColumnLocator<T extends ExpLocatorTextObject, N extends string> = {
    locator: T,
    name: N,
}

declare function fromArray<T extends ExpLocatorTextObject[]>(expLocatorTextObjects: readonly [...T]): ExpLoObjArray<T>

declare function TupleToObj<T extends Array<TableColumnLocator<ExpLocatorTextObject, string>>>(obj: T): { [K in T[number]as K['name']]: ExplicitLocator<K['locator']['type'], K['locator'] extends { type: 'Link' } ? K['locator']['nextPageClass']: unknown> };

const some = [
    {name: 's', 'locator': {type: 'Button', }},
] satisfies Array<TableColumnLocator<ExpLocatorTextObject, string>>
