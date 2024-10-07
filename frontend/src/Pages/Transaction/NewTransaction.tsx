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
import { getChartData } from './getTransactionChartData';
import { Data } from '../../Types/Props/LineChart';
import { Select } from '../../Components/Select';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import TransactionForm from './TransactionForm';
import { OutletContext } from '../../Types/Context';
import TransactionChart from './TransactionChart';


export type DefaultTransactionFormParameter = {
  firstTimeRender?: boolean;
  data?: TransactionType | null;
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
  const [showForm, setShowForm] = useState<boolean>(true);

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
  const [selectedAccountTransactions, setSelectedAccountTransactions] = useState<TransactionType[]>([]);
  const [selectedAccountBalance, setSelectedAccountBalance] = useState<string | null>(null);


  //Fetch Necessary Data
  useEffect(() => {
    AccountService.fetchAccounts()
      .then((data) => {
        if (data) {
          setAllAccounts(data);
          if (!transactionFormData.account_id) {
            updateTransactionForm({ account_id: data[0].id, currency_id: data[0].currency_id })
          } else {
            const selectedAccount = data.find(account => account.id == transactionFormData.account_id);
            if (selectedAccount) {
              updateTransactionForm({ currency_id: selectedAccount.currency_id });
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

    if (transactionFormData.account_id) {
      TransactionService.getTransactionsByAccount(transactionFormData.account_id)
        .then((data) => {
          setSelectedAccountTransactions(data);
        })
        .catch(() => {
        })
    }

    return cleanupOnUnmount
  }, [])

  useEffect(() => {
    if (transactionFormData.account_id) {
      AccountService.getAccount(transactionFormData.account_id)
        .then((data) => {
          setAllAccounts(prevData => (prevData.map(account => account.id == transactionFormData.account_id ? data : account)))
          updateTransactionForm({ currency_id: data.currency_id });
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
      updateTransactionForm
    }}>
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
                onChange={(e) => updateTransactionForm({ [e.target.name]: e.target.value })}
                className='bg-light-yellow text-black py-1 px-2 rounded-md'>
                {allAccounts && allAccounts.length > 0 && allAccounts.map(account => (
                  <option key={account.id} value={account.id}>{account.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <TransactionChart />

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