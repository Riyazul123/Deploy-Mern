// import React, { useState } from 'react';
// import { Box, Button, Typography, TextField } from '@mui/material';
// import styled from 'styled-components';
// import axios from 'axios'; // To make API calls
// import NavbarScreen from './Navbar';
// import BackgroundImage from '../assets/backg.jpg';

// const MonthlyCalculationForm = () => {
//     const [formData, setFormData] = useState({
//         fromDate: '',
//         toDate: ''
//     });

//     const [result, setResult] = useState(null); // State to hold income and expense results
//     const [error, setError] = useState(null); // Error handling state

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value,
//         });
//     };

//     const handleSubmit = async () => {
//         try {
//             const response = await axios.post('/api/calculate-income-expense', formData);
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
//                     <Box sx={{ p: 3 }}>
//                         <Typography variant="h4" sx={{ mb: 3 }}>
//                             Monthly Calculation
//                         </Typography>
//                         <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
//                             <StyledTextField
//                                 label="FROM DATE"
//                                 name="fromDate"
//                                 type="date"
//                                 value={formData.fromDate}
//                                 onChange={handleChange}
//                                 fullWidth
//                                 required
//                                 InputLabelProps={{ shrink: true }}
//                             />
//                             <StyledTextField
//                                 label="TO DATE"
//                                 name="toDate"
//                                 type="date"
//                                 value={formData.toDate}
//                                 onChange={handleChange}
//                                 fullWidth
//                                 required
//                                 InputLabelProps={{ shrink: true }}
//                             />
//                             <StyledButton
//                                 variant="contained"
//                                 color="primary"
//                                 onClick={handleSubmit}
//                             >
//                                 Calculate
//                             </StyledButton>
//                         </Box>

//                         {result && (
//                             <Box sx={{ mt: 4 }}>
//                                 <Typography variant="h6">Income: ${result.income}</Typography>
//                                 <Typography variant="h6">Expense: ${result.expense}</Typography>
//                             </Box>
//                         )}

//                         {error && (
//                             <Box sx={{ mt: 2 }}>
//                                 <Typography color="error">{error}</Typography>
//                             </Box>
//                         )}
//                     </Box>
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
//     padding: 40px 20px;          /* Add padding for better spacing */
//     background-color: rgba(255, 255, 255, 0.9); 
//     border-radius: 12px;
//     box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); 
//     z-index: 1;
//     margin: 0 auto;              /* Center the form horizontally */
//     display: flex;
//     flex-direction: column;      /* Ensure the form content stacks vertically */
//     align-items: stretch;        /* Ensure form content spans full width */
// `;

// export default MonthlyCalculationForm;
import React, { useState } from 'react';
import { Box, Button, Typography, TextField, Card, CardContent } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios'; // To make API calls
import NavbarScreen from './Navbar';
import BackgroundImage from '../assets/backg.jpg';

const MonthlyCalculationForm = () => {
    const [formData, setFormData] = useState({
        fromDate: '',
        toDate: ''
    });

    const [result, setResult] = useState(null); // State to hold income and expense results
    const [error, setError] = useState(null); // Error handling state
    const baseUrl = process.env.REACT_APP_SERVER_URL;
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(baseUrl+'/api/calculate-income-expense', formData);
            setResult(response.data); // Assuming the API returns income and expense
            setError(null); // Reset any error
        } catch (err) {
            setError('Error fetching data. Please try again.');
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
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <StyledTextField
                                    label="From Date"
                                    name="fromDate"
                                    type="date"
                                    value={formData.fromDate}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    InputLabelProps={{ shrink: true }}
                                />
                                <StyledTextField
                                    label="To Date"
                                    name="toDate"
                                    type="date"
                                    value={formData.toDate}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    InputLabelProps={{ shrink: true }}
                                />
                                <StyledButton
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}
                                >
                                    Calculate
                                </StyledButton>
                            </Box>

                            {result && (
                                <Box sx={{ mt: 4 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                                        Income: Rs. {result.income}
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                                        Expense: Rs. {result.expense}
                                    </Typography>
                                </Box>
                            )}

                            {error && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography color="error">{error}</Typography>
                                </Box>
                            )}
                        </CardContent>
                    </StyledCard>
                </StyledContainer>
            </StyledBackground>
        </>
    );
};

const StyledTextField = styled(TextField)`
    & .MuiOutlinedInput-root {
        border-radius: 8px;
    }
`;

const StyledButton = styled(Button)`
    height: 56px; /* Match height of text fields */
    flex-shrink: 0; /* Prevent the button from shrinking */
    white-space: nowrap; /* Prevent button text from wrapping */
    padding: 0 24px;
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
    justify-content: center; /* Center horizontally */
    align-items: flex-start; /* Align closer to the top */
    padding-top: 100px; /* Add padding for spacing from the top */
    z-index: -1;
`;

const StyledOverlay = styled(Box)`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backdrop-filter: blur(8px); 
    background-color: rgba(255, 255, 255, 0.2);
    z-index: -1;
`;

const StyledContainer = styled(Box)`
    width: 100%;
    max-width: 1200px;            /* Limit width for better readability */
    padding: 40px 20px;           /* Add padding for better spacing */
    margin: 0 auto;               /* Center the form horizontally */
    display: flex;
    justify-content: center;
`;

const StyledCard = styled(Card)`
    width: 100%;
    max-width: 600px;             /* Limit the max-width */
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15); /* Softer shadow for a professional look */
    background-color: rgba(255, 255, 255, 0.95);
`;

export default MonthlyCalculationForm;
