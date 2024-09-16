const formatCurrencySymbol = (balance: string, symbol: string, symbolPosition: "before" | "after"): string => {
    if (symbolPosition === "before") {
        return `${symbol} ${balance}`
    }
    if (symbolPosition === "after") {
        return `${balance} ${symbol}`
    }
    throw "Invalid symbol position";
}

export default formatCurrencySymbol;