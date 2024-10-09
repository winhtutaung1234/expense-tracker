import React, { ChangeEvent, createContext, FormHTMLAttributes, MouseEvent, ReactEventHandler, useEffect, useRef, useState } from 'react'
import { Modal } from '../../Components/Modal'
import { type Account as AccountType } from '../../Types/Account';
import { Currency as CurrencyType } from '../../Types/Currency';
import AccountService from '../../Services/Account';
import Currency from '../../Services/Currency';
import TransactionService from '../../Services/Transaction';
import { Column, Table } from '../../Components/Table';
import { TransactionForm as TransactionFormType, TransactionPageContext as TransactionPageContextType, Transaction as TransactionType } from '../../Types/Transaction';
import Category from '../../Services/Category';
import { Category as CategoryType } from '../../Types/Category';
import { NavLink, useLocation, useOutletContext } from 'react-router-dom';
import formatCurrency from '../../Utils/FormatCurrency';
import { formatDateWithSuffix } from '../../Utils/FormatDate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faEdit, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import getError from '../../Utils/getError';
import Error from '../../Components/Errors';
import Validator from '../../Validator';
import LineChart from '../../Components/Chart/LineChart';
import Logo from '../../Assets/Logo';
import { getChartData, parseDate } from './getTransactionChartData';
import { Data } from '../../Types/Props/LineChart';
import { Select } from '../../Components/Select';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import TransactionForm from './TransactionForm';
import { OutletContext } from '../../Types/Context';
import TransactionChart from './TransactionChart';


export type DefaultTransactionFormParameter = {
  firstTimeRender?: boolean;
  data?: Partial<TransactionType> | null;
};

export const TransactionPageContext = createContext<TransactionPageContextType | null>(null);

const NewTransaction = () => {
  const location = useLocation();
  const { state } = location;
  const { showNav, fixedNav } = useOutletContext<OutletContext>();

  //States
  const [allAccounts, setAllAccounts] = useState<AccountType[]>([]);
  const [allCurrencies, setAllCurrencies] = useState<CurrencyType[]>([]);
  const [allCategories, setAllCategories] = useState<CategoryType[]>([]);
  const [transactionFormData, setTransactionFormData] = useState<TransactionFormType>(createTransactionForm({ firstTimeRender: true }));

  //Form State
  const [showForm, setShowForm] = useState<boolean | undefined>();

  //Error
  const [transactionFormDataError, setTransactionFormDataError] = useState<Partial<Record<keyof TransactionFormType, string[]>>>();
  const resetErrorTimeoutRef = useRef<number | null>(null);

  //Modal
  const [showWarningModal, setShowWarningModal] = useState(false);

  //Delete
  const [selectedDeleteID, setSelectedDeleteID] = useState<string | number | null>(null);

  //Edit
  const [selectedEditID, setSelectedEditID] = useState<string | number | null>(null);

  //Selected Account Transactions + Account Balance
  const [selectedAccount, setSelectedAccount] = useState<AccountType | null>(null);
  const [selectedAccountTransactions, setSelectedAccountTransactions] = useState<TransactionType[]>([]);
  const [selectedAccountBalance, setSelectedAccountBalance] = useState<string | null>(null);


  //Fetch Necessary Data
  useEffect(() => {
    AccountService.fetchAccounts()
      .then((data) => {
        if (data) {
          setAllAccounts(data);
          if (!selectedAccount) {
            setSelectedAccount(data[0]);
            updateTransactionForm({ currency_id: data[0].currency_id })
          } else {
            const foundAccount = data.find(account => account.id == selectedAccount?.id);
            if (foundAccount) {
              updateTransactionForm({ currency_id: foundAccount.currency_id });
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
          updateTransactionForm({ currency_id: data[0].id });
        }
      })
      .catch(() => {
      })

    Category.getAll()
      .then((data) => {
        setAllCategories(data);
        updateTransactionForm({ category_id: data[0].id })
      })
      .catch(() => {
      })

    return cleanupOnUnmount
  }, [])

  useEffect(() => {
    if (selectedAccount) {
      updateTransactionForm({ account_id: selectedAccount.id })

      AccountService.getAccount(selectedAccount.id)
        .then((data) => {
          setAllAccounts(prevData => (prevData.map(account => account.id == selectedAccount.id ? data : account)))
          updateTransactionForm({ currency_id: data.currency_id });
          TransactionService.getTransactionsByAccount(selectedAccount.id)
            .then((data) => {
              setSelectedAccountTransactions(data);
            })
            .catch(() => {
            })
        })
        .catch(() => {
        })
    }
  }, [selectedAccount])

  useEffect(() => {
    let foundAccount;
    if (selectedAccount && allAccounts.length > 0) {
      foundAccount = allAccounts.find(account => account.id == selectedAccount.id);
    } else if (!selectedAccount && allAccounts.length > 0) {
      foundAccount = allAccounts[0];
    }

    if (foundAccount) {
      const accountBalance = formatCurrency(foundAccount.balance, "", foundAccount.currency.symbol_position, foundAccount.currency.decimal_places);
      setSelectedAccountBalance(`${accountBalance} ${foundAccount.currency.code}`)
    }
  }, [allAccounts])

  /* Start of Edit Transaction */
  const handleEditClick = (id: number | string) => {
    setSelectedEditID(id);
    TransactionService.getTransaction(id)
      .then((data) => {
        setTransactionFormData(createTransactionForm({ data: { ...data, date: parseDate(data.date) } }))
        setShowForm(true);
      })
      .catch(() => {
      })
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


  /* Utility and Helper Functions */

  function createTransactionForm({
    firstTimeRender = false,
    data = null
  }: DefaultTransactionFormParameter = {}): TransactionFormType {
    const defaultAccountId = allAccounts.length > 0 ? allAccounts[0].id : 0;

    return {
      account_id: data?.account_id || (state && state.account_id ? state.account_id : defaultAccountId),
      amount: data?.amount || "",
      category_id: data?.category_id || (allCategories.length > 0 ? allCategories[0].id : 0),
      currency_id: firstTimeRender
        ? (allCurrencies.length > 0 ? allCurrencies[0].id : 0)
        : (data?.account_id ? findAccount(data.account_id)?.currency_id || allCurrencies[0].id : (transactionFormData.account_id ? findAccount(transactionFormData.account_id)?.currency_id || allCurrencies[0].id : allCurrencies[0].id)),
      description: data?.description || "",
      transaction_type: data?.transaction_type || "income",
      date: data?.date || ""
    };
  }

  function resetErrorWithTimeout() {
    if (resetErrorTimeoutRef.current) {
      clearTimeout(resetErrorTimeoutRef.current);
    }
    resetErrorTimeoutRef.current = window.setTimeout(() => {
      setTransactionFormDataError({});
    }, 5000);
  }

  const validateTransactionForm = () => {
    return Validator(transactionFormData, {
      account_id: ['required'],
      amount: ['required'],
      category_id: ['required'],
      currency_id: ['required'],
      description: ['nullable'],
      transaction_type: ['required'],
      date: ['nullable'],
    }, setTransactionFormDataError)
  }

  const findAccount = (id: AccountType["id"]): AccountType | null =>
    allAccounts.find(account => account.id === id) || null;

  function updateTransactionForm(newData: Partial<TransactionType>) {
    setTransactionFormData(prevData => ({ ...prevData, ...newData }));
  }

  function cleanupOnUnmount() {
    if (resetErrorTimeoutRef.current) {
      clearTimeout(resetErrorTimeoutRef.current);
    }
  }

  return (
    <TransactionPageContext.Provider value={{
      allAccounts,
      setAllAccounts,
      selectedEditID,
      setSelectedEditID,
      transactionFormData,
      setTransactionFormData,
      selectedAccountTransactions,
      setSelectedAccountTransactions,
      allCurrencies,
      setAllCurrencies,
      allCategories,
      setAllCategories,
      selectedAccount,
      setSelectedAccount,
      updateTransactionForm
    }}>
      {showWarningModal && <Modal onConfirm={confirmDelete} onClose={rejectDelete} type='warning' confirmButtonText='Delete' text='Are you sure you want to delete this Transaction?' />}

      <div className={`text-white min-h-[200vh]`}>
        <div className={`z-10 sticky transition-al ${showNav ? (fixedNav ? "top-40" : "top-10") : "top-10"}`}>
          <div className='flex flex-wrap justify-between py-2 px-4 l shadow-md rounded-xl' style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(5px)", border: "1px solid rgba(253,228,96,0.5)", borderRight: "1px solid rgba(253,228,96,0.2)", borderTop: "1px solid rgba(253,228,96,0.2)" }}>
            <div className='flex flex-col'>
              <p className='font-inter opacity-75'>Your Balance</p>
              <div className='text-[32px] font-inter font-bold flex items-center gap-2'>
                <img src="/src/Assets/Flag/5546712_myanmar_asia_circle_country_flag_icon.png" className='w-10' />
                {selectedAccountBalance && selectedAccountBalance}
              </div>
            </div>
            <div className='flex flex-col items-end gap-2'>
              <p className='font-inter opacity-75'>Selected Account</p>
              <select
                name='account_id'
                value={transactionFormData.account_id}
                onChange={(e) => setSelectedAccount(findAccount(Number(e.target.value)))}
                className='bg-light-yellow text-black py-1 px-2 rounded-md'>
                {allAccounts && allAccounts.length > 0 && allAccounts.map(account => (
                  <option key={account.id} value={account.id}>{account.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <TransactionChart />
        <hr className='my-8 opacity-50' />
        <div className='flex gap-6 max-lg:flex-col min-h-[200vh]'>
          <TransactionForm
            showForm={showForm}
            setShowForm={setShowForm}
            createTransactionForm={createTransactionForm}
            resetErrorWithTimeout={resetErrorWithTimeout}
            validateTransactionForm={validateTransactionForm}
            transactionFormDataError={transactionFormDataError}
            setTransactionFormDataError={setTransactionFormDataError}
          />
          <div className={`${showForm ? "w-[70%]" : showForm != undefined ? "w-[100%]" : "w-[70%]"} transition-all`}>
            <div className='flex justify-between items-center mb-6'>
              <p className='font-inter text-[28px] font-light tracking-wide'>Transactions History</p>
              <button className='bg-login-button text-black py-2 px-5 rounded-lg shadow-md font-montserrat' onClick={() => setShowForm(prevData => !prevData)}>Add New Transaction</button>
            </div>
            <Table<TransactionType>
              dataSource={selectedAccountTransactions}
            >
              <Column
                title="Balance"
                dataIndex="amount"
                className='whitespace-nowrap'
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
                dataIndex="conversion"
                render={(value: TransactionType["conversion"]) => {
                  return value ? value.exchange_rate : "1";
                }}
              />
              <Column
                dataIndex="category"
                title="Category"
                render={(value: TransactionType["category"]) => (
                  <p className='text-center rounded-md inline-block py-1 px-2 shadow-md text-[14px]' style={{ color: value.text_color, background: value.background_color }}>{value.name}</p>
                )}
              />
              <Column
                title='Date'
                dataIndex="date"
                className='whitespace-nowrap'
                sort
                render={(value: TransactionType["date"]) => {
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
                      <button onClick={() => handleEditClick(value)}>
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
      </div>
    </TransactionPageContext.Provider >
  )
}

export default NewTransaction

{/* <TransactionForm
showForm={showForm}
setShowForm={setShowForm}
createTransactionForm={createTransactionForm}
resetErrorWithTimeout={resetErrorWithTimeout}
validateTransactionForm={validateTransactionForm}
transactionFormDataError={transactionFormDataError}
setTransactionFormDataError={setTransactionFormDataError}
updateTransactionForm={updateTransactionForm}
/> */}

{/* <div className={`flex justify-between py-2 px-4 sticky transition-all  z-10 ${showNav ? (fixedNav ? "top-40" : "top-10") : "top-10"} shadow-md rounded-xl`} style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(5px)", border: "1px solid rgba(253,228,96,0.5)", borderRight: "1px solid rgba(253,228,96,0.2)", borderTop: "1px solid rgba(253,228,96,0.2)" }}>
<div className='flex flex-col'>
  <p className='font-inter opacity-75'>Your Balance</p>
  <div className='text-[32px] font-inter font-bold flex items-center gap-2'>
    <img src="/src/Assets/Flag/5546712_myanmar_asia_circle_country_flag_icon.png" className='w-10' />
    {selectedAccountBalance && selectedAccountBalance}
  </div>
</div>
<div className='flex flex-col items-end gap-2'>
  <p className='font-inter opacity-75'>Selected Account</p>
  <select
    name='account_id'
    value={transactionFormData.account_id}
    onChange={(e) => updateTransactionForm({ account_id: Number(e.target.value) })}
    className='bg-light-yellow text-black py-1 px-2 rounded-md'>
    {allAccounts && allAccounts.length > 0 && allAccounts.map(account => (
      <option key={account.id} value={account.id}>{account.name}</option>
    ))}
  </select>
</div>
</div> */}