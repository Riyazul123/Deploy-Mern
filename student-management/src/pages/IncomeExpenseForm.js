
// import React, { useState } from 'react';
// import { saveData, getData } from '../utils/localStorageUtils';
// import { Box, TextField, Button, Typography, Paper, Alert, Grid } from '@mui/material';
// import { styled } from '@mui/system';
// import NavbarScreen from './Navbar';
// import BackgroundImage from '../assets/backg.jpg';

// const IncomeExpenseForm = () => {
//     const [formData, setFormData] = useState({
//         income_head: '',
//         expense_head: '',
//         received_from: '',
//         amount: '',
//         date_time: new Date().toLocaleString(),
//     });

//     const [alertMessage, setAlertMessage] = useState('');
//     const [alertSeverity, setAlertSeverity] = useState('success');

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const existingData = getData('income_expense') || [];
//         saveData('income_expense', [...existingData, formData]);
//         setAlertMessage('Record saved successfully');
//         setAlertSeverity('success');
//         resetForm();
//     };

//     const resetForm = () => {
//         setFormData({
//             income_head: '',
//             expense_head: '',
//             received_from: '',
//             amount: '',
//             date_time: new Date().toLocaleString(),
//         });
//     };

//     return (
//         <>
//             <NavbarScreen />
//             <StyledBackground>
//                 <StyledOverlay />
//                 <StyledContainer>
//                     <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
//                         Income/Expense Form
//                     </Typography>
//                     <Paper elevation={3} sx={{ padding: 4, borderRadius: '8px' }}>
//                         {alertMessage && (
//                             <Alert severity={alertSeverity} sx={{ mb: 2 }}>
//                                 {alertMessage}
//                             </Alert>
//                         )}
//                         <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column' }}>
//                             <Grid container spacing={2}>
//                                 {/* First Row: Income Head and Expense Head */}
//                                 <Grid item xs={12} md={6}>
//                                     <StyledTextField
//                                         label="INCOME HEAD"
//                                         name="income_head"
//                                         value={formData.income_head}
//                                         onChange={handleChange}
//                                         fullWidth
//                                         required
//                                         variant="outlined"
//                                     />
//                                 </Grid>
//                                 <Grid item xs={12} md={6}>
//                                     <StyledTextField
//                                         label="EXPENSE HEAD"
//                                         name="expense_head"
//                                         value={formData.expense_head}
//                                         onChange={handleChange}
//                                         fullWidth
//                                         required
//                                         variant="outlined"
//                                     />
//                                 </Grid>

//                                 {/* Second Row: Received From and Amount */}
//                                 <Grid item xs={12} md={6}>
//                                     <StyledTextField
//                                         label="RECEIVED FROM"
//                                         name="received_from"
//                                         value={formData.received_from}
//                                         onChange={handleChange}
//                                         fullWidth
//                                         required
//                                         variant="outlined"
//                                     />
//                                 </Grid>
//                                 <Grid item xs={12} md={6}>
//                                     <StyledTextField
//                                         label="AMOUNT"
//                                         name="amount"
//                                         value={formData.amount}
//                                         onChange={handleChange}
//                                         fullWidth
//                                         required
//                                         variant="outlined"
//                                     />
//                                 </Grid>

//                                 {/* Single Full-Width Field for Date/Time */}
//                                 <Grid item xs={12}>
//                                     <StyledTextField
//                                         label="DATE/TIME"
//                                         name="date_time"
//                                         value={formData.date_time}
//                                         onChange={handleChange}
//                                         fullWidth
//                                         required
//                                         variant="outlined"
//                                     />
//                                 </Grid>
//                             </Grid>

//                             <StyledButton type="submit" variant="contained" fullWidth>
//                                 Submit
//                             </StyledButton>
//                         </Box>
//                     </Paper>
//                 </StyledContainer>
//             </StyledBackground>
//         </>
//     );
// };



import React, { useState } from 'react';
import { saveData, getData } from '../utils/localStorageUtils';
import { Box, TextField, Button, Typography, Paper, Alert, Grid, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { styled } from '@mui/system';
import NavbarScreen from './Navbar';
import BackgroundImage from '../assets/backg.jpg';

const IncomeExpenseForm = () => {
    const [formData, setFormData] = useState({
        inExp_type: '', // 'income' or 'expense'
        inExp_details: '',
        rec_send_name: '',
        amt_paid: '',
        payment_type: 'cash',
        cheque_number: '',
        cheque_date: ''
    });

    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    const [paymentType, setPaymentType] = useState('cash');
    const [chequeNumber, setChequeNumber] = useState('');
    const [chequeDate, setChequeDate] = useState(''); // Add this for the cheque date
    const baseUrl = process.env.REACT_APP_SERVER_URL;
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submissionData = {
            ...formData,
            cheque_number: paymentType === 'cheque' ? chequeNumber : null,
            cheque_date: paymentType === 'cheque' ? chequeDate : null, // Include cheque date if paymentType is 'cheque'
        };


        try {
            const response = await fetch(baseUrl+'/api/incexpentry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData),
            });
            const result = await response.json();
            if (response.ok) {
                setAlertMessage('Record saved successfully');
                setAlertSeverity('success');
                resetForm();
            } else {
                setAlertMessage(result.message || 'Error saving record');
                setAlertSeverity('error');
            }
        } catch (error) {
            setAlertMessage('Error connecting to server');
            setAlertSeverity('error');
        }
    };

    const resetForm = () => {
        setFormData({
            inExp_type: '',
            inExp_details: '',
            rec_send_name: '',
            amt_paid: '',
            payment_type: 'cash',
            cheque_number: '',
            cheque_date :''
        });
    };

    return (
        <>
            <NavbarScreen />
            <StyledBackground>
                <StyledOverlay />
                <StyledContainer>
                    <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
                        Income/Expense Form
                    </Typography>
                    <Paper elevation={3} sx={{ padding: 4, borderRadius: '8px' }}>
                        {alertMessage && (
                            <Alert severity={alertSeverity} sx={{ mb: 2 }}>
                                {alertMessage}
                            </Alert>
                        )}
                        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Grid container spacing={2}>
                                {/* Radio group for Income and Expense */}
                                <Grid item xs={12}>
                                    <RadioGroup
                                        value={formData.inExp_type}
                                        onChange={(e) => setFormData({ ...formData, inExp_type: e.target.value })}
                                        row
                                    >
                                        <FormControlLabel value="income" control={<Radio />} label="Income" />
                                        <FormControlLabel value="expense" control={<Radio />} label="Expense" />
                                    </RadioGroup>
                                </Grid>

                                {/* Fields for Income */}
                                {formData.inExp_type === 'income' && (
                                    <>
                                        <Grid item xs={12} md={6}>
                                            <StyledTextField
                                                label="Income Title"
                                                name="inExp_details"
                                                value={formData.inExp_details}
                                                onChange={handleChange}
                                                fullWidth
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <StyledTextField
                                                label="Received From"
                                                name="rec_send_name"
                                                value={formData.rec_send_name}
                                                onChange={handleChange}
                                                fullWidth
                                                required
                                            />
                                        </Grid>
                                    </>
                                )}

                                {/* Fields for Expense */}
                                {formData.inExp_type === 'expense' && (
                                    <>
                                        <Grid item xs={12} md={6}>
                                            <StyledTextField
                                                label="Expense Title"
                                                name="inExp_details"
                                                value={formData.inExp_details}
                                                onChange={handleChange}
                                                fullWidth
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <StyledTextField
                                                label="Expense To"
                                                name="rec_send_name"
                                                value={formData.rec_send_name}
                                                onChange={handleChange}
                                                fullWidth
                                                required
                                            />
                                        </Grid>
                                    </>
                                )}

                                {/* Payment Details */}
                                <Grid item xs={12}>
                                    <StyledTextField
                                        label="Amount"
                                        name="amt_paid"
                                        value={formData.amt_paid}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                    />
                                </Grid>

                                {/* Payment Type */}
                                <Grid item xs={12}>
                                    <RadioGroup
                                        value={paymentType}
                                        onChange={(e) => setPaymentType(e.target.value)}
                                        row
                                    >
                                        <FormControlLabel value="cash" control={<Radio />} label="Cash" />
                                        <FormControlLabel value="online" control={<Radio />} label="Online" />
                                        <FormControlLabel value="cheque" control={<Radio />} label="Cheque" />
                                    </RadioGroup>
                                </Grid>

                                {paymentType === 'cheque' && (
                                    <>
                                        <Grid item xs={12}>
                                            <StyledTextField
                                                label="Cheque Number"
                                                name="cheque_number"
                                                value={chequeNumber}
                                                onChange={(e) => setChequeNumber(e.target.value)}
                                                fullWidth
                                                required
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <StyledTextField
                                                label="Cheque Date"
                                                name="cheque_date"
                                                type="date"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={chequeDate}
                                                onChange={(e) => setChequeDate(e.target.value)}
                                                fullWidth
                                                required
                                            />
                                        </Grid>
                                    </>
                                )}


                            </Grid>

                            <StyledButton type="submit" variant="contained" fullWidth>
                                Submit
                            </StyledButton>
                        </Box>
                    </Paper>
                </StyledContainer>
            </StyledBackground>
        </>
    );
};

// Styled components for better structure and design (same as before)

// Styled components for better structure and design
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
    align-items: center;
    z-index: -1; /* Ensure the background stays behind other elements */
`;

const StyledOverlay = styled(Box)`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backdrop-filter: blur(8px); /* Apply the blur effect to the background */
    background-color: rgba(255, 255, 255, 0.2); /* Optional slight tint */
    z-index: -1;
`;

const StyledContainer = styled(Box)`
    max-width: 600px;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.9); /* Keep form area clean and readable */
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Soft shadow for a professional look */
    z-index: 1; /* Ensure it stays above the background */
`;

const StyledTextField = styled(TextField)`
    & .MuiOutlinedInput-root {
        border-radius: 8px; /* Smooth rounded edges for the input fields */
    }
`;

const StyledButton = styled(Button)`
    margin-top: 16px;
    background-color: #1976d2;
    color: white;
    padding: 10px 20px;
    font-size: 1rem;
    border-radius: 8px;
    &:hover {
        background-color: #0d47a1;
    }
`;

export default IncomeExpenseForm;
