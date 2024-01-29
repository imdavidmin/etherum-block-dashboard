'use client'
import React, { Fragment, useState } from 'react'

export function KeyStats() {
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
            <Fragment key={key}>
                <span className="title-label">{STAT_CONFIG[key]?.label}</span>
                <div>
                    <span className="stat-value">{formatter(value)}</span>
                    <span className="stat-unit">{STAT_CONFIG[key]?.unit}</span>
                </div>
            </Fragment>
        )
    })
    return (
        <div className="key-stats-container">
            <div className="grid">{stats}</div>
        </div>
    )
}
