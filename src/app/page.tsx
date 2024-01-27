'use client'
import './page.scss'

import React, {
    ReactElement,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'
import { CardGridContext, DataProviderContext } from './context'
import { KeyStats } from './KeyStats'
import { Sidebar } from './Sidebar'
import { BlockCard } from './components/BlockCard'
import {
    InfuraApi,
    InfuraApiMethod,
    RequestPayload,
    getRequestPayload,
    startWsConnection,
} from './constants'
import {
    PromiseWithResolvers,
    WsCallbackRegistry,
    getWsFetch,
    hexToDec,
} from './utils'

export default function Page() {
    const { promise, resolve, reject } =
        PromiseWithResolvers<typeof ws.current>()

    const ws = useRef(startWsConnection(handleWsEvent))
    const cbRegistry = useRef<WsCallbackRegistry>({})

    return (
        <DataProviderContext.Provider
            value={getWsFetch(promise, cbRegistry.current)}
        >
            <Sidebar />
            <Dashboard />
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
function Dashboard() {
    return (
        <div>
            <KeyStats />
            <CardGrid />
        </div>
    )
}

function CardGrid() {
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

type IconButtonProps = { icon: ReactElement; label: string }
export function IconButton(props: Readonly<IconButtonProps>) {
    return (
        <button className="icon-button">
            {props.icon}
            <span>{props.label}</span>
        </button>
    )
}
