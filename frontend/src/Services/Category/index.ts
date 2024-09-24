import api from "../api";
import { Category as CategoryType } from "../../Types/Category";

class Category {
    static async getAll(): Promise<CategoryType[]> {
        try {
            const response = await api.get<CategoryType[]>('/categories');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default Category;