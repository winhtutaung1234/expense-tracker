const FormatDecimal = (balance: string | number, decimalPlace: number): string => {
    let stringBalance = balance + "";
    let newBalance;

    if (isNaN(decimalPlace) || decimalPlace < 0) throw "Not a valid decimal place";

    if (Boolean(decimalPlace)) {
        let balanceDecimal = stringBalance.split('.')[1];
        let balanceDecimalPlace = balanceDecimal.length;

        if (decimalPlace < balanceDecimalPlace) {
            newBalance = stringBalance.split('.')[0] + balanceDecimal.slice(balanceDecimalPlace);
            return newBalance;
        } else {
            return stringBalance;
        }
    } else {
        return stringBalance.split('.')[0];
    }
}

export default FormatDecimal;