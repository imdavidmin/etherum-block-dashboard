import './Tooltip.scss'

import { useContext } from 'react'
import { FiatPricingContext } from '../context'

export type TooltipProps = {
    from: string
    to: string
    value: number
    target: HTMLElement
}

export function Tooltip(props: Readonly<TooltipProps>) {
    const ethUsd = useContext(FiatPricingContext)
    console.log(ethUsd)

    const getFormattedUSDString = (v: number) =>
        v.toLocaleString(undefined, {
            style: 'currency',
            currency: 'USD',
            currencyDisplay: 'narrowSymbol',
        })

    return (
        <div className="tooltip-container">
            <div className="tooltip-pointer"></div>
            <div className="content-container">
                <div>
                    <TooltipField
                        title="From"
                        value={truncateAddress(props.from)}
                    />
                    <TooltipField
                        title="To"
                        value={truncateAddress(props.to)}
                    />
                </div>
                <div>
                    <TooltipField
                        title="Value"
                        value={
                            props.value.toLocaleString(undefined, {
                                maximumFractionDigits: 3,
                            }) + ' ETH'
                        }
                    />
                    {ethUsd && (
                        <div className="fiat-value">
                            {getFormattedUSDString(props.value * ethUsd)}
                            {' @ '}
                            {getFormattedUSDString(ethUsd)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

    function truncateAddress(addr: string) {
        return (
            addr.slice(0, 6) + '....' + addr.slice(addr.length - 4, addr.length)
        )
    }

    // function getOffsetStyle(): CSSProperties {
    //     const x = props.target.offsetLeft
    //     const y = props.target.offsetTop

    //     return { transform: `translate(${x}px, ${y}px)` }
    // }
}

function TooltipField(props: Readonly<{ title: string; value: string }>) {
    return (
        <div className="tooltip-field">
            <span>{props.title}</span>
            <span>{props.value}</span>
        </div>
    )
}
