const FormatDecimal = (balance: string | number, decimalPlace: number): string => {
    const stringBalance = balance.toString();

    if (isNaN(decimalPlace) || decimalPlace < 0) {
        throw new Error("Not a valid decimal place");
    }

    // Handle zero decimal places
    if (decimalPlace === 0) {
        return stringBalance.split('.')[0];
    }

    const [integerPart, decimalPart = ''] = stringBalance.split('.');

    // If balance already has enough decimal places, truncate it
    if (decimalPart.length >= decimalPlace) {
        return `${integerPart}.${decimalPart.slice(0, decimalPlace)}`;
    }

    // Otherwise, pad with zeros
    const paddedDecimal = decimalPart.padEnd(decimalPlace, '0');
    return `${integerPart}.${paddedDecimal}`;
}

export default FormatDecimal;