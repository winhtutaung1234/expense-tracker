import { ChangeEvent } from "react";

type SelectProps<T> = {
    value: string | number;
    onChange: (id: string | number) => void;
    allOptions: T[];
    dataIndex: keyof T;
    displayKey: keyof T;
    className?: string;
    style?: React.CSSProperties;
    search?: Boolean
}

export default SelectProps