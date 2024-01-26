export type BlockCardProps = {
    timestamp: number
    blockId: number
    txs: Array<any>
}
export function BlockCard(props: Readonly<BlockCardProps>) {
    return (
        <div className="block-card grid">
            <div className="header-bar">
                <div>
                    <span>#{props.blockId?.toLocaleString()}</span>
                    <span>{props.txs.length} TXs</span>
                </div>
                <span>mined</span>
            </div>
            <div className="block-grid grid">
                {props.txs.map((el) => (
                    <div className="tx-square"></div>
                ))}
            </div>
            <div className="paginator">
                <span>{6} more TX</span>
                <div>
                    <button>&#9204;</button>
                    <button>&#9205;</button>
                </div>
            </div>
        </div>
    )
}
