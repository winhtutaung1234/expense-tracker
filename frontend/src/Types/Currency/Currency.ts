type Currency = {
    id: number;
    decimal_places: number;
    name: string;
    symbol: string;
    symbol_position: "before" | "after";
    code: string;
    created_at: string;
    updated_at: string;
}

export default Currency;