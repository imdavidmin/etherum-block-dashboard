import { useContext, useEffect, useState } from 'react'
import { DataProvider } from '../context'
import { InfuraApiMethod, getRequestPayload } from '../constants'

export type BlockCardProps = {
    blockNumber: string
    patches?: Array<any>
}
export function BlockCard(props: Readonly<BlockCardProps>) {
    const [blockData, setBlockData] = useState<Block>()
    const [page, setPage] = useState(0)
    const wsFetch = useContext(DataProvider)
    useEffect(() => {
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
        <div className="block-card grid">
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
                <span>mined</span>
            </div>
            <div className="block-grid grid">
                {blockData &&
                    blockData.transactions
                        .slice(page * 100, (page + 1) * 100)
                        .map((tx) => <div className="tx-square"></div>)}
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
