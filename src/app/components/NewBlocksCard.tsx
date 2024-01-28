'use client'

import './NewBlocksCard.scss'
import React, { useContext, useEffect, useState } from 'react'
import { DataProviderContext, NetworkUpdatesContext } from '../context'
import { InfuraApiMethod, getRequestPayload } from '../constants'

export function NewBlocksCard(props: {
    displayedLatest: string
    loadNewBlocks: (blocks: Array<string>) => void
}) {
    const [latestBlockNumber, setLatestBlockNumber] = useState(
        props.displayedLatest
    )
    const wsFetch = useContext(DataProviderContext)
    const context = useContext(NetworkUpdatesContext)

    const latestDec = Number.parseInt(latestBlockNumber, 16)
    const lastDisplayedDec = Number.parseInt(props.displayedLatest, 16)
    const newBlocksCount = latestDec - lastDisplayedDec

    useEffect(() => {
        setInterval(async () => {
            const response = await wsFetch(
                getRequestPayload(InfuraApiMethod.BlockNumber)
            )
            setLatestBlockNumber(response)
        }, 12000)
    }, [])

    return (
        <div className="block-card new">
            <div className="grid">
                <span>New pending transactions</span>
                <span>{context.state.length}</span>
                <span>New blocks</span>
                <span>{Number.isNaN(newBlocksCount) ? 0 : newBlocksCount}</span>
                {newBlocksCount > 0 && (
                    <button onClick={addLatestBlocks}>Load new blocks</button>
                )}
            </div>
        </div>
    )

    function addLatestBlocks() {
        const newBlockHex = []
        for (let i = 0; i < newBlocksCount; i++) {
            newBlockHex.push('0x' + (latestDec - i).toString(16))
        }
        props.loadNewBlocks(newBlockHex)
    }
}
