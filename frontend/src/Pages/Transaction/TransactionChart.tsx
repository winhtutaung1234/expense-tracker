import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import { getChartData } from './getTransactionChartData';
import { TransactionPageContext } from './NewTransaction';
import LineChart from '../../Components/Chart/LineChart';
import ChartDataCard from './ChartDataCard';
import { Data, Dataset } from '../../Types/Props/LineChart';
import { TransactionChartCategoryFilter } from '../../Types/Transaction';
import PieChart from '../../Components/Chart/PieChart';

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

    const [selectedChartFilter, setSelectedChartFilter] = useState("this_week");

    //Line Chart
    const [data, setData] = useState<Data>({
        labels: [],
        datasets: [],
    });
    const [addedChartCategories, setAddedChartCategories] = useState<TransactionChartCategoryFilter[]>([{ category_id: 0, income_color: "#05CE73", expense_color: "#FF5649" }]);

    //Pie Chart
    const [pieChartData, setPieChartData] = useState<Data>({
        labels: [],
        datasets: [],
    });

    const handleChartFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedChartFilter(e.target.value);
    }

    const handleAddChartDataClick = () => {
        setAddedChartCategories((prevData) => ([...prevData, { category_id: 0, income_color: "#05CE73", expense_color: "#FF5649" }]))
    }

    const handlePieChartSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const dataset = data.datasets.find(dataset => dataset.label === e.target.value);
        if (dataset) {
            setPieChartData({
                ...data,
                datasets: [dataset]
            })
        }
    }

    const updatePieChartData = (dataset?: Dataset) => {
        
    }

    useEffect(() => {
        let chartData = getChartData(selectedAccountTransactions, allCategories, selectedChartFilter, addedChartCategories);
        setData(chartData);
    }, [selectedAccountTransactions, selectedChartFilter, addedChartCategories])


    useEffect(() => {
        if (pieChartData.datasets.length > 0) {
            // console.log(pieChartData);
            const foundDataset = data.datasets.find(dataset => dataset.label === pieChartData.datasets[0].label);

            if (foundDataset) {
                setPieChartData({
                    ...data,
                    datasets: [foundDataset]
                });
            } else {
                setPieChartData({
                    ...data,
                    datasets: [data.datasets[0]]
                })
            }
        } else {
            if (data.datasets.length > 0) {
                setPieChartData({
                    ...data,
                    datasets: [data.datasets[0]]
                })
            }
        }
    }, [data]);

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

            <div className='flex mt-8 flex-wrap'>
                <div className='lg:w-[60%] max-lg:w-full flex flex-col gap-4 mb-6'>
                    <p className='font-inter text-[28px] text-white font-light tracking-wide '>Adjust Chart Data</p>
                    {addedChartCategories.map((chartCategory, index) =>
                        <ChartDataCard key={index} data={data.datasets} setData={setData} index={index} chartCategory={chartCategory} setAddedChartCategories={setAddedChartCategories} />
                    )}
                    <button className='bg-login-button text-black py-2 px-5 rounded-lg shadow-md font-montserrat self-end' onClick={handleAddChartDataClick}>
                        Add New Chart Data
                    </button>
                </div>
                {pieChartData.datasets.length > 0 && (
                    <div className='lg:w-[40%] max-lg:w-full flex flex-col gap-4'>
                        <div className='flex justify-between'>
                            <p className='font-inter text-[28px] text-white font-light tracking-wide '>Pie Chart</p>
                            <select
                                className="bg-light-gray text-white py-1 px-2 rounded-md"
                                onChange={handlePieChartSelectChange}
                                value={pieChartData.datasets[0].label}
                            >
                                {[...new Set(data.datasets.map((dataset) => dataset.label))].map((label, i) => (
                                    <option key={i} value={label}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <PieChart data={pieChartData} options={{ responsive: true }} />
                    </div>
                )}
            </div>
        </>
    )
}

export default TransactionChart