export function hexToDec(hex: string) {
    try {
        return Number.parseInt(hex, 16)
    } catch (e) {
        return NaN
    }
}
