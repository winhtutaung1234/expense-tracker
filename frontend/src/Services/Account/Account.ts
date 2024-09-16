import api from "../api";
import type { AccountForm, Account as AccountType } from "../../Types/Account";

class Account {
    static async fetchAccounts(): Promise<AccountType[]> {
        try {
            const response = await api.get<AccountType[]>('/accounts');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async createAccount(accountFormData: AccountForm): Promise<AccountType> {
        try {
            const response = await api.post<AccountType>('/accounts', accountFormData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

}

export default Account;