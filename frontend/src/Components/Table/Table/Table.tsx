import { useState } from 'react'
import { TableContext } from '../TableContext'
import { TableProps } from '../Types/Props';

const Table = <T,>({ children, dataSource }: TableProps<T>) => {
  const [filteredData, setAllFilteredData] = useState<T[]>(dataSource);


  return (
    <TableContext.Provider value={{ filteredData, setAllFilteredData }}>
      <table className='flex-[0.7] text-left h-full'>
        <thead>
          <tr className='font-inter text-[18px] border-b-[1px] border-b-[rgba(255,255,255,0.5)]'>
            <th>Account</th>
            <th>Balance</th>
            <th>Exchange Rate</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>KPay</td>
            <td>100,000 MMK</td>
            <td>1</td>
          </tr>
        </tbody>
      </table>
    </TableContext.Provider>
  )
}

export default Table