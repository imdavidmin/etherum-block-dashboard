'use client'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { CardGridContext, DataProviderContext } from './context'
import { BlockCard } from './components/BlockCard'
import { InfuraApiMethod, getRequestPayload } from './constants'
import { hexToDec } from './utils'

export function CardGrid() {
    const PAGE_SIZE = 10
    const wsFetch = useContext(DataProviderContext)
    const [firstBlockToDisplay, setFirstBlockToDisplay] = useState<string>()
    const [blocksDisplayed, setBlocksDisplayed] = useState(new Array(10))
    const ref = useRef<HTMLDivElement>()

    useEffect(() => {
        if (firstBlockToDisplay) {
            const blockHexNumbers = []

            for (let i = 0; i < PAGE_SIZE; i++) {
                blockHexNumbers.push(
                    '0x' + (hexToDec(firstBlockToDisplay) - i).toString(16)
                )
            }
            setBlocksDisplayed(blockHexNumbers)
        } else {
            wsFetch(getRequestPayload(InfuraApiMethod.BlockNumber)).then((v) =>
                setFirstBlockToDisplay(v)
            )
        }
    }, [firstBlockToDisplay])

    return (
        <CardGridContext.Provider value={ref.current}>
            <div className="grid card-grid" ref={ref}>
                {blocksDisplayed.map((blockHexNumber) => (
                    <BlockCard
                        key={blockHexNumber}
                        blockNumber={blockHexNumber}
                    />
                ))}
            </div>
        </CardGridContext.Provider>
    )
}
