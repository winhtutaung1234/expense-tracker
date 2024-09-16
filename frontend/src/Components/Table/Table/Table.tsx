import React, { useEffect, useState, ReactElement } from 'react';
import { TableContext } from '../TableContext';
import { ColumnProps, TableProps } from '../Types/Props';
import { TableHeader } from '../TableHeader';
import { TableRow } from '../TableRow';

const Table = <T,>({ children, dataSource }: TableProps<T>) => {
  const [filteredData, setAllFilteredData] = useState<T[]>(dataSource);

  const [columns, setColumns] = useState<ColumnProps<T>[]>([]);

  useEffect(() => {
    const columnProps = React.Children.toArray(children)
      .filter((child): child is React.ReactElement<ColumnProps<T>> => React.isValidElement(child))
      .map(child => child.props);

    setColumns(columnProps);
  }, [children, dataSource]);

  return (
    <TableContext.Provider value={{ filteredData, setAllFilteredData, columns }}>
      <table className='flex-[0.7] text-left h-full'>
        <thead>
          <tr className='font-inter text-[18px]'>
            {columns.length > 0 && columns.map((column, index) => (
              <TableHeader key={index} {...column} />
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 && filteredData.map((data, index) => (
            <tr key={index} className='border-t-[1px] border-t-[rgba(255,255,255,0.5)]'>
              {columns.length > 0 && columns.map((column, index) => (
                <TableRow key={index} data={data} column={column} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </TableContext.Provider>
  );
};

export default Table;
