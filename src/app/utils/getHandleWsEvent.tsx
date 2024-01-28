'use client'

import { MutableRefObject } from 'react'
import { WsCallbackRegistry } from '.'

export function getHandleWsEvent(
    resolver: (ws: WebSocket) => void,
    subscriptionRegistry: MutableRefObject<WsCallbackRegistry>,
    cbRegistry: MutableRefObject<WsCallbackRegistry>
) {
    return (e: Event) => {
        switch (e.type) {
            case 'open':
                resolver(e.target as WebSocket)
                console.log('<WSS> Connection open.', e)
                break
            case 'message': {
                const msgEvt = e as MessageEvent
                const json = JSON.parse(msgEvt.data)

                if (json.method == 'eth_subscription') {
                    const subscriptionId = json.params.subscription
                    const handler = subscriptionRegistry.current[subscriptionId]
                    handler(json)
                } else {
                    const subscriptionRequest =
                        subscriptionRegistry.current[json.id]

                    if (subscriptionRequest) {
                        console.log('<WSS> Subscription succeeded.', json)
                        subscriptionRegistry.current[json.result] =
                            subscriptionRequest
                    } else {
                        console.log('<WSS> Received', json)
                        const resolver = cbRegistry.current[json.id]
                        if (!resolver) {
                            console.log(json)
                            return
                        }
                        resolver(json.result)
                        delete cbRegistry.current[json.id]
                    }
                }
                break
            }
        }
    }
}
