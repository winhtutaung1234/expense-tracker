import ColumnProps from "./ColumnProps";

type TableRowProps<T> = {
    data: T;
    column: ColumnProps<T>;
};

export default TableRowProps