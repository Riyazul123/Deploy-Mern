import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import StudentEnrollment from './pages/StudentEnrollment';
import FeesCalculator from './pages/FeesCalculator';
import IncomeExpenseForm from './pages/IncomeExpenseForm';
import PaymentSlip from './pages/PaymentSlip';
import MonthlyCalculationForm from './pages/MonthlyCalculation';

const App = () => {
  return (
    <Router>
   
        <Routes>
          <Route path="/" element={<LoginPage role="Admin" />} />
          {/* <Route path="/chooseasguest" element={<ChooseUser visitor="guest" />} /> */}

          <Route path="/Adminlogin" element={<LoginPage role="Admin" />} />
          <Route path="/Admin/dashboard" element={<AdminDashboard />} />
          <Route path="/student/enrollment" element={<StudentEnrollment />} />
          <Route path="/fees-calculator" element={<FeesCalculator />} />
          <Route path="/income-expense" element={<IncomeExpenseForm />} />
          <Route path="/monthly-calculation" element={<MonthlyCalculationForm />} />
          <Route path="/payment-slip" element={<PaymentSlip />} />
          <Route path='*' element={<Navigate to="/" />} />
        </Routes>

     

    </Router>
  )
}

export default App