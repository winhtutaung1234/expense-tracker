import React, { ChangeEvent, useContext, useEffect } from 'react'
import { TransactionChartProps } from '../../Types/Props/Transaction';
import { getChartData } from './getTransactionChartData';
import { TransactionPageContext } from './NewTransaction';
import LineChart from '../../Components/Chart/LineChart';

const TransactionChart = (TransactionChartProps: TransactionChartProps) => {

    const context = useContext(TransactionPageContext);

    if (!context) {
        return (
            <p>Loading...</p>
        )
    }

    const {
        selectedAccountTransactions,
    } = context;

    const { selectedChartFilter, setSelectedChartFilter, data, setData } = TransactionChartProps

    const handleChartFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedChartFilter(e.target.value);
    }

    useEffect(() => {
        let chartData = getChartData(selectedAccountTransactions, selectedChartFilter);
        setData(chartData);
    }, [selectedAccountTransactions, selectedChartFilter])

    return (
        <>
            <div className='flex justify-between items-center mb-2 mt-5'>
                <p className='font-inter text-[28px] text-white font-light tracking-wide'>Transaction Chart</p>
                <select
                    onChange={handleChartFilterChange}
                    value={selectedChartFilter}
                    name='chart_filter'
                    className="bg-light-gray text-white py-1 px-2 rounded-md">
                    <option value="this_week">This Week</option>
                    <option value="last_week">Last Week</option>
                    <option value="last_2_weeks">Last 2 Weeks</option>
                    <option value="last_month">Last Month</option>
                    <option value="last_3_months">Last 3 Months</option>
                    <option value="last_6_months">Last 6 Months</option>
                    <option value="this_year">This Year</option>
                </select>
            </div>

            <LineChart options={{ responsive: true }} data={data} />
        </>
    )
}

export default TransactionChart