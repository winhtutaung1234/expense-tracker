import React, { ChangeEvent, useContext } from 'react'
import { Transaction as TransactionType } from '../../Types/Transaction';
import { Category as CategoryType } from '../../Types/Category';
import TransactionService from '../../Services/Transaction';
import AccountService from '../../Services/Account';
import { TransactionFormProps } from '../../Types/Props/Transaction';
import getError from '../../Utils/getError';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import Error from '../../Components/Errors';
import { Select } from '../../Components/Select';
import { Currency as CurrencyType } from '../../Types/Currency';
import { TransactionPageContext } from './NewTransaction';

const TransactionForm = (TransactionFormProps: TransactionFormProps) => {

    const context = useContext(TransactionPageContext);

    if (!context) {
        return (
            <p>Loading...</p>
        )
    }

    const {
        allAccounts,
        allCategories,
        allCurrencies,
        selectedAccountTransactions,
        selectedEditID,
        setAllAccounts,
        setAllCategories,
        setAllCurrencies,
        setSelectedAccountTransactions,
        setSelectedEditID,
        setTransactionFormData,
        transactionFormData
    } = context;

    const {
        showForm,
        setShowForm,
        transactionFormDataError,
        setTransactionFormDataError,
        createTransactionForm,
        resetErrorWithTimeout,
        validateTransactionForm,
        updateTransactionForm,
    } = TransactionFormProps;

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        updateTransactionForm({ [e.target.name]: e.target.value })
    }

    const handleCategoryChange = (id: string | number) => {
        updateTransactionForm({ category_id: Number(id) })
    }

    /* Start of Create Transaction */
    const handleAddTransactionClick = () => {
        const validated = validateTransactionForm()

        if (validated) {
            TransactionService.createTransaction(transactionFormData)
                .then((data) => {
                    setSelectedAccountTransactions(prevData => [data, ...prevData]);
                    AccountService.getAccount(data.account_id)
                        .then((data) => {
                            setAllAccounts(prevData => (prevData.map(account => account.id == transactionFormData.account_id ? data : account)))
                            setTransactionFormData(createTransactionForm());
                        })
                        .catch(() => {
                        })
                })
                .catch((error) => {
                    const formError = getError(error);
                    setTransactionFormDataError(formError);
                    resetErrorWithTimeout()
                })
        } else {
            resetErrorWithTimeout()
        }
    }
    /* End of Create Transaction */

    /* Start of Edit Transaction */
    const handleEditCick = (id: number | string) => {
        setSelectedEditID(id);
        TransactionService.getTransaction(id)
            .then((data) => {
                setTransactionFormData(createTransactionForm({ data: data }))
            })
            .catch(() => {
            })
    }

    const handleCancelEditClick = () => {
        setSelectedEditID(null);
        setTransactionFormData(createTransactionForm())
    }

    const handeSaveEditClick = () => {
        const validated = validateTransactionForm();
        if (validated && selectedEditID) {
            TransactionService.updateTransaction(selectedEditID, transactionFormData)
                .then((newTransaction) => {
                    setSelectedAccountTransactions(prevData => prevData.map(transaction => transaction.id == newTransaction.id ? newTransaction : transaction));
                    setSelectedEditID(null);
                    setTransactionFormData(createTransactionForm())
                    AccountService.getAccount(newTransaction.account_id)
                        .then((data) => {
                            setAllAccounts(prevData => (prevData.map(account => account.id == transactionFormData.account_id ? data : account)))
                        })
                        .catch(() => {
                        })
                })
                .catch(() => {
                })
        } else {
            resetErrorWithTimeout()
        }
    }
    /* End of Edit Transaction */

    /* Utility and Helper Functions */

    return (
        <>
            <FontAwesomeIcon className='fixed top-1/2 -translate-y-1/2 left-0 bg-login-button py-1 px-2 rounded-r-md cursor-pointer' onClick={() => setShowForm(true)} icon={faAnglesRight} />

            <form className={`bg-gray p-6 rounded-xl border border-light-yellow border-opacity-50 sticky top-40 max-h-[65svh] flex flex-col flex-[0.4] justify-between ${showForm ? "animate-openForm1" : "animate-closeForm1"}`}>
                <FontAwesomeIcon className='absolute top-1/2 -translate-y-1/2 translate-x-1/2 right-0 text-black bg-login-button px-2 py-1 rounded-md' onClick={() => setShowForm(false)} icon={faAnglesLeft} />
                <div className='h-[85%] text-white overflow-y-scroll pr-2 scrollBar scrollBarWidth6'>
                    <p className='font-inter text-[18px]'>Transaction</p>
                    <div className='flex gap-4 mt-2'>
                        <div className='relative flex-[0.65]'>
                            <svg className='absolute fill-current text-white opacity-50 top-1/2 -translate-y-1/2 left-3 w-[20px]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M512 80c0 18-14.3 34.6-38.4 48c-29.1 16.1-72.5 27.5-122.3 30.9c-3.7-1.8-7.4-3.5-11.3-5C300.6 137.4 248.2 128 192 128c-8.3 0-16.4 .2-24.5 .6l-1.1-.6C142.3 114.6 128 98 128 80c0-44.2 86-80 192-80S512 35.8 512 80zM160.7 161.1c10.2-.7 20.7-1.1 31.3-1.1c62.2 0 117.4 12.3 152.5 31.4C369.3 204.9 384 221.7 384 240c0 4-.7 7.9-2.1 11.7c-4.6 13.2-17 25.3-35 35.5c0 0 0 0 0 0c-.1 .1-.3 .1-.4 .2c0 0 0 0 0 0s0 0 0 0c-.3 .2-.6 .3-.9 .5c-35 19.4-90.8 32-153.6 32c-59.6 0-112.9-11.3-148.2-29.1c-1.9-.9-3.7-1.9-5.5-2.9C14.3 274.6 0 258 0 240c0-34.8 53.4-64.5 128-75.4c10.5-1.5 21.4-2.7 32.7-3.5zM416 240c0-21.9-10.6-39.9-24.1-53.4c28.3-4.4 54.2-11.4 76.2-20.5c16.3-6.8 31.5-15.2 43.9-25.5l0 35.4c0 19.3-16.5 37.1-43.8 50.9c-14.6 7.4-32.4 13.7-52.4 18.5c.1-1.8 .2-3.5 .2-5.3zm-32 96c0 18-14.3 34.6-38.4 48c-1.8 1-3.6 1.9-5.5 2.9C304.9 404.7 251.6 416 192 416c-62.8 0-118.6-12.6-153.6-32C14.3 370.6 0 354 0 336l0-35.4c12.5 10.3 27.6 18.7 43.9 25.5C83.4 342.6 135.8 352 192 352s108.6-9.4 148.1-25.9c7.8-3.2 15.3-6.9 22.4-10.9c6.1-3.4 11.8-7.2 17.2-11.2c1.5-1.1 2.9-2.3 4.3-3.4l0 3.4 0 5.7 0 26.3zm32 0l0-32 0-25.9c19-4.2 36.5-9.5 52.1-16c16.3-6.8 31.5-15.2 43.9-25.5l0 35.4c0 10.5-5 21-14.9 30.9c-16.3 16.3-45 29.7-81.3 38.4c.1-1.7 .2-3.5 .2-5.3zM192 448c56.2 0 108.6-9.4 148.1-25.9c16.3-6.8 31.5-15.2 43.9-25.5l0 35.4c0 44.2-86 80-192 80S0 476.2 0 432l0-35.4c12.5 10.3 27.6 18.7 43.9 25.5C83.4 438.6 135.8 448 192 448z" />
                            </svg>
                            <input
                                name='amount'
                                value={transactionFormData.amount}
                                onChange={handleInputChange}
                                className='bg-light-gray min-h-[45px] max-h-[45px] w-full rounded-md placeholder:font-montserrat placeholder:text-white placeholder:text-opacity-50 ps-10 shadow-lg'
                                placeholder='Enter Amount'
                            />
                        </div>
                        <div className="relative flex-[0.35]">
                            <Select<CurrencyType>
                                allOptions={allCurrencies}
                                dataIndex='id'
                                displayKey='code'
                                onChange={() => { }}
                                style={{ height: "45px" }}
                                search
                                value={transactionFormData.currency_id}
                            />
                        </div>
                    </div>
                    <Error allErrors={transactionFormDataError} showError='amount' />
                    <Error allErrors={transactionFormDataError} showError='currency_id' />
                    <p className='font-inter text-[18px] mt-4'>Transaction Type</p>
                    <div className='relative mt-2'>
                        <select
                            name='transaction_type'
                            onChange={handleInputChange}
                            value={transactionFormData.transaction_type}
                            className='bg-light-gray min-h-[45px] max-h-[45px] w-full rounded-md ps-4 appearance-none shadow-lg font-montserrat'
                        >
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                            <option value="transfer">Transfer</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    <Error allErrors={transactionFormDataError} showError='transaction_type' />
                    <p className='font-inter text-[18px] mt-4'>Category</p>
                    <Select<CategoryType>
                        allOptions={allCategories}
                        onChange={handleCategoryChange}
                        value={transactionFormData.category_id}
                        dataIndex="id"
                        displayKey="name"
                        className='min-h-[45px] mt-2'
                        search={true}
                    />
                    <Error allErrors={transactionFormDataError} showError='category_id' />
                    <p className='font-inter text-[18px] mt-4'>Date</p>
                    <input
                        type='date'
                        name='date'
                        value={transactionFormData.date}
                        onChange={handleInputChange}
                        className='bg-light-gray min-h-[45px] max-h-[45px] w-full rounded-md placeholder:font-montserrat placeholder:text-white placeholder:text-opacity-50 ps-4 shadow-lg '
                    />
                    <Error allErrors={transactionFormDataError} showError='transaction_type' />
                    <p className='font-inter text-[18px] mt-4'>Note</p>
                    <div className='relative'>
                        <svg className='absolute fill-current text-white opacity-50 w-[20px] top-2 left-3' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l224 0 0-112c0-26.5 21.5-48 48-48l112 0 0-224c0-35.3-28.7-64-64-64L64 32zM448 352l-45.3 0L336 352c-8.8 0-16 7.2-16 16l0 66.7 0 45.3 32-32 64-64 32-32z" />
                        </svg>
                        <textarea
                            name='description'
                            value={transactionFormData.description}
                            onChange={handleInputChange}
                            className='bg-light-gray min-h-[105px] max-h-[105px] w-full rounded-md placeholder:font-montserrat placeholder:text-white placeholder:text-opacity-50 ps-10 py-2 shadow-lg scrollBar resize-none'
                            placeholder='Enter Description'
                        />
                    </div>
                    <Error allErrors={transactionFormDataError} showError='description' />
                </div>
                {selectedEditID ? (
                    <div className='flex gap-3 mt-4'>
                        <button
                            type='button'
                            onClick={handleCancelEditClick}
                            className='w-1/2 bg-danger rounded-md font-montserrat shadow-lg min-h-[45px] max-h-[45px]'
                        >
                            Cancel
                        </button>
                        <button
                            type='button'
                            onClick={handeSaveEditClick}
                            className='w-1/2 bg-primary rounded-md font-montserrat shadow-lg min-h-[45px] max-h-[45px]'
                        >
                            Save
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleAddTransactionClick}
                        type='button'
                        className='text-black bg-login-button min-h-[45px] max-h-[45px] rounded-md shadow-lg font-montserrat w-full'
                    >
                        Add Transaction
                    </button>
                )}
            </form>
        </>
    )
}

export default TransactionForm