import { Currency } from "../Currency";

type Account = {
    id: number;
    name: string;
    description: string;
    balance: string;
    user_id: number;
    currency_id: number;
    created_at: string;
    updated_at: string;
    Currency: Currency;
}

export default Account;