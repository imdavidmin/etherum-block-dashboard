import { useEffect, useRef, useState } from 'react'
import { Tooltip } from '../Tooltip'

export function TxSquare(props: { tx?: Transaction }) {
    const [isHover, setIsHover] = useState(false)
    const ref = useRef<HTMLDivElement>()

    useEffect(() => {
        ref.current.addEventListener('mouseenter', () => setIsHover(true))
        ref.current.addEventListener('mouseleave', () => setIsHover(false))
    }, [])

    const classNames = ['tx-square']
    Number.parseInt(props.tx.value, 16) > 0 && classNames.push('confirmed')

    return (
        <div className={classNames.join(' ')} ref={ref}>
            {isHover && props.tx.hash && (
                <Tooltip
                    from={props.tx.from}
                    to={props.tx.to}
                    value={Number.parseInt(props.tx.value, 16) / 10 ** 18}
                />
            )}
        </div>
    )
}
