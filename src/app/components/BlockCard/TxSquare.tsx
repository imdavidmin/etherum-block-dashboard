import { useEffect, useRef, useState } from 'react'
import { Tooltip } from '../Tooltip'

export function TxSquare(props: { tx: Transaction }) {
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
                />
            )}
        </div>
    )
}
