'use client'
import './page.scss'

import React, { ReactElement, useRef } from 'react'
import { DataProviderContext } from './context'
import { KeyStats } from './KeyStats'
import { Sidebar } from './Sidebar'
import { startWsConnection } from './constants'
import { PromiseWithResolvers, WsCallbackRegistry, getWsFetch } from './utils'
import { CardGrid } from './CardGrid'

export default function Page() {
    const { promise, resolve } = PromiseWithResolvers<typeof ws.current>()

    const ws = useRef(startWsConnection(handleWsEvent))
    const cbRegistry = useRef<WsCallbackRegistry>({})

    return (
        <DataProviderContext.Provider
            value={getWsFetch(promise, cbRegistry.current)}
        >
            <Sidebar />
            <div>
                <KeyStats />
                <CardGrid />
            </div>
        </DataProviderContext.Provider>
    )

    function handleWsEvent(e: Event) {
        switch (e.type) {
            case 'open':
                resolve(ws.current)
                break
            case 'message': {
                const msgEvt = e as MessageEvent
                const json = JSON.parse(msgEvt.data)
                console.log('<WSS> Received', json)
                cbRegistry.current[json.id](json.result)
                delete cbRegistry.current[json.id]
            }
        }
    }
}

type IconButtonProps = { icon: ReactElement; label: string }
export function IconButton(props: Readonly<IconButtonProps>) {
    return (
        <button className="icon-button">
            {props.icon}
            <span>{props.label}</span>
        </button>
    )
}
