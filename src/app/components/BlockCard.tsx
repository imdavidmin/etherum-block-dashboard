import { useContext, useEffect, useRef, useState } from 'react'
import { CardGridContext, DataProviderContext } from '../context'
import { InfuraApiMethod, getRequestPayload } from '../constants'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Shimmer } from './Shimmer'
import { Tooltip } from './Tooltip'

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
            <CardHeader data={blockData} />

            <div className="block-grid grid">
                {blockData?.transactions
                    .slice(page * 100, (page + 1) * 100)
                    .map((tx) => (
                        <TxSquare key={tx.transactionIndex} tx={tx} />
                    ))}
            </div>
            <div className="paginator">
                <PageIndicator
                    page={page}
                    maxPage={maxPage}
                    txCount={txCount}
                />
                <PageNavigator
                    page={page}
                    maxPage={maxPage}
                    setPage={setPage}
                />
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

function TxSquare(props: { tx: Transaction }) {
    const [isHover, setIsHover] = useState(false)
    const ref = useRef<HTMLDivElement>()

    useEffect(() => {
        ref.current.addEventListener('mouseenter', () => setIsHover(true))
        ref.current.addEventListener('mouseleave', () => setIsHover(false))
    }, [])

    return (
        <div className="tx-square" ref={ref}>
            {isHover && (
                <Tooltip
                    from={props.tx.from}
                    to={props.tx.to}
                    value={Number.parseInt(props.tx.value, 16) / 10 ** 18}
                    target={ref.current}
                />
            )}
        </div>
    )
}

function CardHeader(props: { data: Block }) {
    if (!props.data)
        return (
            <div className="header-bar">
                <div>
                    <Shimmer width="40%" />
                    <Shimmer width="15%" />
                </div>
                <span>
                    <Shimmer width="20%" />
                </span>
            </div>
        )

    const blockNumberInDecimal = Number.parseInt(
        props.data.number,
        16
    )?.toLocaleString()

    return (
        <div className="header-bar">
            <div>
                <span>#{blockNumberInDecimal}</span>
                <span>{props.data.transactions.length ?? ''} TXs</span>
            </div>
            <span>
                {'mined '}
                {dayjs().to(
                    dayjs(Number.parseInt(props.data.timestamp) * 1000)
                )}
            </span>
        </div>
    )
}
function PageNavigator(
    props: Readonly<{
        page: number
        maxPage: number
        setPage: (v: number) => void
    }>
) {
    const { page, maxPage, setPage } = props
    return (
        <div>
            {page != 0 && (
                <button onClick={() => setPage(page - 1)}>&#9204;</button>
            )}
            {page < maxPage && (
                <button onClick={() => setPage(page + 1)}>&#9205;</button>
            )}
        </div>
    )
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
