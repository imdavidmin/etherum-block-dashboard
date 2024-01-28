import { useContext, useEffect, useRef, useState } from 'react'
import { CardGridContext, DataProviderContext } from '../../context'
import { InfuraApiMethod, getRequestPayload } from '../../constants'
import { TxSquare } from './TxSquare'
import { CardHeader } from './CardHeader'
import { PageIndicator, PageNavigator } from './CardFooter'

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

    const txToMap =
        blockData?.transactions?.slice(page * 100, (page + 1) * 100) ?? []
    if (txToMap.length == 0) {
        for (let i = 0; i < 25; i++) {
            txToMap.push({ transactionIndex: `${i}` } as Transaction)
        }
    }

    return (
        <div className="block-card grid" ref={ref}>
            <CardHeader data={blockData} />

            <div className="block-grid grid">
                {txToMap.map((tx) => (
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
