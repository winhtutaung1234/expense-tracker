import { ReactElement } from "react";
import { XOR } from "../../../../Types/Operations";

type ColumnPropsBase<T> = {
    title: string;
    className?: string;
    width?: string;
    sort?: boolean;
};

type DataIndexRequired<T> = ColumnPropsBase<T> & {
    dataIndex: keyof T;
    render?: (data: T) => ReactElement | string | number;
};

type RenderRequired<T> = ColumnPropsBase<T> & {
    dataIndex?: never;
    render: (data: T) => ReactElement | string | number;
};

type ColumnProps<T> = XOR<DataIndexRequired<T>, RenderRequired<T>>;

export default ColumnProps;