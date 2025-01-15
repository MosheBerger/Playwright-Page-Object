type types = 'a' | 'b' | 'c'

function table<T extends types>(a: readonly T[]) {//}: typeof a[0] {

    type z = typeof a
    return (function <Z extends z>() {
        return {} as Z
    })()
    // return a[0]
}

const a = table(['a', 'a', 'b', 'c'])


export function makeTupleByArray<T extends Array<any>>(items: [...T]) : [...T] {
    return items;
}

const b = makeTupleByArray([1, 3, "ABC"]);

//
