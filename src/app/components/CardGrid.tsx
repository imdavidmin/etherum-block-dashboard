'use client'
import './CardGrid.scss'

import React, { useContext, useEffect, useRef, useState } from 'react'
import {
    CardGridContext,
    DataProviderContext,
    FiatPricingContext,
} from '../context'
import { BlockCard } from './BlockCard'
import {
    InfuraApiMethod,
    PRICING_ENDPOINT,
    getRequestPayload,
} from '../constants'
import { hexToDec } from '../utils'
import { NewBlocksCard } from './NewBlocksCard'

export function CardGrid() {
    const PAGE_SIZE = 10
    const wsFetch = useContext(DataProviderContext)
    const [initialBlockNumber, setInitialBlockNumber] = useState<string>()
    const [blocksDisplayed, setBlocksDisplayed] = useState(new Array(10))
    const [addBlockWork, setAddBlockWork] = useState(false)
    const ref = useRef<HTMLDivElement>()

    const [ethUsd, setEthUsd] = useState<number>()

    useEffect(() => {
        getEthUsd().then((v) => setEthUsd(v))
    }, [])

    useEffect(() => {
        if (!addBlockWork) return

        const lastBlockHex = blocksDisplayed[blocksDisplayed.length - 1]
        const lastBlockDec = Number.parseInt(lastBlockHex, 16)
        const newBlocksDisplayed = [...blocksDisplayed]
        for (let i = 1; i <= PAGE_SIZE; i++) {
            newBlocksDisplayed.push('0x' + (lastBlockDec - i).toString(16))
        }
        setBlocksDisplayed(newBlocksDisplayed)
        setAddBlockWork(false)
    }, [addBlockWork])

    useEffect(() => {
        initialBlockNumber ? populateFirst10Blocks() : getLatestBlockNumber()
    }, [initialBlockNumber])

    return (
        <CardGridContext.Provider value={ref.current}>
            <FiatPricingContext.Provider value={ethUsd}>
                <div className="grid card-grid" ref={ref}>
                    <NewBlocksCard
                        displayedLatest={blocksDisplayed[0]}
                        loadNewBlocks={loadNewBlocks}
                    />
                    {blocksDisplayed.map((blockHexNumber) => (
                        <BlockCard
                            key={blockHexNumber}
                            blockNumber={blockHexNumber}
                        />
                    ))}
                </div>
                <div className="grid-footer">
                    <button onClick={() => setAddBlockWork(true)}>
                        Load more
                    </button>
                </div>
            </FiatPricingContext.Provider>
        </CardGridContext.Provider>
    )
    function loadNewBlocks(blocks: Array<string>) {
        setBlocksDisplayed(
            Array.from(new Set([...blocks, ...blocksDisplayed])).toSorted(
                (a, b) => b - a
            )
        )
    }

    function populateFirst10Blocks() {
        const blockHexNumbers = []
        for (let i = 0; i < PAGE_SIZE; i++) {
            blockHexNumbers.push(
                '0x' + (hexToDec(initialBlockNumber) - i).toString(16)
            )
        }

        setBlocksDisplayed(blockHexNumbers)
    }
    async function getLatestBlockNumber() {
        const json = await wsFetch(
            getRequestPayload(InfuraApiMethod.BlockNumber)
        )
        setInitialBlockNumber(json.result)
    }
}

async function getEthUsd() {
    const response = await fetch(PRICING_ENDPOINT)
    if (response.ok) {
        const json = await response.json()
        return json.ethereum.usd
    } else {
        throw new Error('Cannot get ETHUSD pricing data')
    }
}
