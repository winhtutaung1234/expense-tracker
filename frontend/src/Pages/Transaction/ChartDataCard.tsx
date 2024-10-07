import React, { useContext } from 'react'
import { Select } from '../../Components/Select'
import { Category as CategoryType } from '../../Types/Category'
import { TransactionPageContext } from './NewTransaction'

const ChartDataCard = () => {
    const context = useContext(TransactionPageContext);

    if (!context) {
        return (
            <p>Loading...</p>
        )
    }

    const { allCategories, transactionFormData, updateTransactionForm } = context;

    return (
        <div className='w-full bg-dark-gray flex flex-wrap gap-4 p-6 rounded-lg shadow-md'>
            <div className='flex flex-col flex-1 gap-4'>
                <div className='flex items-center gap-2'>
                    <p className='font-montserrat text-[16px] opacity-50 whitespace-nowrap'>Currently Showing:</p>
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
                        value={transactionFormData.category_id}
                        className='min-h-[35px]'
                        onChange={(id) => updateTransactionForm({ category_id: Number(id) })}
                    />
                </div>
                <div className='flex justify-around'>
                    <div className='flex flex-col gap-2 items-center'>
                        <p className='font-montserrat text-[14px] opacity-50'>Income Color</p>
                        <input type='color' />
                    </div>
                    <div className='flex flex-col gap-2 items-center'>
                        <p className='font-montserrat text-[14px] opacity-50'>Expense Color</p>
                        <input type='color' />
                    </div>
                </div>
            </div>
            <div className='flex flex-col flex-1 gap-2'>
                <div className='flex items-center'>
                    <p className='font-montserrat opacity-50 w-[40%]'>Total Income:</p>
                    <p className='font-bold text-[24px] text-[#05CE73]'>52,000 Ks</p>
                </div>
                <div className='flex items-center'>
                    <p className='font-montserrat opacity-50 w-[40%]'>Total Expense:</p>
                    <p className='font-bold text-[24px] text-[#FF5649]'>52,000 Ks</p>
                </div>
            </div>
        </div>
    )
}

export default ChartDataCard