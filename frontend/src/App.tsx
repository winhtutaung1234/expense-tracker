import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Login } from "./Pages/Auth/Login"
import { Register } from "./Pages/Auth/Register"
import { Dashboard } from "./Pages/Dashboard"
import { Master } from "./Layout"


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Master />}>
          <Route path="" element={<Dashboard />} />

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
