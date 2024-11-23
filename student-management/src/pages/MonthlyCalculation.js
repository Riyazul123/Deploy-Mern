// import React, { useState } from 'react';
// import { Box, Button, Typography, TextField, Card, CardContent } from '@mui/material';
// import styled from 'styled-components';
// import axios from 'axios'; // To make API calls
// import NavbarScreen from './Navbar';
// import BackgroundImage from '../assets/backg.jpg';

// const MonthlyCalculationForm = () => {
//     const [formData, setFormData] = useState({
//         fromDate: '',
//         toDate: ''
//     });

//     // const [result, setResult] = useState(null); // State to hold income and expense results

//     const [result, setResult] = useState({
//         incomeRows: [],
//         expenseRows: [],
//         totalIncome: "0.00",
//         totalExpense: "0.00",
//     });

//     const [error, setError] = useState(null); // Error handling state
//     const baseUrl = process.env.REACT_APP_SERVER_URL;
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value,
//         });
//     };

//     const handleSubmit = async () => {
//         try {
//             // const response = await axios.post(baseUrl + '/api/calculate-income-expense', formData);
//             const response = await axios.post('http://localhost:5000/api/calculate-income-expense', formData);
//             setResult(response.data); // Assuming the API returns income and expense
//             setError(null); // Reset any error
//         } catch (err) {
//             setError('Error fetching data. Please try again.');
//         }
//     };

//     return (
//         <>
//             <NavbarScreen />
//             <StyledBackground>
//                 <StyledOverlay />
//                 <StyledContainer>
//                     <StyledCard>
//                         <CardContent>
//                             <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
//                                 Monthly Calculation
//                             </Typography>
//                             <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
//                                 <StyledTextField
//                                     label="From Date"
//                                     name="fromDate"
//                                     type="date"
//                                     value={formData.fromDate}
//                                     onChange={handleChange}
//                                     fullWidth
//                                     required
//                                     InputLabelProps={{ shrink: true }}
//                                 />
//                                 <StyledTextField
//                                     label="To Date"
//                                     name="toDate"
//                                     type="date"
//                                     value={formData.toDate}
//                                     onChange={handleChange}
//                                     fullWidth
//                                     required
//                                     InputLabelProps={{ shrink: true }}
//                                 />
//                                 <StyledButton
//                                     variant="contained"
//                                     color="primary"
//                                     onClick={handleSubmit}
//                                 >
//                                     Calculate
//                                 </StyledButton>
//                             </Box>
//                             {/* 
//                             {result && (
//                                 <Box sx={{ mt: 4 }}>
//                                     <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
//                                         Income: Rs. {result.income}
//                                     </Typography>
//                                     <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
//                                         Expense: Rs. {result.expense}
//                                     </Typography>
//                                 </Box>
//                             )} */}

//                             {result && (
//                                 <div>
//                                     <h2>Income and Expense Details</h2>
//                                     <table border="1">
//                                         <thead>
//                                             <tr>
//                                                 <th>Date</th>
//                                                 <th>Income Head</th>
//                                                 <th>Received From</th>
//                                                 <th>Amount</th>
//                                                 <th>Date</th>
//                                                 <th>Expenses Head</th>
//                                                 <th>Payment To</th>
//                                                 <th>Amount</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {/* Render Income Rows */}
//                                             {(result.incomeRows || []).map((row, index) => (
//                                                 <tr key={`income-${index}`}>
//                                                     <td>{row.date}</td>
//                                                     <td>{row.incomeHead}</td>
//                                                     <td>{row.receivedFrom}</td>
//                                                     <td>{row.amount}</td>
//                                                     <td></td>
//                                                     <td></td>
//                                                     <td></td>
//                                                     <td></td>
//                                                 </tr>
//                                             ))}
//                                             {/* Render Expense Rows */}
//                                             {(result.expenseRows || []).map((row, index) => (
//                                                 <tr key={`expense-${index}`}>
//                                                     <td></td>
//                                                     <td></td>
//                                                     <td></td>
//                                                     <td></td>
//                                                     <td>{row.date}</td>
//                                                     <td>{row.expensesHead}</td>
//                                                     <td>{row.paymentTo}</td>
//                                                     <td>{row.amount}</td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                         <tfoot>
//                                             <tr>
//                                                 <td colSpan="3">Total Income</td>
//                                                 <td>{result.totalIncome}</td>
//                                                 <td colSpan="3">Total Expense</td>
//                                                 <td>{result.totalExpense}</td>
//                                             </tr>
//                                         </tfoot>
//                                     </table>
//                                 </div>
//                             )}



//                             {result && result.incomeRows?.length === 0 && result.expenseRows?.length === 0 && (
//                                 <Typography>No data available for the selected date range.</Typography>
//                             )}

//                         </CardContent>
//                     </StyledCard>
//                 </StyledContainer>
//             </StyledBackground>
//         </>
//     );
// };

// const StyledTextField = styled(TextField)`
//     & .MuiOutlinedInput-root {
//         border-radius: 8px;
//     }
// `;

// const StyledButton = styled(Button)`
//     height: 56px; /* Match height of text fields */
//     flex-shrink: 0; /* Prevent the button from shrinking */
//     white-space: nowrap; /* Prevent button text from wrapping */
//     padding: 0 24px;
// `;

// const StyledBackground = styled(Box)`
//     position: fixed;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background-image: url(${BackgroundImage});
//     background-size: cover;
//     background-position: center;
//     display: flex;
//     justify-content: center; /* Center horizontally */
//     align-items: flex-start; /* Align closer to the top */
//     padding-top: 100px; /* Add padding for spacing from the top */
//     z-index: -1;
// `;

// const StyledOverlay = styled(Box)`
//     position: fixed;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     backdrop-filter: blur(8px); 
//     background-color: rgba(255, 255, 255, 0.2);
//     z-index: -1;
// `;

// const StyledContainer = styled(Box)`
//     width: 100%;
//     max-width: 1200px;            /* Limit width for better readability */
//     padding: 40px 20px;           /* Add padding for better spacing */
//     margin: 0 auto;               /* Center the form horizontally */
//     display: flex;
//     justify-content: center;
// `;

// const StyledCard = styled(Card)`
//     width: 100%;
//     max-width: 600px;             /* Limit the max-width */
//     padding: 20px;
//     border-radius: 12px;
//     box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15); /* Softer shadow for a professional look */
//     background-color: rgba(255, 255, 255, 0.95);
// `;

// export default MonthlyCalculationForm;


import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';
import NavbarScreen from './Navbar';
import BackgroundImage from '../assets/backg.jpg';
import * as XLSX from 'xlsx'; // Import XLSX


const MonthlyCalculationForm = () => {
  const baseUrl = process.env.REACT_APP_SERVER_URL;
  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
  });

  const [result, setResult] = useState({
    incomeRows: [],
    expenseRows: [],
    totalIncome: '0.00',
    totalExpense: '0.00',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true); 
    try {
      const response = await axios.post(baseUrl+'/api/calculate-income-expense', formData);
      setResult(response.data);
      setError(null);
    } catch (err) {
      setError('Error fetching data. Please try again.');
    }
    finally {
      setLoading(false); // Stop the loader
    }
  };
  // Export to Excel
  const handleExportToExcel = () => {
    setLoading(true); 
    try{

   
    const incomeSheet = XLSX.utils.json_to_sheet(result.incomeRows);
    const expenseSheet = XLSX.utils.json_to_sheet(result.expenseRows);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, incomeSheet, 'Income');
    XLSX.utils.book_append_sheet(workbook, expenseSheet, 'Expenses');

    // Add summary as a separate sheet
    const summary = [
      { Metric: 'Total Income', Amount: result.totalIncome },
      { Metric: 'Total Expense', Amount: result.totalExpense },
    ];
    const summarySheet = XLSX.utils.json_to_sheet(summary);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Save the workbook
    XLSX.writeFile(workbook, `Monthly_Calculation_${formData.fromDate}_to_${formData.toDate}.xlsx`);
  }catch (err) {
      setError('Error fetching data. Please try again.');
    }
    finally {
      setLoading(false); // Stop the loader
    }
  
  };


  return (
    <>
      <NavbarScreen />
      <StyledBackground>
        <StyledOverlay />
        <StyledContainer>
          <StyledCard>
            <CardContent>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
                Monthly Calculation
              </Typography>
              <StyledForm>
                <StyledTextField
                  label="From Date"
                  name="fromDate"
                  type="date"
                  value={formData.fromDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
                <StyledTextField
                  label="To Date"
                  name="toDate"
                  type="date"
                  value={formData.toDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
                <StyledButton variant="contained" onClick={handleSubmit}>
                   {loading ? 'Wait...' : 'Calculate'}
                </StyledButton>
              </StyledForm>

              {result && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Income and Expense Details
                  </Typography>
                  <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                    <Table>
                      <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                          <StyledTableCell>Date</StyledTableCell>
                          <StyledTableCell>Income Head</StyledTableCell>
                          <StyledTableCell>Received From</StyledTableCell>
                          <StyledTableCell>Amount</StyledTableCell>

                          <StyledTableCell></StyledTableCell>

                          <StyledTableCell>Date</StyledTableCell>
                          <StyledTableCell>Expenses Head</StyledTableCell>
                          <StyledTableCell>Payment To</StyledTableCell>
                          <StyledTableCell>Amount</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(result.incomeRows || []).map((row, index) => (
                          <TableRow key={`income-${index}`}>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.incomeHead}</TableCell>
                            <TableCell>{row.receivedFrom}</TableCell>
                            <TableCell>{row.amount}</TableCell>
                            <TableCell />
                            <TableCell />
                            <TableCell />
                            <TableCell />
                            <TableCell />
                          </TableRow>
                        ))}
                        {(result.expenseRows || []).map((row, index) => (
                          <TableRow key={`expense-${index}`}>
                            <TableCell />
                            <TableCell />
                            <TableCell />
                            <TableCell />

                            <TableCell />

                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.expensesHead}</TableCell>
                            <TableCell>{row.paymentTo}</TableCell>
                            <TableCell>{row.amount}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} sx={{ fontWeight: 'bold' }}>
                            Total Income
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>{result.totalIncome}</TableCell>
                          <TableCell></TableCell>
                          <TableCell colSpan={3} sx={{ fontWeight: 'bold' }}>
                            Total Expense
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>{result.totalExpense}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {result.incomeRows.length === 0 && result.expenseRows.length === 0 && (
                <Typography sx={{ mt: 2, color: '#888' }}>No data available for the selected date range.</Typography>
              )}

              {error && (
                <Box sx={{ mt: 2 }}>
                  <Typography color="error">{error}</Typography>
                </Box>
              )}

              {result.incomeRows.length > 0 || result.expenseRows.length > 0 ? (
                <StyledButton variant="contained" sx={{ mt: 2 }} onClick={handleExportToExcel}>
                   {loading ? 'Wait...' : 'Download Excel'}
                </StyledButton>
              ) : null}

            </CardContent>
          </StyledCard>
        </StyledContainer>
      </StyledBackground>
    </>
  );
};

const StyledForm = styled(Box)`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const StyledTextField = styled(TextField)`
  flex: 1;
  & .MuiOutlinedInput-root {
    border-radius: 8px;
  }
`;

const StyledButton = styled(Button)`
  height: 56px;
  white-space: nowrap;
  background-color: #1976d2;
  &:hover {
    background-color: #115293;
  }
`;

const StyledTableCell = styled(TableCell)`
  font-weight: bold;
  text-align: center;
`;

const StyledBackground = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${BackgroundImage});
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 100px;
  z-index: -1;
  overflow: scroll;
`;

const StyledOverlay = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.2);
  z-index: -1;
`;

const StyledContainer = styled(Box)`
  width: 100%;
  max-width: 1200px;
  padding: 40px 20px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
`;

const StyledCard = styled(Card)`
  width: 100%;

  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  background-color: rgba(255, 255, 255, 0.95);
`;

export default MonthlyCalculationForm;
