export function Shimmer(props: Readonly<{ width?: string; height?: string }>) {
    return (
        <div
            className="shimmer"
            style={{
                width: props.width ?? '100%',
                height: props.height ?? '1rem',
            }}
        ></div>
    )
}
