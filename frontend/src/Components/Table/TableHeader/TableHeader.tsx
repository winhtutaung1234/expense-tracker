import { useContext } from 'react';
import { TableContext } from '../TableContext';
import { ColumnProps } from '../Types/Props';

const TableHeader = (ColumnProps: ColumnProps<any>) => {
    const { title } = ColumnProps;

    return (
        <th className='font-inter text-[18px] pb-4'>
            {title}
        </th>
    );
};

export default TableHeader;
