import { createContext } from 'react'
import { RequestPayload } from './constants'

export const DataProviderContext = createContext<
    (p: RequestPayload) => Promise<any>
>(async () => {})
export const FiatPricingContext = createContext<number>(null)
export const CardGridContext = createContext<HTMLDivElement>(null)
export const NetworkUpdatesContext = createContext({
    state: null,
    set: (v) => {},
})

DataProviderContext.displayName = 'DataProviderContext'
FiatPricingContext.displayName = 'FiatPricingContext'
CardGridContext.displayName = 'CardGridContext'
