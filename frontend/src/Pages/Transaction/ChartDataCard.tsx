import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import { Select } from '../../Components/Select'
import { Category as CategoryType } from '../../Types/Category'
import { TransactionPageContext } from './NewTransaction'
import { ChartDataCardProps } from '../../Types/Props/Transaction'
import { Dataset } from '../../Types/Props/LineChart'
import formatCurrency from '../../Utils/FormatCurrency'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'

const ChartDataCard = (ChartDataCardProps: ChartDataCardProps) => {
    const context = useContext(TransactionPageContext);

    if (!context) {
        return (
            <p>Loading...</p>
        )
    }

    const { allCategories, selectedAccount } = context;
    const { chartCategory, index, setAddedChartCategories, data, setData } = ChartDataCardProps;

    const [incomeData, setIncomeData] = useState<Dataset | undefined>(data[index * 2]);
    const [expenseData, setExpenseData] = useState<Dataset | undefined>(data[index * 2 + 1]);

    const [totalIncomeBalance, setTotalIncomeBalance] = useState<string | undefined>();
    const [totalExpenseBalance, setTotalExpenseBalance] = useState<string | undefined>();

    console.log(expenseData);
    useEffect(() => {
        setIncomeData(data[index * 2]);
        setExpenseData(data[index * 2 + 1]);
    }, [data])

    useEffect(() => {
        const totalBalance = incomeData?.data.reduce((x: number, y: number) => x + y, 0);
        if (totalBalance != undefined) {
            const formattedBalance = formatCurrency(totalBalance, selectedAccount?.currency.symbol, selectedAccount?.currency.symbol_position, selectedAccount?.currency.decimal_places)
            setTotalIncomeBalance(formattedBalance);
        }
    }, [incomeData])


    useEffect(() => {
        const totalBalance = expenseData?.data.reduce((x: number, y: number) => x + y, 0);
        if (totalBalance != undefined) {
            const formattedBalance = formatCurrency(totalBalance, selectedAccount?.currency.symbol, selectedAccount?.currency.symbol_position, selectedAccount?.currency.decimal_places)
            setTotalExpenseBalance(formattedBalance);
        }
    }, [expenseData])

    const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
        let indexNo = e.target.name === "income_color" ? index * 2 : index * 2 + 1;
        setData(prevData => ({
            ...prevData,
            datasets: prevData.datasets.map((dataset, i) => i === indexNo ? { ...dataset, borderColor: e.target.value } : dataset)
        }))
        setAddedChartCategories(prevData => prevData.map((c, i) => i === index ? { ...c, [e.target.name]: e.target.value } : c))
    }

    const handleDeleteClick = () => {
        setData(prevData => ({
            ...prevData,
            datasets: prevData.datasets.slice(0, index * 2).concat(prevData.datasets.slice(index * 2 + 1))
        }));
        setAddedChartCategories(prevData => prevData.filter((c, i) => i !== index));
    }

    return (
        <div className='w-full bg-dark-gray flex flex-wrap gap-4 p-6 rounded-lg shadow-md relative'>
            {index != 0 && (
                <div onClick={handleDeleteClick} className='absolute top-0 right-0 bg-danger rounded-full w-6 h-6 flex items-center justify-center translate-x-1/2 -translate-y-1/2'>
                    <FontAwesomeIcon icon={faX} />
                </div>
            )}
            <div className='flex flex-col flex-1 gap-4'>
                <div className='flex items-center gap-2'>
                    <p className='font-montserrat text-[14px] opacity-50 whitespace-nowrap'>Currently Showing:</p>
                    <Select<CategoryType>
                        allOptions={[{
                            id: 0,
                            name: "All Categories",
                            description: "",
                            background_color: "#FFFFFF",
                            text_color: "#FFFFFF",
                            created_at: "",
                            updated_at: ""
                        }, ...allCategories]}
                        dataIndex='id'
                        displayKey='name'
                        value={chartCategory.category_id}
                        className='min-h-[35px]'
                        search
                        onChange={(id) => setAddedChartCategories(prevData => prevData.map((chartCategory, i) => i === index ? { ...chartCategory, category_id: Number(id) } : chartCategory))}
                    />
                </div>
                <div className='flex justify-around gap-2'>
                    <div className='flex flex-wrap gap-2 items-center justify-center'>
                        <p className='font-montserrat text-[12px] opacity-50'>Income Color</p>
                        <input name='income_color' type='color' value={incomeData?.borderColor || '#05CE73'} onChange={handleColorChange} />
                    </div>
                    <div className='flex flex-wrap gap-2 items-center justify-center'>
                        <p className='font-montserrat text-[12px] opacity-50'>Expense Color</p>
                        <input name='expense_color' type='color' value={expenseData?.borderColor || '#FF5649'} onChange={handleColorChange} />
                    </div>
                </div>
            </div>
            <div className='flex flex-col flex-1 gap-2'>
                <div className='flex items-center flex-warp gap-2'>
                    <p className='font-montserrat opacity-50 w-[40%]'>Total Income:</p>
                    <p className='font-bold text-[24px]' style={{ color: typeof incomeData?.borderColor === 'string' ? incomeData.borderColor : "#05CE73" }}>
                        {totalIncomeBalance}
                    </p>

                </div>
                <div className='flex items-center flex-wrap gap-2'>
                    <p className='font-montserrat opacity-50 w-[40%]'>Total Expense:</p>
                    <p className='font-bold text-[24px]' style={{ color: typeof expenseData?.borderColor === 'string' ? expenseData.borderColor : "#FF5649" }}>
                        {totalExpenseBalance}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ChartDataCard