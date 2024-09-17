import { createContext } from "react";
import TableContextType from "../Types/TableContextType";

const TableContext = createContext<TableContextType<any>>({
    filteredData: [],
    setAllFilteredData: () => { },
    columns: [],
    sortConfig: { key: "", direction: "none" },
    setSortConfig: () => { },
});

export default TableContext;