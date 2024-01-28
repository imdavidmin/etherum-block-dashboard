'use client'
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
    const [initialBlockNumber, setFirstBlockToDisplay] = useState<string>()
    const [blocksDisplayed, setBlocksDisplayed] = useState(new Array(10))
    const ref = useRef<HTMLDivElement>()

    const [ethUsd, setEthUsd] = useState<number>()

    useEffect(() => {
        getEthUsd().then((v) => setEthUsd(v))

        async function getEthUsd() {
            const response = await fetch(PRICING_ENDPOINT)
            if (response.ok) {
                const json = await response.json()
                return json.ethereum.usd
            } else {
                throw new Error('Cannot get ETHUSD pricing data')
            }
        }
    }, [])

    useEffect(() => {
        if (initialBlockNumber) {
            const blockHexNumbers = []

            for (let i = 0; i < PAGE_SIZE; i++) {
                blockHexNumbers.push(
                    '0x' + (hexToDec(initialBlockNumber) - i).toString(16)
                )
            }
            setBlocksDisplayed(blockHexNumbers)
        } else {
            wsFetch(getRequestPayload(InfuraApiMethod.BlockNumber)).then((v) =>
                setFirstBlockToDisplay(v)
            )
        }
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
}
