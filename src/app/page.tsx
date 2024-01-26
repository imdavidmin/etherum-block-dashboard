'use client'
import './page.scss'

import React, { ReactElement, useContext } from 'react'
import { DataProvider } from './context'
import { KeyStats } from './KeyStats'
import { Sidebar } from './Sidebar'
import { BlockCard } from './components/BlockCard'

export default function Page() {
    return (
        <DataProvider.Provider value={null}>
            <Sidebar />
            <Dashboard />
        </DataProvider.Provider>
    )
}
function Dashboard() {
    return (
        <div>
            <KeyStats />
            <BlockVisualisation />
        </div>
    )
}

function BlockVisualisation() {
    const context = useContext(DataProvider)
    const data = new Array(5).fill('abc')
    return (
        <div className="grid block-visualisation">
            <BlockCard blockId={139813} timestamp={Date.now()} txs={data} />
            <BlockCard blockId={139813} timestamp={Date.now()} txs={data} />
            <BlockCard blockId={139813} timestamp={Date.now()} txs={data} />
            <BlockCard blockId={139813} timestamp={Date.now()} txs={data} />
            <BlockCard
                blockId={139813}
                timestamp={Date.now()}
                txs={data}
            />{' '}
            <BlockCard blockId={139813} timestamp={Date.now()} txs={data} />
            <BlockCard blockId={139813} timestamp={Date.now()} txs={data} />
            <BlockCard blockId={139813} timestamp={Date.now()} txs={data} />
            <BlockCard blockId={139813} timestamp={Date.now()} txs={data} />
            <BlockCard blockId={139813} timestamp={Date.now()} txs={data} />
        </div>
    )
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
