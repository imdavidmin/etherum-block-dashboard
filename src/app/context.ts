import { createContext } from 'react'
import { RequestPayload } from './constants'

export const DataProvider = createContext<(p: RequestPayload) => Promise<any>>(
    async () => {}
)
