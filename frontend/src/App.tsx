import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Login } from "./Pages/Auth/Login"
import { Register } from "./Pages/Auth/Register"
import { Dashboard } from "./Pages/Dashboard"
import { Master } from "./Layout/Auth"
import Guest from "./Layout/Guest/Guest"
import { EmailVerification } from "./Pages/Auth/Email"


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Guest />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<Master />}>
          <Route path="/email-verify" element={<EmailVerification />} />
          <Route path="" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
