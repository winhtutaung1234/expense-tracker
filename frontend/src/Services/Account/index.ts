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

    static async deleteAccount(id: string | number): Promise<{ msg: string }> {
        try {
            const response = await api.delete<{ msg: string }>(`/accounts/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getAccount(id: string | number): Promise<AccountType> {
        try {
            const response = await api.get<AccountType>(`/accounts/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async updateAccount(id: string | number, accountFormData: AccountForm): Promise<AccountType> {
        try {
            const response = await api.put<AccountType>(`/accounts/${id}`, accountFormData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default Account;