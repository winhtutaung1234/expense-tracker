import { ColumnProps } from "../Props";
import { SortConfig } from "../Sort";

type TableContextType<T> = {
    filteredData: T[];
    setAllFilteredData: (data: T[]) => void;
    columns: ColumnProps<T>[];
    sortConfig: SortConfig<T>;
    setSortConfig: (config: SortConfig<T> | ((prev: SortConfig<T>) => SortConfig<T>)) => void;
}

export default TableContextType;