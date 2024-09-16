import { TableRowProps } from '../Types/Props';

const TableRow = <T,>({ data, column }: TableRowProps<T>) => {

    const { className } = column

    if (column.dataIndex) {
        const cellValue = data[column.dataIndex as keyof T];

        if (cellValue) {
            return (
                <td className={`font-montserrat py-4 ${className}`}>
                    {String(cellValue)}
                </td>
            );
        } else {
            <td className={`font-montserrat py-4 ${className}`}>

            </td>
        }
    }

    if (column.render) {

        return (
            <td className={`font-montserrat py-4 ${className}`}>
                {column.render()}
            </td>
        )
    }

    return (
        <td className={`font-montserrat py-4 ${className}`}>

        </td>
    );
};

export default TableRow;
