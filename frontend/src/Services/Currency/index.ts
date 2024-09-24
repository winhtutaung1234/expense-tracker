import api from "../api";
import { Currency as CurrencyType } from "../../Types/Currency";

class Currency {
    static async getAll(): Promise<CurrencyType[]> {
        try {
            const response = await api.get<CurrencyType[]>('/currencies');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default Currency;