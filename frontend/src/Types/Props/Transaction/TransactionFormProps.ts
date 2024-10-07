import { DefaultTransactionFormParameter } from "../../../Pages/Transaction/NewTransaction"
import { Account } from "../../Account"
import { Category } from "../../Category"
import { Currency } from "../../Currency"
import { Transaction, TransactionForm } from "../../Transaction"

type TransactionFormProps = {
    showForm: boolean,
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>,
    transactionFormDataError: Partial<Record<keyof TransactionForm, string[]>> | undefined,
    setTransactionFormDataError: React.Dispatch<React.SetStateAction<Partial<Record<keyof TransactionForm, string[]>> | undefined>>,
    createTransactionForm: (data?: DefaultTransactionFormParameter) => TransactionForm,
    resetErrorWithTimeout: () => void,
    validateTransactionForm: () => boolean,
}

export default TransactionFormProps