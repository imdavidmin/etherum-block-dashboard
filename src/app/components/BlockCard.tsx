import { useContext, useEffect, useRef, useState } from 'react'
import { CardGridContext, DataProviderContext } from '../context'
import { InfuraApiMethod, getRequestPayload } from '../constants'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export type BlockCardProps = {
    blockNumber: string
    patches?: Array<any>
}
export function BlockCard(props: Readonly<BlockCardProps>) {
    const [blockData, setBlockData] = useState<Block>()
    const [page, setPage] = useState(0)
    const ref = useRef<HTMLDivElement>()
    const cardGrid = useContext(CardGridContext)

    const wsFetch = useContext(DataProviderContext)
    useEffect(() => {
        attachMouseListener()
        wsFetch(
            getRequestPayload(InfuraApiMethod.GetBlockByNumber, [
                props.blockNumber,
                true,
            ])
        ).then((result) => setBlockData(result))
    }, [])

    const txCount = blockData?.transactions?.length
    const maxPage = txCount != null ? Math.floor(txCount / 100) : 0
    return (
        <div className="block-card grid" ref={ref}>
            <div className="header-bar">
                <div>
                    <span>
                        #
                        {Number.parseInt(
                            props.blockNumber,
                            16
                        )?.toLocaleString()}
                    </span>
                    <span>{txCount ?? ''} TXs</span>
                </div>
                <span>
                    mined{' '}
                    {dayjs().to(
                        dayjs(Number.parseInt(blockData?.timestamp) * 1000)
                    )}
                </span>
            </div>
            <div className="block-grid grid">
                {blockData?.transactions
                    .slice(page * 100, (page + 1) * 100)
                    .map((tx) => (
                        <div
                            className="tx-square"
                            key={tx.transactionIndex}
                        ></div>
                    ))}
            </div>
            <div className="paginator">
                <PageIndicator
                    page={page}
                    maxPage={maxPage}
                    txCount={txCount}
                />
                <div>
                    {page != 0 && (
                        <button onClick={() => setPage(page - 1)}>
                            &#9204;
                        </button>
                    )}
                    {page < maxPage && (
                        <button onClick={() => setPage(page + 1)}>
                            &#9205;
                        </button>
                    )}
                </div>
            </div>
        </div>
    )

    function attachMouseListener() {
        ref.current.addEventListener('mouseenter', () => {
            ref.current.classList.add('has-hover')
            cardGrid.classList.add('has-card-in-focus')
        })
        ref.current.addEventListener('mouseleave', () => {
            ref.current.classList.remove('has-hover')
            cardGrid.classList.remove('has-card-in-focus')
        })
    }
}

function PageIndicator(
    props: Readonly<{
        page: number
        maxPage: number
        txCount: number
    }>
) {
    if (!props.txCount || props.txCount <= 100) return <span></span>

    return props.page == 0 ? (
        <span>{props.txCount - 100} more TX</span>
    ) : (
        <span>
            Page {props.page + 1} of {props.maxPage + 1}{' '}
        </span>
    )
}
