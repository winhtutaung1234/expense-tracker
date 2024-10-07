import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import { getChartData } from './getTransactionChartData';
import { TransactionPageContext } from './NewTransaction';
import LineChart from '../../Components/Chart/LineChart';
import ChartDataCard from './ChartDataCard';
import { Data } from '../../Types/Props/LineChart';
import { TransactionChartCategoryFilter } from '../../Types/Transaction';

const TransactionChart = () => {

    const context = useContext(TransactionPageContext);

    if (!context) {
        return (
            <p>Loading...</p>
        )
    }

    const {
        selectedAccountTransactions,
        allCategories
    } = context;

    //Chart
    const [selectedChartFilter, setSelectedChartFilter] = useState("this_week");
    const [data, setData] = useState<Data>({
        labels: [],
        datasets: [],
    });
    const [addedChartCategories, setAddedChartCategories] = useState<TransactionChartCategoryFilter[]>([{ category_id: 0, income_color: "#05CE73", expense_color: "#FF5649" }]);

    const handleChartFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedChartFilter(e.target.value);
    }

    useEffect(() => {
        let chartData = getChartData(selectedAccountTransactions, allCategories, selectedChartFilter, addedChartCategories);
        setData(chartData);
        console.log(chartData);
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

            <div className='flex gap-8'>
                <div className='lg:w-[60%] max-lg:w-full'>
                    <p className='font-inter text-[28px] text-white font-light tracking-wide'>Adjust Chart Data</p>
                    {addedChartCategories.map((chartCategory, index) =>
                        <ChartDataCard key={index} />
                    )}
                </div>
                <div className='lg:w-[40%] bg-black'>

                </div>
            </div>
        </>
    )
}

export default TransactionChart