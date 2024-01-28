import dayjs from 'dayjs'
import { Shimmer } from '../Shimmer'

export function CardHeader(props: { data: Block }) {
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
