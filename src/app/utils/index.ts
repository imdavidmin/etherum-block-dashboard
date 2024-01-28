import { RequestPayload } from '../constants'

export function hexToDec(hex: string) {
    try {
        return Number.parseInt(hex, 16)
    } catch (e) {
        return NaN
    }
}

/** Util to return Promise.withResolvers() */
export function PromiseWithResolvers<T>() {
    let resolve: (T) => void, reject: (err) => void
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

/** Returns a function that resembles `fetch()` for sending a payload over a WebSocket connection */
export const getWsFetch =
    (wsPromise: Promise<WebSocket>, cbRegistry: WsCallbackRegistry) =>
    (payload: RequestPayload) => {
        if (!payload.id) throw new Error('Wrong payload format')

        const { promise, resolve, reject } = PromiseWithResolvers()
        wsPromise.then((ws) => {
            if (payload.id in cbRegistry) {
                reject('Duplicate request ID with an ongoing WebSocket send')
            } else {
                console.log(`<WSS> ID ${payload.id}: Sending payload`, payload)
                cbRegistry[payload.id] = resolve
                ws.send(JSON.stringify(payload))
            }
        })
        return promise
    }
