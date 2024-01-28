export function PageNavigator(
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
export function PageIndicator(
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
