'use client'
import { propagateServerField } from 'next/dist/server/lib/render-server'
import { ICONS } from './components/icons'
import './page.scss'

import React, { ReactElement, createContext, useState } from 'react'

const DataProvider = createContext({})

export default function Page() {
    return (
        <DataProvider.Provider value={null}>
            <Sidebar />
            <Dashboard />
        </DataProvider.Provider>
    )
}
function Sidebar() {
    const USER_BUTTONS: Array<string> = ['dashboard', 'projects', 'explorer']
    const APP_BUTTONS: Array<string> = ['settings', 'logout']
    return (
        <div className="sidebar grid">
            <button className="home-button">{ICONS.infura}</button>
            <div>{getButtons(USER_BUTTONS)}</div>
            <div>{getButtons(APP_BUTTONS)}</div>
        </div>
    )

    function getButtons(labels: Array<string>) {
        return labels.map((buttonLabel) => (
            <IconButton
                key={buttonLabel}
                icon={ICONS[buttonLabel] ?? <span>?</span>}
                label={buttonLabel}
            />
        ))
    }
}

function Dashboard() {
    return (
        <div>
            <KeyStats />
            <BlockVisualisation />
        </div>
    )
}

function KeyStats() {
    const [data, setData] = useState({
        currentBlock: 8243132,
        avgGasPrice: 87,
        avgBlockSize: 8.2,
        avgBlockFullness: 0.88,
    })

    const STAT_CONFIG = {
        currentBlock: {
            label: 'Current Block',
            formatter: (v: number) => v.toLocaleString(),
        },
        avgGasPrice: {
            label: 'Average Gas Price',
            formatter: (v: number) => v.toLocaleString(),
            unit: 'gwei',
        },
        avgBlockSize: {
            label: 'Average Block Size',
            formatter: (v: number) => v.toLocaleString(),
            unit: 'mgas',
        },
        avgBlockFullness: {
            label: 'Average Block Fullness',
            formatter: (v: number) =>
                v.toLocaleString(undefined, { style: 'percent' }),
        },
    }

    const stats = Object.entries(data).map(([key, value]) => {
        const formatter = STAT_CONFIG[key]?.formatter ?? ((v) => v)
        return (
            <>
                <span className="title-label">{STAT_CONFIG[key]?.label}</span>
                <div>
                    <span className="stat-value">{formatter(value)}</span>
                    <span className="stat-unit">{STAT_CONFIG[key]?.unit}</span>
                </div>
            </>
        )
    })
    return (
        <div className="key-stats-container">
            <div className="grid">{stats}</div>
        </div>
    )
}

function BlockVisualisation() {
    return <div></div>
}

type IconButtonProps = { icon: ReactElement; label: string }
function IconButton(props: Readonly<IconButtonProps>) {
    return (
        <button className="icon-button">
            {props.icon}
            <span>{props.label}</span>
        </button>
    )
}
