import { Account } from "../Account";
import { Category } from "../Category";
import { Currency } from "../Currency";
import { Transaction, TransactionForm } from ".";

type TransactionPageContext = {
    allAccounts: Account[],
    setAllAccounts: React.Dispatch<React.SetStateAction<Account[]>>,
    selectedEditID: string | number | null,
    setSelectedEditID: React.Dispatch<React.SetStateAction<string | number | null>>,
    transactionFormData: TransactionForm,
    setTransactionFormData: React.Dispatch<React.SetStateAction<TransactionForm>>,
    selectedAccountTransactions: Transaction[],
    setSelectedAccountTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
    allCurrencies: Currency[],
    setAllCurrencies: React.Dispatch<React.SetStateAction<Currency[]>>,
    allCategories: Category[],
    setAllCategories: React.Dispatch<React.SetStateAction<Category[]>>,
    selectedAccount: Account | null,
    setSelectedAccount: React.Dispatch<React.SetStateAction<Account | null>>,
    updateTransactionForm: (newData: Partial<Transaction>) => void;
}

export default TransactionPageContext;