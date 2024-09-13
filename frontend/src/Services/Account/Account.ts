import api from "../api";
import type { Account as AccountType } from "../../Types/Account";

class Account {
    static async fetchAccounts(): Promise<AccountType[]> {
        try {
            const response = await api.get<AccountType[]>('/accounts');
            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }


}

export default Account;