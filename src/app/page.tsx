'use client'
import './page.scss'

import React, { useRef } from 'react'
import { DataProviderContext } from './context'
import { KeyStats } from './components/KeyStats'
import { Sidebar } from './components/Sidebar'
import {
    InfuraApiMethod,
    getRequestPayload,
    startWsConnection,
} from './constants'
import { PromiseWithResolvers, WsCallbackRegistry, getWsFetch } from './utils'
import { CardGrid } from './components/CardGrid'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default function Page() {
    const cbRegistry = useRef<WsCallbackRegistry>({})
    const subscriptionRegistry = useRef<
        Array<{ id: number; handler: (v) => void }>
    >([])
    const { promise, resolve } = PromiseWithResolvers<typeof ws.current>()

    const ws = useRef<WebSocket>()
    ws.current = startWsConnection(
        getHandleWsEvent(
            () => resolve(ws.current),
            subscriptionRegistry,
            cbRegistry
        )
    )
    const wsFetch = getWsFetch(promise, cbRegistry.current)

    subscribeToNewPendingTransactions()

    return (
        <DataProviderContext.Provider value={wsFetch}>
            <Sidebar />
            <div>
                <KeyStats />
                <CardGrid />
            </div>
        </DataProviderContext.Provider>
    )

    function subscribeToNewPendingTransactions() {
        const subscriptionPayload = getRequestPayload(
            InfuraApiMethod.Subscribe,
            ['newPendingTransactions']
        )
        subscriptionRegistry.current.push({
            id: subscriptionPayload.id,
            handler: handleNewPendingTransaction,
        })
        ws.current.addEventListener('open', (e) => {
            ws.current.send(JSON.stringify(subscriptionPayload))
        })
    }
}

function handleNewPendingTransaction(v) {
    console.log('Received new transaction')
    if (v.params.result) {
    }
}

function getHandleWsEvent(resolver, subscriptionRegistry, cbRegistry) {
    return (e: Event) => {
        switch (e.type) {
            case 'open':
                resolver()
                break
            case 'message': {
                const msgEvt = e as MessageEvent
                const json = JSON.parse(msgEvt.data)

                if (json.method == 'eth_subscription') {
                    const subscription = subscriptionRegistry.current.find(
                        (entry) => entry.id == json.params.subscription
                    )
                    subscription.handler(json)
                } else {
                    const subscription = subscriptionRegistry.current.find(
                        (entry) => entry.id == json.id
                    )
                    if (subscription) {
                        console.log('<WSS> Subscription succeeded.', json)
                        subscription.id = json.result
                    } else {
                        console.log('<WSS> Received', json)
                        const resolver = cbRegistry.current[json.id]
                        resolver(json.result)
                        delete cbRegistry.current[json.id]
                    }
                }
                break
            }
        }
    }
}
