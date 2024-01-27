export const API_REST_ENDPOINT = `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
export const API_WS_ENDPOINT = `wss://mainnet.infura.io/ws/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`

export enum InfuraApiMethod {
    BlockNumber = 'eth_blockNumber',
    GetBlockByNumber = 'eth_getBlockByNumber',
}

export type RequestPayload = ReturnType<typeof getRequestPayload>
export const getRequestPayload = (method: InfuraApiMethod, args?) => ({
    jsonrpc: '2.0',
    method,
    id: Math.floor(Math.random() * 10 ** 9),
    params: args ?? [],
})

export const InfuraApi = {
    eth: {
        blockNumber() {
            return postToInfura(getRequestPayload(InfuraApiMethod.BlockNumber))
        },
        getBlockByNumber(blockNumberInHex: string, details?: boolean) {
            return postToInfura(
                getRequestPayload(InfuraApiMethod.GetBlockByNumber, [
                    blockNumberInHex,
                    details,
                ])
            )
        },
    },
}

type RequestResponse =
    | { error: boolean; errorDetail: any }
    | { response: Response; data: Record<string, any> }

async function postToInfura(body: string): Promise<RequestResponse> {
    try {
        const response = await fetch(API_REST_ENDPOINT, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body,
        })
        if (
            response.ok &&
            response.headers.get('content-type') == 'application/json'
        ) {
            return {
                response: response,
                data: await response.json(),
            }
        } else {
            throw new Error(
                `Status: ${
                    response.status
                }; Response type: ${response.headers.get('content-type')}`
            )
        }
    } catch (e) {
        return { error: true, errorDetail: e }
    }
}

export function startWsConnection(listener: (e: Event) => void) {
    const ws = new WebSocket(API_WS_ENDPOINT)
    const wsEvents = ['open', 'close', 'error', 'message']
    wsEvents.forEach((evtName) => ws.addEventListener(evtName, listener))
    return ws
}
