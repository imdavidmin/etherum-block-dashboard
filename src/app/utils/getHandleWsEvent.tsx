'use client'

import { MutableRefObject } from 'react'
import { WsCallbackRegistry } from '.'

export const messageEventHandlers = {
    subscription: (
        e: MessageEvent,
        registry: MutableRefObject<WsCallbackRegistry>,
        json
    ) => {
        if (json.method == 'eth_subscription') {
            const subscriptionId = json.params.subscription
            const handler = registry.current[subscriptionId]
            handler(json)
        } else if (json.result) {
            console.debug('<WSS> Subscription succeeded.', json)

            const subscriptionRequest = registry.current[json.id]
            registry.current[json.result] = subscriptionRequest
            delete registry.current[json.id]
        }
    },
    api: (e: MessageEvent, registry: MutableRefObject<WsCallbackRegistry>) => {
        const json = JSON.parse(e.data)
        console.debug('<WSS> Received', json)

        const resolver = registry.current[json.id]
        resolver?.(json.result)
        delete registry.current[json.id]
    },
}

export function getWsEventHandler(
    onWsOpen: (ws: WebSocket) => void,
    onMessage: (
        e: MessageEvent,
        registry: MutableRefObject<WsCallbackRegistry>,
        json
    ) => void,
    registry: MutableRefObject<WsCallbackRegistry>
) {
    return (e: Event) => {
        switch (e.type) {
            case 'open':
                console.log('<WSS> Connection open.', e)
                onWsOpen(e.target as WebSocket)
                break
            case 'message':
                const msgEvt = e as MessageEvent
                onMessage(msgEvt, registry, JSON.parse(msgEvt.data))
                break
        }
    }
}
