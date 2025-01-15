// different objects
class button {
    constructor(a: string) { }

    click() { }
}

class input {
    constructor(a: string) { }

    fill() { }
}

class link<T> {
    private b: T
    constructor(a: string, b: T) { this.b = b }

    click() { return this.b }
}



// basic type
type Types = 'button' | 'input' | 'link'

// return type
type ReturnIt<T extends Types, R> =
    T extends 'button' ? button :
    T extends 'input' ? input :
    T extends 'link' ? link<R> :
    never

// return helper
// type ReturnHelper<T extends Types> = ReturnIt<T, void>

// params type for different objects 
type Params<T extends Types, R> =
    T extends 'link' ? { type: T, a: string, b: R } :
    { type: T, a: string }



function create<T extends Types>(data: Params<T, undefined>): ReturnIt<T, undefined>
function create<T extends Types, R>(data: Params<T, R>): ReturnIt<T, R>

function create<T extends Types, R>(data: Params<T, R>) {
    const { type, a } = data

    switch (type) {
        case 'button':
            return new button(a) //as ReturnHelper<T>
        case 'input':
            return new input(a)// as ReturnHelper<T>
        case 'link':
            return new link(a, data.b)// as ReturnIt<T, typeof data.b>
        default:
            throw new Error('Invalid type')
    }
}

const test = create({ type: 'link', a: 'a', b: 'hi' })
const test2 = create({ type: 'input', a: 'a' })
const a = test.click()


// ----------------------------------------------

const arr: Params<Types, unknown>[] = []
arr.push({ type: 'link', a: 'a', b: 'hi' })
arr.push({ type: 'button', a: 'a' })

const z = arr[0]


const types = ['button', 'input', 'link'] as const
const names = ['a', 'b', 'c'] as const

function con<T extends Types, Y>(ar1: readonly T[], ar2: readonly Y[]) {

    return [ar1, ar2]
}

const res = con(types, names)
res

//?
/// --------create tuple from array--------------
/// --------map each element in an array--------------

// tool map each element in an array 
type MapUnionWithUndefined<T> = { [K in keyof T]: T[K] | undefined };

type MapUnionWithUndefined2<T extends Array<Types>> = { [K in keyof T]: ReturnIt<T[K], undefined> };
type MapUnionWithUndefined3<T extends Array<Params<Types, R>>, R = any> = { [K in keyof T]: ReturnIt<T[K]['type'], T[K][]> };

// tool to create tuple from array
// function tupleFromArray<T extends Array<any>>(items: [...T])

function tupleFromArray<T extends Array<Types>>(items: [...T]): MapUnionWithUndefined2<T> {
    return {} as MapUnionWithUndefined2<T>
}
const tfa = tupleFromArray(['button', 'input', 'link'])

// tool to create different generic objects inside an array 
// <T extends Array<Params<Types, unknown>>>

// -----------using objects instead of strings--------------------------------
// function tupleFromArrayb<T extends Array<Params<Types, R>>,R = T[number] extends { type:'link' } ? T[number]['b'] : undefined>(items: [...T]) :MapUnionWithUndefined3<T,R> 
// function tupleFromArrayb<T extends Array<Params<Types, undefined>>>(items: [...T]) :MapUnionWithUndefined3<T> 



// function tupleFromArrayb<T extends Array<Params<Types, R>>, R =  { [K in keyof T]: T[K] extends { type: 'link' } ? T[K]['b'] : string }>(items: [...T]): MapUnionWithUndefined3<T> {
function tupleFromArrayb<T extends Array<Params<Types, R>>, R extends >(items: [...T]): MapUnionWithUndefined3<T> {

    return items.map(x => create<typeof x.type>(x)) as unknown as MapUnionWithUndefined3<T> | MapUnionWithUndefined3<T, R>
}

const tfa2 = tupleFromArrayb([{ type: 'link', a: 'a', b: 'hi' }, { type: 'button', a: 'a' }])
//      ^?


//---------------------------------------
// get array of keys and return object with keys

function getObjectKeys<T extends Array<string>, K extends Array<unknown>, N extends number>(keys: [...T], types: K) {
    return {} as Record<T[N], K[N]>
}

const tes = getObjectKeys(['a', 'b', '7',], [true, 2, 'hi'])
// ^?


class someClass {
    constructor(
        public a: string
    ) { }
}

new someClass('a')

// ----------------

class cup { cup = 1 }
class plate<Z> { constructor(public a: Z) { } }

type cupOrPlate<Z = void> = { type: 'cup' } | { type: 'plate', a: Z }
type aOrVoid<T extends Array<cupOrPlate<unknown>>> = { [K in keyof T]: T[K] extends { type: 'plate' } ? T[K]['a'] : void }

type mapItReturn<T extends cupOrPlate<Z>, Z = void> = T extends { type: 'cup' } ? cup : T extends { type: 'plate', a: Z } ? plate<Z> : void
type fromArr<T extends Array<cupOrPlate<aOrVoid<T>>>> = { [K in keyof T]: (mapItReturn<T[K] extends cupOrPlate ? T[K] : never, T[K] extends { type: 'plate' } ? T[K]['a'] : void>) }


declare function mapIt
    <T extends Array<cupOrPlate<aOrVoid<T>>>>
    (obj: [...T]):
    fromArr<T>


const cupORplate = mapIt([{ type: 'plate', a: 44 }, { type: 'plate', a: 'z' }, { type: 'cup' }] as const)
//        ^?
cupORplate[0].a


// ------------------------------------

class Maybe<T> { }

type MaybeTuple = [Maybe<string>, Maybe<number>, Maybe<boolean>];

type MaybeType<T> = T extends Maybe<infer MaybeType> ? MaybeType : never;
type MaybeTypes<Tuple extends [...any[]]> = {
    [Index in keyof Tuple]: MaybeType<Tuple[Index]>;
} //& { length: Tuple['length'] };

const extractedTypes: MaybeTypes<MaybeTuple> = ['hello', 3, true];
const aba = extractedTypes
//       ^?
