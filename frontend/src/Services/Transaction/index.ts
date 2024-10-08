import { TransactionForm, Transaction as TransactionType } from "../../Types/Transaction";
import api from "../api";

class Transaction {
    static async getTransactionsByAccount(id: string | number): Promise<TransactionType[]> {
        try {
            const response = await api.get<TransactionType[]>(`/transactions?account_id=${id}`)
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getTransaction(id: string | number): Promise<TransactionType> {
        try {
            const response = await api.get<TransactionType>(`/transactions/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async updateTransaction(id: string | number, transactionFormData: TransactionForm): Promise<TransactionType> {
        try {
            const response = await api.put<TransactionType>(`/transactions/${id}`, transactionFormData)
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async createTransaction(transactionFormData: TransactionForm): Promise<TransactionType> {
        try {
            const response = await api.post<TransactionType>(`/transactions`, transactionFormData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async deleteTransaction(id: string | number) {
        try {
            const response = await api.delete(`/transactions/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default Transaction;