// import React, { useState } from 'react';
// import { getData } from '../utils/localStorageUtils';
// import { Box, TextField, Button, Typography, Paper, Alert } from '@mui/material';
// import { styled } from '@mui/system';
// import NavbarScreen from './Navbar';
// import BackgroundImage from '../assets/backg.jpg';


// const FeesCalculator = () => {
//     const [studentId, setStudentId] = useState('');
//     const [studentData, setStudentData] = useState(null);
//     const [amountPaid, setAmountPaid] = useState('');
//     const [paymentStatus, setPaymentStatus] = useState('');

//     const handleFetch = () => {
//         const students = getData('students') || [];
//         const student = students.find(stud => stud.id === studentId);
//         if (student) {
//             setStudentData(student);
//             setPaymentStatus('');
//         } else {
//             setPaymentStatus('Student not found');
//         }
//     };

//     const handlePayment = () => {
//         if (amountPaid && studentData) {
//             // Here you can add your payment logic
//             setPaymentStatus('Payment successful');
//             setAmountPaid(''); // Reset amount paid after successful payment
//         } else {
//             setPaymentStatus('Please enter a valid amount');
//         }
//     };

//     return (
//         <>
//            <NavbarScreen/>
//          <StyledBackground/>

//         <StyledContainer>
//             <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#333'}}>
//                 Fees Calculator
//             </Typography>
//             <Paper elevation={3} sx={{ padding: 4, borderRadius: '8px' }}>
//                 <TextField
//                     label="Student ID"
//                     fullWidth
//                     margin="normal"
//                     value={studentId}
//                     onChange={(e) => setStudentId(e.target.value)}
//                 />
//                 <Button onClick={handleFetch} variant="contained" color="primary" fullWidth>
//                     Fetch Student
//                 </Button>

//                 {paymentStatus && (
//                     <Alert severity={paymentStatus === 'Payment successful' ? 'success' : 'error'} sx={{ mt: 2 }}>
//                         {paymentStatus}
//                     </Alert>
//                 )}

//                 {studentData && (
//                     <>
//                         <Typography variant="h6" sx={{ mt: 4 }}>Student Details:</Typography>
//                         <Typography variant="body1">Name: {studentData.student_name}</Typography>
//                         <Typography variant="body1">Fees: ${studentData.fees}</Typography>
//                         <TextField
//                             label="Amount Paid"
//                             fullWidth
//                             margin="normal"
//                             value={amountPaid}
//                             onChange={(e) => setAmountPaid(e.target.value)}
//                         />
//                         <Button onClick={handlePayment} variant="contained" color="primary" fullWidth>
//                             Pay Fees
//                         </Button>
//                     </>
//                 )}
//             </Paper>
//         </StyledContainer>

//         </>

//     );
// };

// const StyledBackground = styled(Box)`
//     position: fixed;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background-image: url(${BackgroundImage});
//     background-size: cover;
//     background-position: center;
//     z-index: -1;
//     filter: blur(8px); /* Blur only the background image */
// `;

// const StyledContainer = styled(Box)`
//     max-width: 800px;
//     margin: 80px auto;
//     padding: 20px;
//     background-color: rgba(255, 255, 255, 0.8); /* semi-transparent white */
//     border-radius: 8px;
//     box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
//     z-index: 1;
//     position: relative; /* Keep form content above the background */
// `;

// const StyledTextField = styled(TextField)`
//     margin-top: 16px;
//     & .MuiOutlinedInput-root {
//         border-radius: 8px;
//     }
// `;

// const StyledButton = styled(Button)`
//     margin-top: 16px;
//     background-color: #1976d2;
//     color: white;
//     padding: 10px 20px;
//     font-size: 1rem;
//     border-radius: 8px;
//     &:hover {
//         background-color: #0d47a1;
//     }
// `;

// export default FeesCalculator;

// import React, { useState } from 'react';
// import { getData } from '../utils/localStorageUtils';
// import {
//     Box,
//     TextField,
//     Button,
//     Typography,
//     Paper,
//     Alert,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//     Radio,
//     RadioGroup,
//     FormControlLabel,
// } from '@mui/material';
// import { styled } from '@mui/system';
// import NavbarScreen from './Navbar';
// import BackgroundImage from '../assets/backg.jpg';

// const FeesCalculator = () => {
//     const [studentIdOrName, setStudentIdOrName] = useState('');
//     const [studentData, setStudentData] = useState(null);
//     const [amountPaid, setAmountPaid] = useState('');
//     const [lateFine, setLateFine] = useState('');
//     const [discount, setDiscount] = useState('');
//     const [details, setDetails] = useState('');
//     const [paymentType, setPaymentType] = useState('cash');
//     const [dialogOpen, setDialogOpen] = useState(false);
//     const [paymentStatus, setPaymentStatus] = useState('');

//     const handleFetch = async () => {
//         const response = await fetch(`http://localhost:5000/api/fees?search=${studentIdOrName}`);
//         const data = await response.json();

//         if (data && data.length > 0) {
//             setStudentData(data[0]); // Assuming you get an array of students
//             setPaymentStatus('');
//             setDialogOpen(true);
//         } else {
//             setPaymentStatus('Student not found');
//         }
//     };

//     const handlePayment = () => {
//         if (amountPaid && studentData) {
//             // Here you can add your payment logic
//             setPaymentStatus('Payment successful');
//             setDialogOpen(false); // Close the dialog
//             // Reset fields
//             setAmountPaid('');
//             setLateFine('');
//             setDiscount('');
//             setDetails('');
//         } else {
//             setPaymentStatus('Please enter a valid amount');
//         }
//     };

//     const handleCloseDialog = () => {
//         setDialogOpen(false);
//         setStudentData(null); // Reset student data
//         setStudentIdOrName(''); // Reset search input
//     };

//     return (
//         <>
//             <NavbarScreen />
//             <StyledBackground />
//             <StyledContainer>
//                 <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#333' }}>
//                     Fees Calculator
//                 </Typography>
//                 <Paper elevation={3} sx={{ padding: 4, borderRadius: '8px' }}>
//                     <TextField
//                         label="Student ID or Name"
//                         fullWidth
//                         margin="normal"
//                         value={studentIdOrName}
//                         onChange={(e) => setStudentIdOrName(e.target.value)}
//                     />
//                     <Button onClick={handleFetch} variant="contained" color="primary" fullWidth>
//                         Fetch Student
//                     </Button>

//                     {paymentStatus && (
//                         <Alert severity={paymentStatus === 'Payment successful' ? 'success' : 'error'} sx={{ mt: 2 }}>
//                             {paymentStatus}
//                         </Alert>
//                     )}
//                 </Paper>

//                 {/* <Dialog open={dialogOpen} onClose={handleCloseDialog}>
//                     <DialogTitle>Student Payment Details</DialogTitle>
//                     <DialogContent>
//                         {studentData && (
//                             <Box>
//                                 <Typography variant="h6">Student ID: {studentData.id}</Typography>
//                                 <Typography variant="h6">Name: {studentData.student_name}</Typography>
//                                 <Typography variant="h6">Fees: Rs. {studentData.fees}</Typography>
//                                 <TextField
//                                     label="Amount Paid"
//                                     fullWidth
//                                     margin="normal"
//                                     value={amountPaid}
//                                     onChange={(e) => setAmountPaid(e.target.value)}
//                                 />
//                                 <TextField
//                                     label="Late Fine"
//                                     fullWidth
//                                     margin="normal"
//                                     value={lateFine}
//                                     onChange={(e) => setLateFine(e.target.value)}
//                                 />
//                                 <TextField
//                                     label="Discount Amount"
//                                     fullWidth
//                                     margin="normal"
//                                     value={discount}
//                                     onChange={(e) => setDiscount(e.target.value)}
//                                 />
//                                 <TextField
//                                     label="Additional Details"
//                                     fullWidth
//                                     margin="normal"
//                                     value={details}
//                                     onChange={(e) => setDetails(e.target.value)}
//                                 />
//                                 <Typography variant="body1" sx={{ mt: 2 }}>Payment Type</Typography>
//                                 <RadioGroup
//                                     value={paymentType}
//                                     onChange={(e) => setPaymentType(e.target.value)}
//                                     row
//                                 >
//                                     <FormControlLabel value="cash" control={<Radio />} label="Cash" />
//                                     <FormControlLabel value="online" control={<Radio />} label="Online" />
//                                 </RadioGroup>
//                             </Box>
//                         )}
//                     </DialogContent>
//                     <DialogActions>
//                         <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
//                         <Button onClick={handlePayment} color="primary">Pay Fees</Button>
//                     </DialogActions>
//                 </Dialog> */}
//                 <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
//                     <DialogTitle sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: '#1976d2' }}>
//                         <span style={{ marginRight: '8px' }}>💳</span>
//                         Student Payment Details
//                     </DialogTitle>
//                     <DialogContent>
//                         {studentData && (
//                             <Box sx={{ padding: 2 }}>
//                                 <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Student ID: {studentData.enrollment_id}</Typography>
//                                 <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Name: {studentData.student_name}</Typography>
//                                 <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50' }}>Fees: ₹{studentData.fees}</Typography>

//                                 <Box sx={{ marginTop: 2 }}>
//                                     <TextField
//                                         label="Amount Paid"
//                                         fullWidth
//                                         margin="normal"
//                                         value={amountPaid}
//                                         onChange={(e) => setAmountPaid(e.target.value)}
//                                         variant="outlined"
//                                         sx={{ borderRadius: '8px' }}
//                                     />
//                                     <TextField
//                                         label="Late Fine"
//                                         fullWidth
//                                         margin="normal"
//                                         value={lateFine}
//                                         onChange={(e) => setLateFine(e.target.value)}
//                                         variant="outlined"
//                                         sx={{ borderRadius: '8px' }}
//                                     />
//                                     <TextField
//                                         label="Discount Amount"
//                                         fullWidth
//                                         margin="normal"
//                                         value={discount}
//                                         onChange={(e) => setDiscount(e.target.value)}
//                                         variant="outlined"
//                                         sx={{ borderRadius: '8px' }}
//                                     />
//                                     <TextField
//                                         label="Additional Details"
//                                         fullWidth
//                                         margin="normal"
//                                         value={details}
//                                         onChange={(e) => setDetails(e.target.value)}
//                                         variant="outlined"
//                                         sx={{ borderRadius: '8px' }}
//                                     />
//                                 </Box>

//                                 <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>Payment Type</Typography>
//                                 <RadioGroup
//                                     value={paymentType}
//                                     onChange={(e) => setPaymentType(e.target.value)}
//                                     row
//                                 >
//                                     <FormControlLabel value="cash" control={<Radio />} label="Cash" />
//                                     <FormControlLabel value="online" control={<Radio />} label="Online" />
//                                 </RadioGroup>
//                             </Box>
//                         )}
//                     </DialogContent>
//                     <DialogActions>
//                         <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
//                         <Button onClick={handlePayment} color="primary" variant="contained">Pay Fees</Button>
//                     </DialogActions>
//                 </Dialog>

//             </StyledContainer>
//         </>
//     );
// };

// const StyledBackground = styled(Box)`
//     position: fixed;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background-image: url(${BackgroundImage});
//     background-size: cover;
//     background-position: center;
//     z-index: -1;
//     filter: blur(8px);
// `;

// const StyledContainer = styled(Box)`
//     max-width: 800px;
//     margin: 80px auto;
//     padding: 20px;
//     background-color: rgba(255, 255, 255, 0.8);
//     border-radius: 8px;
//     box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
//     z-index: 1;
//     position: relative;
// `;

// const StyledTextField = styled(TextField)`
//     margin-top: 16px;
//     & .MuiOutlinedInput-root {
//         border-radius: 8px;
//     }
// `;

// const StyledButton = styled(Button)`
//     margin-top: 16px;
//     background-color: #1976d2;
//     color: white;
//     padding: 10px 20px;
//     font-size: 1rem;
//     border-radius: 8px;
//     &:hover {
//         background-color: #0d47a1;
//     }
// `;

// export default FeesCalculator;
import React, { useState } from 'react';
import { getData } from '../utils/localStorageUtils';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Radio,
    RadioGroup,
    FormControlLabel,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import { styled } from '@mui/system';
import NavbarScreen from './Navbar';
import BackgroundImage from '../assets/backg.jpg';

const FeesCalculator = () => {
    const [studentIdOrName, setStudentIdOrName] = useState('');
    const [studentData, setStudentData] = useState(null);
    const [amountPaid, setAmountPaid] = useState('');
    const [lateFine, setLateFine] = useState('');
    const [discount, setDiscount] = useState('');
    const [details, setDetails] = useState('');
    const [paymentType, setPaymentType] = useState('cash');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [studentList, setStudentList] = useState([]); // New state for list of students
    const [paymentStatus, setPaymentStatus] = useState('');
    const [chequeNumber, setChequeNumber] = useState('');

    const baseUrl = process.env.REACT_APP_SERVER_URL;
    const handleFetch = async () => {
        const response = await fetch(`${baseUrl}/api/fees?search=${studentIdOrName}`);
        const data = await response.json();

        if (data && data.length > 0) {
            setStudentList(data); // Set the list of students
            setPaymentStatus('');
            setDialogOpen(true);
        } else {
            setPaymentStatus('Student not found');
        }
    };

    const handleSelectStudent = (student) => {
        setStudentData(student); // Set the selected student data
        setDialogOpen(false); // Close the student list dialog
        // Open the payment dialog
        setDialogOpen(true);
    };

    // const handlePayment = async () => {
    //     if (amountPaid && studentData) {
    //         const feeData = {
    //             student_enrollment_id: studentData.enrollment_id,
    //             fees: studentData.fees,
    //             amt_paid: amountPaid,
    //             late_fine: lateFine === '' ? null : lateFine,
    //             disc_amt: discount  === '' ? null : discount,
    //             payment_details: details,
    //             cheque_number: paymentType === 'cheque' ? chequeNumber : null, // Only include cheque number if payment type is cheque
    //         };
    
    //         try {
    //             const response = await fetch('http://localhost:5000/api/createfees', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify(feeData),
    //             });
    
    //             const result = await response.json();
    //             if (response.ok) {
    //                 setPaymentStatus('Payment successful');
    //                 setDialogOpen(false);
    //                 // Reset fields
    //                 setAmountPaid('');
    //                 setLateFine('');
    //                 setDiscount('');
    //                 setDetails('');
    //                 setChequeNumber('');
    //             } else {
    //                 setPaymentStatus(result.message || 'Error processing payment');
    //             }
    //         } catch (error) {
    //             setPaymentStatus('Error connecting to server');
    //         }
    //     } else {
    //         setPaymentStatus('Please enter a valid amount');
    //     }
    // };
    
    const handlePayment = async () => {
        // Check if amountPaid is a valid number
        if (!amountPaid || isNaN(amountPaid)) {
            setPaymentStatus('Please enter a valid amount');
            return;
        }
    
        if (studentData) {
            const feeData = {
                student_enrollment_id: studentData.enrollment_id,
                fees: studentData.fees,
                amt_paid: parseFloat(amountPaid), // Convert to number
                late_fine: lateFine ? parseFloat(lateFine) : null, // Convert to number or null
                disc_amt: discount ? parseFloat(discount) : null, // Convert to number or null
                payment_details: details || null,
                payment_type: paymentType,
                cheque_number: paymentType === 'cheque' ? chequeNumber : null, // Include cheque number if selected
            };
    
            try {
                const response = await fetch('http://localhost:5000/api/createfees', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(feeData),
                });
    
                const result = await response.json();
                if (response.ok) {
                    setPaymentStatus('Payment successful');
                    setDialogOpen(false);
                    // Reset fields
                    setAmountPaid('');
                    setLateFine('');
                    setDiscount('');
                    setDetails('');
                    setChequeNumber('');
                } else {
                    setPaymentStatus(result.message || 'Error processing payment');
                }
            } catch (error) {
                console.error('Error:', error); // Log the error to console for debugging
                setPaymentStatus('Error connecting to server');
            }
        } else {
            setPaymentStatus('Student data is missing');
        }
    };
    
    const handleCloseDialog = () => {
        setDialogOpen(false);
        setStudentData(null); // Reset student data
        setStudentIdOrName(''); // Reset search input
        setStudentList([]); // Clear student list
    };

    return (
        <>
            <NavbarScreen />
            <StyledBackground />
            <StyledContainer>
                <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#333' }}>
                    Fees Calculator
                </Typography>
                <Paper elevation={3} sx={{ padding: 4, borderRadius: '8px' }}>
                    <TextField
                        label="Student ID or Name"
                        fullWidth
                        margin="normal"
                        value={studentIdOrName}
                        onChange={(e) => setStudentIdOrName(e.target.value)}
                    />
                    <StyledButton onClick={handleFetch} variant="contained" sx={{ mt: 2 }}>
                        Fetch Student
                    </StyledButton>

                    
                </Paper>

                {/* Student List Dialog */}
                {/* <Dialog open={dialogOpen && studentList.length > 0} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                    <DialogTitle>Select a Student</DialogTitle>
                    <DialogContent>
                        <List>
                            {studentList.map((student) => (
                                <ListItem button key={student.enrollment_id} onClick={() => handleSelectStudent(student)}>
                                    <ListItemText primary={student.student_name} secondary={`ID: ${student.enrollment_id}`} />
                                </ListItem>
                            ))}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
                    </DialogActions>
                </Dialog> */}
                <Dialog open={dialogOpen && studentList.length > 0} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                    <DialogTitle sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        Select a Student for Payment
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" sx={{ marginBottom: 1 }}>
                            Please select a student from the list below to proceed with the payment. You can click on a student's name to view their payment details.
                        </Typography>
                        <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                            {studentList.map((student) => (
                                <ListItem button key={student.enrollment_id} onClick={() => handleSelectStudent(student)}>
                                    <ListItemText
                                        primary={student.student_name}
                                        secondary={`ID: ${student.enrollment_id}`}
                                        primaryTypographyProps={{ fontWeight: 'bold' }}
                                        secondaryTypographyProps={{ color: 'text.secondary' }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="error" variant="outlined">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>


                {/* Payment Dialog */}
                <Dialog open={dialogOpen && studentData} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                {paymentStatus && (
                        <Alert severity={paymentStatus === 'Payment successful' ? 'success' : 'error'} sx={{ mt: 2 }}>
                            {paymentStatus}
                        </Alert>
                    )}
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: '#1976d2' }}>
                        <span style={{ marginRight: '8px' }}>💳</span>
                        Student Payment Details
                    </DialogTitle>
                    <DialogContent>
                        {studentData && (
                            <Box sx={{ padding: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Student ID: {studentData.enrollment_id}</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Name: {studentData.student_name}</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50' }}>Fees: ₹{studentData.fees}</Typography>

                                <Box sx={{ marginTop: 2 }}>
                                    <TextField
                                        label="Amount Paid"
                                        fullWidth
                                        margin="normal"
                                        value={amountPaid}
                                        onChange={(e) => setAmountPaid(e.target.value)}
                                        variant="outlined"
                                        sx={{ borderRadius: '8px' }}
                                    />
                                    <TextField
                                        label="Late Fine"
                                        fullWidth
                                        margin="normal"
                                        value={lateFine}
                                        onChange={(e) => setLateFine(e.target.value)}
                                        variant="outlined"
                                        sx={{ borderRadius: '8px' }}
                                    />
                                    <TextField
                                        label="Discount Amount"
                                        fullWidth
                                        margin="normal"
                                        value={discount}
                                        onChange={(e) => setDiscount(e.target.value)}
                                        variant="outlined"
                                        sx={{ borderRadius: '8px' }}
                                    />
                                    <TextField
                                        label="Additional Details"
                                        fullWidth
                                        margin="normal"
                                        value={details}
                                        onChange={(e) => setDetails(e.target.value)}
                                        variant="outlined"
                                        sx={{ borderRadius: '8px' }}
                                    />
                                </Box>

                                <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>Payment Type</Typography>
                                <RadioGroup
                                    value={paymentType}
                                    onChange={(e) => setPaymentType(e.target.value)}
                                    row
                                >
                                    <FormControlLabel value="cash" control={<Radio />} label="Cash" />
                                    <FormControlLabel value="online" control={<Radio />} label="Online" />
                                    <FormControlLabel value="cheque" control={<Radio />} label="Cheque" />

                                </RadioGroup>
                                {paymentType === 'cheque' && (
                                    <TextField
                                        label="Cheque Number"
                                        fullWidth
                                        margin="normal"
                                        value={chequeNumber}
                                        onChange={(e) => setChequeNumber(e.target.value)}
                                    />
                                )}
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
                        <Button onClick={handlePayment} color="primary" variant="contained">Pay Fees</Button>

                    </DialogActions>
                </Dialog>
            </StyledContainer>
        </>
    );
};

const StyledBackground = styled(Box)`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url(${BackgroundImage});
    background-size: cover;
    background-position: center;
    z-index: -1;
    filter: blur(8px);
`;

const StyledContainer = styled(Box)`
    max-width: 800px;
    margin: 80px auto;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    z-index: 1;
    position: relative;
`;
const StyledButton = styled(Button)`
  background-color: #1976d2;
  color: white;
  border-radius: 8px;
  &:hover {
    background-color: #0d47a1;
  }
`;


export default FeesCalculator;
