import FormatDecimal from "../FormatDecimal";

const formatCurrency = (balance: string | number, symbol: string = "", symbolPosition: "before" | "after" = "before", decimalPlace: number = 2): string => {
    const formattedBalance = FormatDecimal(balance, decimalPlace);

    // Format the integer part with commas
    const [integerPart, decimalPart] = formattedBalance.split('.');
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    const finalBalance = decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;

    if (symbol) {
        return symbolPosition === "before"
            ? `${symbol} ${finalBalance}`
            : `${finalBalance} ${symbol}`;
    } else {
        return finalBalance
    }
};

export default formatCurrency;