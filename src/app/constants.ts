export const API_REST_ENDPOINT = `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
export const API_WS_ENDPOINT = `wss://mainnet.infura.io/ws/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
export const PRICING_ENDPOINT =
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'

export enum InfuraApiMethod {
    BlockNumber = 'eth_blockNumber',
    GetBlockByNumber = 'eth_getBlockByNumber',
    Subscribe = 'eth_subscribe',
}

export type RequestPayload = ReturnType<typeof getRequestPayload>
export const getRequestPayload = (method: InfuraApiMethod, args?) => ({
    jsonrpc: '2.0',
    method,
    id: Math.floor(Math.random() * 10 ** 9),
    params: args ?? [],
})

export function startWsConnection() {
    const ws = new WebSocket(API_WS_ENDPOINT)
    return ws
}
