type TransactionForm = {
    account_id: number;
    category_id: number;
    transaction_type: "income" | "expense";
    amount: string;
    currency_id: number;
    description: string;
    date: string;
}

export default TransactionForm;