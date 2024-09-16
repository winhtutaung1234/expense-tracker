import { ReactElement } from "react";
import { XOR } from "../../../../Types/Operations";

type ColumnPropsBase<T> = {
    title: string;
    className?: string;
};

type DataIndexRequired<T> = ColumnPropsBase<T> & {
    dataIndex: keyof T;
    render?: never;
};

type RenderRequired<T> = ColumnPropsBase<T> & {
    dataIndex?: never;
    render: () => ReactElement;
};

type ColumnProps<T> = XOR<DataIndexRequired<T>, RenderRequired<T>>;

export default ColumnProps;