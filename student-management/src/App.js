import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import StudentEnrollment from './pages/StudentEnrollment';
import FeesCalculator from './pages/FeesCalculator';
import IncomeExpenseForm from './pages/IncomeExpenseForm';
import PaymentSlip from './pages/PaymentSlip';
import MonthlyCalculationForm from './pages/MonthlyCalculation';
import StudentTeacherAllotment from './pages/StudentTeacherAllotment';


import ChooseUser from './pages/ChooseUser';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentNotebook from './pages/StudentNotebbok';
import StudentReportCard from './pages/StudentReportCard';
import LoginPageTeacher from  './pages/LoginPageTeacher';

const App = () => {
  return (
    <Router>
   
        <Routes>
          {/* <Route path="/" element={<LoginPage role="Admin" />} /> */}
          <Route path="/" element={<ChooseUser visitor="normal" />} />
          {/* <Route path="/chooseasguest" element={<ChooseUser visitor="guest" />} /> */}

          <Route path="/Adminlogin" element={<LoginPage role="Admin" />} />
          <Route path="/Admin/dashboard" element={<AdminDashboard />} />
          <Route path="/student/enrollment" element={<StudentEnrollment />} />
          <Route path="/fees-calculator" element={<FeesCalculator />} />
          <Route path="/income-expense" element={<IncomeExpenseForm />} />
          <Route path="/monthly-calculation" element={<MonthlyCalculationForm />} />
          <Route path="/payment-slip" element={<PaymentSlip />} />
          <Route path="/payment-slip" element={<PaymentSlip />} />
          <Route path="/student-allocation" element={<StudentTeacherAllotment />} />

        {/* Teacher part */}

          {/* <Route path="/" element={<ChooseUser visitor="normal" />} /> */}
          {/* <Route path="/Adminlogin" element={<LoginPage role="Admin" />} /> */}
          <Route path="/Teacherlogin" element={<LoginPageTeacher role="Teacher" />} />

          {/* <Route path="/TeacherDashboard" element={<TeacherDashboard />} /> */}

          <Route path="/Notebbok" element={<StudentNotebook/>} />
          
          {/* <Route path="/Adminregister" element={<AdminRegisterPage />} /> */}
          <Route path="/ReportCard" element={<StudentReportCard/>} />
          



          <Route path='*' element={<Navigate to="/" />} />
        </Routes> 

     

    </Router>
  )
}

export default App