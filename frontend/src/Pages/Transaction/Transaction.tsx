import React, { ChangeEvent, FormHTMLAttributes, MouseEvent, ReactEventHandler, useEffect, useRef, useState } from 'react'
import { Modal } from '../../Components/Modal'
import { type Account as AccountType } from '../../Types/Account';
import { Currency as CurrencyType } from '../../Types/Currency';
import AccountService from '../../Services/Account';
import Currency from '../../Services/Currency';
import TransactionService from '../../Services/Transaction';
import { Column, Table } from '../../Components/Table';
import { TransactionForm, Transaction as TransactionType } from '../../Types/Transaction';
import Category from '../../Services/Category';
import { Category as CategoryType } from '../../Types/Category';
import { NavLink, useLocation, useOutletContext } from 'react-router-dom';
import FormatDecimal from '../../Utils/FormatDecimal';
import formatCurrency from '../../Utils/FormatCurrency';
import { formatDateWithSuffix } from '../../Utils/FormatDate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import formatDecimal from '../../Utils/FormatDecimal';
import getError from '../../Utils/getError';
import Error from '../../Components/Errors';
import Validator from '../../Validator';
import LineChart from '../../Components/Chart/LineChart';
import Logo from '../../Assets/Logo';
import { getChartData } from './getTransactionChartData';
import { Data } from '../../Types/Props/LineChart';


const Transaction = () => {

    //Data
    const location = useLocation();
    const { state } = location;
    const [allAccounts, setAllAccounts] = useState<AccountType[]>([]);
    const [allCurrencies, setAllCurrencies] = useState<CurrencyType[]>([]);
    const [allCategories, setAllCategories] = useState<CategoryType[]>([]);
    const [transactionFormData, setTransactionFormData] = useState<TransactionForm>({
        account_id: (state && state?.account_id) || 0,
        amount: "",
        category_id: 0,
        currency_id: 0,
        description: "",
        transaction_type: "income"
    });

    const { showNav } = useOutletContext<{ showNav: Boolean }>();

    //Error
    const [transactionFormDataError, setTransactionFormDataError] = useState<Partial<Record<keyof TransactionForm, string[]>>>();
    const resetErrorTimeoutRef = useRef<number | null>(null);

    //Modal
    const [showWarningModal, setShowWarningModal] = useState(false);

    //Delete
    const [selectedDeleteID, setSelectedDeleteID] = useState<string | number | null>(null);

    //Edit
    const [selectedEditID, setSelectedEditID] = useState<string | number | null>(null);

    //Selected Account Transactions + Account Balance
    const [selectedAccountTransactions, setSelectedAccountTransactions] = useState<TransactionType[]>([]);
    const [selectedAccountBalance, setSelectedAccountBalance] = useState<string | null>(null);

    //Chart
    const [selectedChartFilter, setSelectedChartFilter] = useState("this_week");
    const [data, setData] = useState<Data>({
        labels: [],
        datasets: [],
    });

    //Fetch Necessary Data
    useEffect(() => {
        AccountService.fetchAccounts()
            .then((data) => {
                if (data) {
                    setAllAccounts(data);
                    if (!transactionFormData.account_id) {
                        setTransactionFormData(prevData => ({ ...prevData, account_id: data[0].id, currency_id: data[0].currency_id }))
                    } else {
                        const selectedAccount = data.find(account => account.id == transactionFormData.account_id);
                        if (selectedAccount) {
                            setTransactionFormData(prevData => ({ ...prevData, currency_id: selectedAccount.currency_id }))
                        }
                    }
                }
            })
            .catch(() => {

            })

        Currency.getAll()
            .then((data) => {
                setAllCurrencies(data);
                if (data.length > 0 && !transactionFormData.currency_id) {
                    setTransactionFormData((prevData) => ({
                        ...prevData,
                        currency_id: data[0].id
                    }))
                }
            })
            .catch(() => {
            })

        Category.getAll()
            .then((data) => {
                setAllCategories(data);
                setTransactionFormData((prevData) => ({
                    ...prevData,
                    category_id: data[0].id
                }))
            })
            .catch(() => {
            })

        if (transactionFormData.account_id) {
            TransactionService.getTransactionsByAccount(transactionFormData.account_id)
                .then((data) => {
                    setSelectedAccountTransactions(data);
                })
                .catch(() => {
                })
        }

        return () => {
            if (resetErrorTimeoutRef.current) {
                clearTimeout(resetErrorTimeoutRef.current);
            }
        };
    }, [])

    useEffect(() => {
        if (state && state.account_id) {
            setTransactionFormData(prevData => ({ ...prevData, account_id: state.account_id }))
        }
    }, [state])

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        console.log(e.target.value);
        setTransactionFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value
        }))
    }

    useEffect(() => {
        if (transactionFormData.account_id) {
            AccountService.getAccount(transactionFormData.account_id)
                .then((data) => {
                    setAllAccounts(prevData => (prevData.map(account => account.id == transactionFormData.account_id ? data : account)))
                    setTransactionFormData(prevData => ({ ...prevData, currency_id: data.currency_id }));
                    TransactionService.getTransactionsByAccount(transactionFormData.account_id)
                        .then((data) => {
                            setSelectedAccountTransactions(data);
                        })
                        .catch(() => {
                        })
                })
                .catch(() => {
                })
        }
    }, [transactionFormData.account_id])

    useEffect(() => {
        let selectedAccount;
        if (transactionFormData.account_id && allAccounts.length > 0) {
            selectedAccount = allAccounts.find(account => account.id == transactionFormData.account_id);
        } else if (!transactionFormData.account_id && allAccounts.length > 0) {
            selectedAccount = allAccounts[0];
        }

        if (selectedAccount) {
            const accountBalance = formatCurrency(selectedAccount.balance, "", selectedAccount.currency.symbol_position, selectedAccount.currency.decimal_places);
            setSelectedAccountBalance(`${accountBalance} ${selectedAccount.currency.code}`)
        }
    }, [allAccounts])

    useEffect(() => {
        let chartData = getChartData(selectedAccountTransactions, selectedChartFilter);
        setData(chartData);
    }, [selectedAccountTransactions, selectedChartFilter])

    /* Start of Chart Filter */
    const handleChartFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedChartFilter(e.target.value);
    }
    /* End of Chart Filter */

    /* Start of Create Transaction */
    const handleAddTransactionClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const validated = Validator(transactionFormData, {
            account_id: ['required'],
            amount: ['required'],
            category_id: ['required'],
            currency_id: ['required'],
            description: ['nullable'],
            transaction_type: ['required']
        }, setTransactionFormDataError)

        if (validated) {
            TransactionService.createTransaction(transactionFormData)
                .then((data) => {
                    setSelectedAccountTransactions(prevData => [data, ...prevData]);
                    AccountService.getAccount(data.account_id)
                        .then((data) => {
                            setAllAccounts(prevData => (prevData.map(account => account.id == transactionFormData.account_id ? data : account)))
                            setTransactionFormData({
                                account_id: allAccounts.length > 0 ? allAccounts[0].id : 0,
                                amount: "",
                                category_id: allCategories.length > 0 ? allCategories[0].id : 0,
                                currency_id: allCurrencies.length > 0 && transactionFormData.account_id && allAccounts ? allAccounts.find(account => account.id == transactionFormData.account_id)?.currency_id || allCurrencies[0].id : 0,
                                description: "",
                                transaction_type: "income"
                            })
                        })
                        .catch(() => {
                        })
                })
                .catch((error) => {
                    const formError = getError(error);
                    setTransactionFormDataError(formError);
                    resetErrorTimeoutRef.current = window.setTimeout(() => {
                        setTransactionFormDataError({});
                    }, 2000);
                })
        } else {
            resetErrorTimeoutRef.current = window.setTimeout(() => {
                setTransactionFormDataError({});
            }, 2000);
        }
    }
    /* End of Create Transaction */

    /* Start of Edit Transaction */
    const handleEditCick = (id: number | string) => {
        setSelectedEditID(id);
        TransactionService.getTransaction(id)
            .then((data) => {
                setTransactionFormData({
                    account_id: data.account_id,
                    amount: data.amount,
                    category_id: data.category_id,
                    currency_id: data.currency_id,
                    description: data.description,
                    transaction_type: data.transaction_type
                })
            })
            .catch(() => {
            })
    }

    const handleCancelEditClick = () => {
        setSelectedEditID(null);
        setTransactionFormData({
            account_id: allAccounts.length > 0 ? allAccounts[0].id : 0,
            amount: "",
            category_id: allCategories.length > 0 ? allCategories[0].id : 0,
            currency_id: allCurrencies.length > 0 && transactionFormData.account_id && allAccounts ? allAccounts.find(account => account.id == transactionFormData.account_id)?.currency_id || allCurrencies[0].id : 0,
            description: "",
            transaction_type: "income"
        })
    }

    const handeSaveEditClick = () => {
        const validated = Validator(transactionFormData, {
            account_id: ['required'],
            amount: ['required'],
            category_id: ['required'],
            currency_id: ['required'],
            description: ['nullable'],
            transaction_type: ['required']
        }, setTransactionFormDataError)
        if (validated && selectedEditID) {
            TransactionService.updateTransaction(selectedEditID, transactionFormData)
                .then((newTransaction) => {
                    setSelectedAccountTransactions(prevData => prevData.map(transaction => transaction.id == newTransaction.id ? newTransaction : transaction));
                    setSelectedEditID(null);
                    setTransactionFormData({
                        account_id: allAccounts.length > 0 ? allAccounts[0].id : 0,
                        amount: "",
                        category_id: allCategories.length > 0 ? allCategories[0].id : 0,
                        currency_id: allCurrencies.length > 0 && transactionFormData.account_id && allAccounts ? allAccounts.find(account => account.id == transactionFormData.account_id)?.currency_id || allCurrencies[0].id : 0,
                        description: "",
                        transaction_type: "income"
                    })
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
            resetErrorTimeoutRef.current = window.setTimeout(() => {
                setTransactionFormDataError({});
            }, 2000);
        }
    }
    /* End of Edit Transaction */

    /* Start of Delete Transaction */
    const handleDeleteAccountClick = (id: number) => {
        setSelectedDeleteID(id);
        setShowWarningModal(true);
    }

    const confirmDelete = () => {
        if (!selectedDeleteID) return;
        TransactionService.deleteTransaction(selectedDeleteID)
            .then(() => {
                const transaction = selectedAccountTransactions.find(transaction => transaction.id == selectedDeleteID);
                if (transaction) {
                    AccountService.getAccount(transaction.account_id)
                        .then((data) => {
                            setAllAccounts(prevData => prevData.map(account => account.id === data.id ? data : account));
                        })
                        .catch(() => {
                        })
                    setSelectedAccountTransactions(prevData => prevData.filter(transaction => transaction.id !== selectedDeleteID))
                }
                setSelectedDeleteID(null);
                setShowWarningModal(false);
            })
            .catch(() => {
            })
    }

    const rejectDelete = () => {
        setSelectedDeleteID(null);
        setShowWarningModal(false);
    }
    /* End of Delete Transaction */


    return (
        <main>
            {showWarningModal && <Modal onConfirm={confirmDelete} onClose={rejectDelete} type='warning' confirmButtonText='Delete' text='Are you sure you want to delete this Transaction?' />}
            <div className='flex gap-10 dark:text-white max-lg:flex-col flex-wrap'>
                <form className='bg-gray border border-light-yellow border-opacity-50 px-6 pt-4 pb-6 flex flex-col gap-5 flex-[0.3] max-lg:w-1/2 mx-auto max-md:w-[65%] max-sm:w-[90%] rounded-xl h-full sticky top-40 max-h-[500px]'>
                    <div className={`absolute left-1/2 -translate-x-1/2 -top-20 flex w-full justify-center ${showNav ? "animate-closeNav" : "animate-openNav"}`}>
                        <img width={70} src={Logo} />
                        <div className='flex flex-col items-center'>
                            <p className='font-alexbrush text-4xl dark:text-white'>Budget Flow</p>
                            <p className='font-arsenal text-[10px] dark:text-white'>Free yourself Financially</p>
                        </div>
                    </div>
                    <div className='flex flex-col gap-5 overflow-y-scroll pr-2 scrollBar'>
                        <div className='flex flex-col gap-2'>
                            <p className='font-inter text-[18px]'>Transaction</p>
                            <div className='flex gap-4'>
                                <div className='relative flex-[0.7]'>
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
                                <div className="relative flex-[0.3]">
                                    {allCurrencies ? (
                                        <>
                                            <select
                                                name='currency_id'
                                                value={transactionFormData.currency_id}
                                                onChange={handleInputChange}
                                                className="bg-light-gray min-h-[45px] max-h-[45px] w-full rounded-md ps-4 appearance-none shadow-lg font-montserrat">
                                                {allCurrencies.map((currency) => (
                                                    <option key={currency.id} value={currency.id}>{currency.code}</option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </>
                                    ) : (
                                        <div className='text-danger text-[14px]'>
                                            No Currency Avaliable yet
                                        </div>
                                    )
                                    }
                                </div>
                            </div>
                            <Error allErrors={transactionFormDataError} showError='amount' />
                            <Error allErrors={transactionFormDataError} showError='currency_id' />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <p className='font-inter text-[18px]'>Category</p>
                            <div className='relative'>
                                <select
                                    name='category_id'
                                    onChange={handleInputChange}
                                    value={transactionFormData.category_id}
                                    className='bg-light-gray min-h-[45px] max-h-[45px] w-full rounded-md ps-4 appearance-none shadow-lg font-montserrat'
                                >
                                    {allCategories && allCategories.map((category) => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            <Error allErrors={transactionFormDataError} showError='category_id' />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <p className='font-inter text-[18px]'>Transaction Type</p>
                            <div className='relative'>
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
                        </div>
                        <div className='flex flex-col gap-2'>
                            <p className='font-inter text-[18px]'>Note</p>
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
                            className='text-black bg-login-button min-h-[45px] max-h-[45px] rounded-md shadow-lg mt-4 font-montserrat'
                        >
                            Add Transaction
                        </button>
                    )}
                </form>
                <div className='flex-[0.7] flex flex-col'>
                    <div className={`flex justify-between py-2 px-4 sticky transition-all ${showNav ? "top-40" : "top-10"} shadow-md rounded-xl`} style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(5px)", border: "1px solid rgba(253,228,96,0.5)", borderRight: "1px solid rgba(253,228,96,0.2)", borderTop: "1px solid rgba(253,228,96,0.2)" }}>
                        <div className='flex flex-col'>
                            <p className='text-[18px] font-inter'>Your Balance</p>
                            <div className='text-[32px] font-inter font-bold flex items-center gap-2'>
                                <img src="/src/Assets/Flag/5546712_myanmar_asia_circle_country_flag_icon.png" className='w-10' />
                                {selectedAccountBalance && selectedAccountBalance}
                            </div>
                        </div>
                        <div className='flex flex-col items-end gap-2'>
                            <p className='text-[18px] font-inter'>Selected Account</p>
                            <select
                                name='account_id'
                                value={transactionFormData.account_id}
                                onChange={handleInputChange}
                                className='bg-light-yellow text-black py-1 px-2 rounded-md'>
                                {allAccounts && allAccounts.length > 0 && allAccounts.map(account => (
                                    <option key={account.id} value={account.id}>{account.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className='mt-5 mb-8'>
                        <div className='flex justify-between items-center mb-2'>
                            <p className='font-inter text-[32px] text-light-yellow font-light'>Transaction Chart</p>
                            <select
                                onChange={handleChartFilterChange}
                                name='chart_filter'
                                className="bg-light-yellow text-black py-1 px-2 rounded-md">
                                <option value="this_week">This Week</option>
                                <option value="last_week">Last Week</option>
                                <option value="last_2_weeks">Last 2 Weeks</option>
                                <option value="last_month">Last Month</option>
                                <option value="last_3_months">Last 3 Months</option>
                                <option value="last_6_months">Last 6 Months</option>
                                <option value="this_year">This Year</option>
                            </select>
                        </div>
                 
                        <LineChart options={{}} data={data} />
                    </div>
                    <p className='font-inter text-[32px] text-light-yellow mt-8 mb-6 font-light'>Transactions History</p>
                    <Table<TransactionType>
                        dataSource={selectedAccountTransactions}
                    >
                        <Column
                            title="Balance"
                            dataIndex="amount"
                            className='whitespace-nowrap'
                            sort
                            render={(value: TransactionType["amount"], data: TransactionType) => {
                                let modifiedBalance = formatCurrency(value, data.currency.symbol, data.currency.symbol_position, data.currency.decimal_places);
                                let isIncome = data.transaction_type === "income";
                                return (
                                    <p className={`${isIncome ? "text-light-green" : "text-light-red"}`}>
                                        {isIncome ? "+" : "-"} {modifiedBalance}
                                    </p>
                                );
                            }}
                        />
                        <Column
                            title='Exchange Rate'
                            dataIndex="exchange_rate"
                        />
                        <Column
                            dataIndex="category"
                            title="Category"
                            render={(value: TransactionType["category"]) => {
                                return value.name;
                            }}
                        />
                        <Column
                            title='Date'
                            dataIndex="created_at"
                            className='whitespace-nowrap'
                            sort
                            render={(value: TransactionType["created_at"]) => {
                                return (
                                    <p>{formatDateWithSuffix(value)}</p>
                                );
                            }}
                        />
                        <Column
                            title="Action"
                            dataIndex="id"
                            render={(value: TransactionType["id"]) => {
                                return (
                                    <div className='flex gap-4'>
                                        <NavLink to="/transactions" state={{ account_id: value }}>
                                            <FontAwesomeIcon icon={faEye} className='text-success text-[20px]' />
                                        </NavLink>
                                        <button onClick={() => handleEditCick(value)}>
                                            <FontAwesomeIcon icon={faEdit} className='text-primary text-[20px]' />
                                        </button>
                                        <button onClick={() => handleDeleteAccountClick(value)}>
                                            <FontAwesomeIcon icon={faTrash} className='text-danger text-[20px]' />
                                        </button>
                                    </div>
                                )
                            }}
                        />
                    </Table>
                </div>
            </div>
        </main >
    )
}

export default Transaction