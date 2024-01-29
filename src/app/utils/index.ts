export function hexToDec(hex: string) {
    try {
        return Number.parseInt(hex, 16)
    } catch (e) {
        return NaN
    }
}

/** Util to return Promise.withResolvers() */
export function PromiseWithResolvers<T>() {
    let resolve: (arg0: T) => void, reject: (err) => void
    const promise = new Promise<T>((res, rej) => {
        resolve = res
        reject = rej
    })
    return {
        promise,
        resolve,
        reject,
    }
}

export type WsCallbackRegistry = Record<number, (v) => void>
