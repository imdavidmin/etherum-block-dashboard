import { RequestPayload } from '../constants'
import { WsCallbackRegistry, PromiseWithResolvers } from '.'

/**
 * Returns a function that resembles `fetch()` for sending a payload over a WebSocket connection.
 * The returned function is attached to a single WebSocket object,
 * and uses a callback registry to respond to incoming messages by their "id" key.
 */

export const getWsFetch = (
    wsPromise: Promise<WebSocket>,
    cbRegistry: WsCallbackRegistry
) => {
    return async (payload: RequestPayload) => {
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
}
