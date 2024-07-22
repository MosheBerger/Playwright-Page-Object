/**
 * Executes a callback function on each element of an array and returns a new array with the results.
 * 
 * @param array - The array to iterate over.
 * @param callback - The callback function to execute on each element of the array. Receives the current element as a parameter and should return a promise.
 * @returns A promise that resolves to a new array with the results of the callback function executions.
 */
export async function mapArray<T,U>(array : T[], callback: (el: T) => Promise<U>) {
    return await Promise.all(array.map(callback))
}