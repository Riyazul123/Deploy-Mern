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
import { toast, ToastContainer } from 'react-toastify';


const FeesCalculator = () => {
    const [studentIdOrName, setStudentIdOrName] = useState('');
    const [studentData, setStudentData] = useState(null);
    const [amountPaid, setAmountPaid] = useState('');
    const [lateFine, setLateFine] = useState('');
    const [discount, setDiscount] = useState('');
    const [details, setDetails] = useState('');
    const [feesForMonth, setFeesForMonth] = useState('');
    const [paymentType, setPaymentType] = useState('cash');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [studentList, setStudentList] = useState([]); // New state for list of students
    const [paymentStatus, setPaymentStatus] = useState('');
    const [chequeNumber, setChequeNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const baseUrl = process.env.REACT_APP_SERVER_URL;
    const handleFetch = async () => {
        setLoading(true); // Start the loader
        setError(''); // Reset any previous error
        try{
            const response = await fetch(`${baseUrl}/api/fees?search=${studentIdOrName}`);
            const data = await response.json();
    
            if (data && data.length > 0) {
                setStudentList(data); // Set the list of students
                setPaymentStatus('');
                setDialogOpen(true);
            } else {
                setPaymentStatus('Student not found');
                setError('Error fetching data. Please try again.');
            }
        }catch (error) {
            setError('Error fetching data. Please try again.');
            console.error('Error fetching data', error);
          } finally {
            setLoading(false); // Stop the loader
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
        setLoading(true); // Start the loader
        setError(''); // Reset any previous error
        // Check if amountPaid is a valid number
        try{
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
                fees_for_month:feesForMonth,
            };
    
            try {
                const response = await fetch(baseUrl+'/api/createfees', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(feeData),
                });
    
                const result = await response.json();
                if (response.ok) {
                    setPaymentStatus('Payment successful');
                    toast.success('Payment successful!');
                    
                    // Reset fields
                    setAmountPaid('');
                    setFeesForMonth('');
                    setLateFine('');
                    setDiscount('');
                    setDetails('');
                    setChequeNumber('');
                    setTimeout(() => {
                        setDialogOpen(false); // Close the dialog after 2 seconds
                    }, 2000); // 2 seconds delay
                } else {
                    setPaymentStatus(result.message || 'Error processing payment');
                    toast.error(result.message || 'Error processing payment.');
                }
            } catch (error) {
                console.error('Error:', error); // Log the error to console for debugging
                setPaymentStatus('Error connecting to server');
                toast.error('Error connecting to server. Please try again.');

            }
        } else {
            setPaymentStatus('Student data is missing');
        }

    }catch (error) {
        setError('Error fetching data. Please try again.');
        console.error('Error fetching data', error);
      } finally {
        setLoading(false); // Stop the loader
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
                    {loading && <Typography variant="body1">Loading...</Typography>}
                    {error && <Typography variant="body1" color="error">{error}</Typography>}

                    
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
                              {/* {  (studentData.student_type === "regular")&&<Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50' }}>Fees: ₹{studentData.fees}</Typography>} */}
                              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50' }}>Fees: ₹{studentData.fees}</Typography>

                                <Box sx={{ marginTop: 2 }}>
                                    <TextField
                                        label="Amount Paid"
                                        fullWidth
                                        margin="normal"
                                        type='number'
                                        value={amountPaid}
                                        onChange={(e) => setAmountPaid(e.target.value)}
                                        variant="outlined"
                                        sx={{ borderRadius: '8px' }}
                                    />
                                    <TextField
                                        label="Late Fine"
                                        fullWidth
                                        margin="normal"
                                        type='number'
                                        value={lateFine}
                                        onChange={(e) => setLateFine(e.target.value)}
                                        variant="outlined"
                                        sx={{ borderRadius: '8px' }}
                                    />
                                    <TextField
                                        label="Discount Amount"
                                        fullWidth
                                        margin="normal"
                                        type='number'
                                        value={discount}
                                        onChange={(e) => setDiscount(e.target.value)}
                                        variant="outlined"
                                        sx={{ borderRadius: '8px' }}
                                    />
                                    <TextField
                                        label="Transactional Details"
                                        fullWidth
                                        margin="normal"
                                        value={details}
                                        onChange={(e) => setDetails(e.target.value)}
                                        variant="outlined"
                                        sx={{ borderRadius: '8px' }}
                                    />
                                    <TextField
                                        label="Fees for the month"
                                        fullWidth
                                        margin="normal"
                                        type='date'
                                        value={feesForMonth}
                                        onChange={(e) => setFeesForMonth(e.target.value)}
                                        variant="outlined"
                                        sx={{ borderRadius: '8px' }}
                                        InputLabelProps={{shrink: true}}
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
