export const metadata = {
    title: 'Infura Block Explorer',
    description: 'Take home by David Min',
}

export default function RootLayout(
    props: Readonly<{ children: React.ReactNode }>
) {
    return (
        <html lang="en">
            <head>
                <link
                    href="https://db.onlinewebfonts.com/c/04d4dc4689c5228f0b3a5d6ca4cb546a?family=AkkuratStd"
                    rel="stylesheet"
                    type="text/css"
                />
            </head>

            <body>{props.children}</body>
        </html>
    )
}
