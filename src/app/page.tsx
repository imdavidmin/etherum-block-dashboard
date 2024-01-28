'use client'
import './page.scss'

import React, { MutableRefObject, useRef, useState } from 'react'
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
import { getHandleWsEvent } from './utils/getHandleWsEvent'

dayjs.extend(relativeTime)

export default function Page() {
    const cbRegistry = useRef<WsCallbackRegistry>({})
    const subscriptionRegistry = useRef<WsCallbackRegistry>([])
    const [ws, setWs] = useState<WebSocket>(establishWsApiConnection())
    const [pendingTxs, setPendingTxs] = useState([])

    const { promise, resolve } = PromiseWithResolvers<typeof ws>()
    const wsFetch = getWsFetch(promise, cbRegistry.current)

    const subscriptionPayload = getRequestPayload(InfuraApiMethod.Subscribe, [
        'newPendingTransactions',
    ])
    subscriptionRegistry.current[subscriptionPayload.id] =
        handleNewPendingTransaction

    return (
        <DataProviderContext.Provider value={wsFetch}>
            <Sidebar />
            <div>
                <KeyStats />
                <CardGrid />
            </div>
        </DataProviderContext.Provider>
    )

    function establishWsApiConnection() {
        return startWsConnection(
            getHandleWsEvent(
                (openWs) => {
                    document.dispatchEvent(new Event('load'))
                    openWs.send(JSON.stringify(subscriptionPayload))
                    resolve(openWs)
                },
                subscriptionRegistry,
                cbRegistry
            )
        )
    }
}

function handleNewPendingTransaction(v) {
    if (v.params.result) {
    }
}
