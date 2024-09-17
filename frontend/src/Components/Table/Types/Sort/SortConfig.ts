import SortDirection from "./SortDirection";

type SortConfig<T> = {
    key: keyof T | "";
    direction: SortDirection;
}

export default SortConfig;