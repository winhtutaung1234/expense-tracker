import { TableRowProps } from '../Types/Props';

const TableRow = <T,>({ data, column }: TableRowProps<T>) => {

    const { className = "" } = column

    if (column.dataIndex && !column.render) {
        const cellValue = data[column.dataIndex as keyof T];

        if (cellValue) {
            return (
                <td className={`font-montserrat py-4 px-3 pt-3 ${className}`}>
                    {String(cellValue)}
                </td>
            );
        } else {
            return (
                <td className={`font-montserrat py-4 px-3 pt-3 ${className}`} />
            );
        }
    }

    if (column.render) {

        return (
            <td className={`font-montserrat py-4 px-3 pt-3 ${className}`}>
                {column.render(data[column.dataIndex as keyof T] as T[keyof T], data)}
            </td>
        )
    }

    return (
        <td className={`font-montserrat py-4 px-3 pt-3 ${className}`}>

        </td>
    );
};

export default TableRow;
