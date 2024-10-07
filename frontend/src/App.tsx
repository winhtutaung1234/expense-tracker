import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Login } from "./Pages/Auth/Login"
import { Register } from "./Pages/Auth/Register"
import { Dashboard } from "./Pages/Dashboard"
import { Master } from "./Layout/Auth"
import Guest from "./Layout/Guest/Guest"
import { EmailVerification } from "./Pages/Auth/Email"
import EmailVerified from "./Pages/Auth/Email/EmailVerified"
import { Account } from "./Pages/Account"
import { NewTransaction, Transaction } from "./Pages/Transaction"


function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route element={<Guest />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="/email-verify" element={<EmailVerification />} />

        <Route path="/email-verified" element={<EmailVerified />} />

        <Route element={<Master />}>
          <Route path="" element={<Dashboard />} />

          <Route path="/accounts" element={<Account />} />

          <Route path="/transactions" element={<Transaction />} />

          <Route path="/transaction" element={<NewTransaction />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
