import { Account } from "../Account";
import { Category } from "../Category";
import { Currency } from "../Currency";

type Transaction = {
    id: number;
    account_id: number;
    account: Omit<Account, "name" | "description" | "user_id" | "currency_id" | "created_at" | "updated_at" | "currency">;
    category_id: number;
    category: Omit<Category, "id" | "created_at" | "updated_at">;
    transaction_type: "income" | "expense";
    amount: string;
    currency_id: number;
    currency: Omit<Currency, "id" | "name" | "created_at" | "updated_at">
    description: string;
    exchange_rate: string;
    created_at: string;
    updated_at: string;
}

export default Transaction;