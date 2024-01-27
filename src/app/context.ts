import { createContext } from 'react'
import { RequestPayload } from './constants'

export const DataProviderContext = createContext<
    (p: RequestPayload) => Promise<any>
>(async () => {})
export const CardGridContext = createContext<HTMLDivElement>(null)
