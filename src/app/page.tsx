'use client'
import './page.scss'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { DataProviderContext, NetworkUpdatesContext } from './context'
import { KeyStats } from './components/KeyStats'
import { Sidebar } from './components/Sidebar'
import {
    InfuraApiMethod,
    getRequestPayload,
    startWsConnection,
} from './constants'
import { PromiseWithResolvers, WsCallbackRegistry } from './utils'
import { getWsFetch } from './utils/getWsFetch'
import { CardGrid } from './components/CardGrid'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
    getWsEventHandler,
    messageEventHandlers,
} from './utils/getHandleWsEvent'

dayjs.extend(relativeTime)

const ws = startWsConnection()
const subscriptionWs = startWsConnection()
const WS_EVENTS = ['open', 'close', 'error', 'message']

export default function Page() {
    const cbRegistry = useRef<WsCallbackRegistry>({})
    const subscriptionRegistry = useRef<WsCallbackRegistry>([])
    const [pendingTxs, setPendingTxs] = useState([])

    const { promise, resolve } = PromiseWithResolvers<typeof ws>()
    const wsFetch = useRef(getWsFetch(promise, cbRegistry.current))

    useEffect(() => {
        attachWsApiListeners()
        attachPendingTransactionListeners()
    }, [])

    const networkUpdates = useMemo(
        () => ({ state: pendingTxs, set: setPendingTxs }),
        [pendingTxs]
    )

    return (
        <DataProviderContext.Provider value={wsFetch.current}>
            <div className="app-container">
                <Sidebar />
                <div className="grid app-content-container">
                    <KeyStats />
                    <NetworkUpdatesContext.Provider value={networkUpdates}>
                        <CardGrid />
                    </NetworkUpdatesContext.Provider>
                </div>
            </div>
        </DataProviderContext.Provider>
    )

    function attachWsApiListeners() {
        const handler = getWsEventHandler(
            (openWs) => {
                document.dispatchEvent(new Event('load'))
                resolve(openWs)
            },
            messageEventHandlers.api,
            cbRegistry
        )
        WS_EVENTS.forEach((evtName) => ws.addEventListener(evtName, handler))
    }

    function attachPendingTransactionListeners() {
        const handler = getWsEventHandler(
            beginSubscription,
            messageEventHandlers.subscription,
            subscriptionRegistry
        )

        WS_EVENTS.forEach((evtName) =>
            subscriptionWs.addEventListener(evtName, handler)
        )

        function beginSubscription(openWs: WebSocket) {
            const subscriptionPayload = getRequestPayload(
                InfuraApiMethod.Subscribe,
                ['newPendingTransactions']
            )
            subscriptionRegistry.current[subscriptionPayload.id] =
                handleNewPendingTransaction
            openWs.send(JSON.stringify(subscriptionPayload))
        }
    }

    function handleNewPendingTransaction(v) {
        setPendingTxs((prev) => [...prev, v])
    }
}
