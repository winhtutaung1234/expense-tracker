import { TableRowProps } from '../Types/Props';

const TableRow = <T,>({ data, column }: TableRowProps<T>) => {
    const { className = "" } = column;

    if (column.dataIndex) {
        const cellValue = data[column.dataIndex as keyof T];

        if (column.render) {
            return (
                <td className={`font-montserrat py-4 px-3 pt-3 ${className}`}>
                    {column.render(cellValue as T[keyof T] extends string ? T[keyof T] : T[keyof T] extends object ? T[keyof T] : never, data)}
                </td>
            );
        }

        return (
            <td className={`font-montserrat py-4 px-3 pt-3 ${className}`}>
                {cellValue !== undefined ? String(cellValue) : null}
            </td>
        );
    }

    return (
        <td className={`font-montserrat py-4 px-3 pt-3 ${className}`} />
    );
};

export default TableRow;
