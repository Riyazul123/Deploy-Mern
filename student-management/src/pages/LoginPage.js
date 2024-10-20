
// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import {
//     Grid, Box, Typography, Paper, TextField, CssBaseline, IconButton, InputAdornment, CircularProgress, Backdrop
// } from '@mui/material';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { Visibility, VisibilityOff } from '@mui/icons-material';
// import bgpic from "../assets/students.svg";
// import { LightPurpleButton } from '../component/buttonStyles';
// import styled from 'styled-components';
// import Popup from '../component/Popup'; // Ensure Popup is correctly imported

// const defaultTheme = createTheme();

// const LoginPage = ({ role }) => {
//     const navigate = useNavigate();

//     const [toggle, setToggle] = useState(false);
//     const [guestLoader, setGuestLoader] = useState(false);
//     const [loader, setLoader] = useState(false);
//     const [showPopup, setShowPopup] = useState(false);
//     const [message, setMessage] = useState("");
//     const [emailError, setEmailError] = useState(false);
//     const [passwordError, setPasswordError] = useState(false);

//     const handleSubmit = (event) => {
//         event.preventDefault();

//         const email = event.target.email.value;
//         const password = event.target.password.value;

//         if (!email || !password) {
//             if (!email) setEmailError(true);
//             if (!password) setPasswordError(true);
//             setMessage("Please enter both email and password.");
//             setShowPopup(true);
//             return;
//         }

//         setLoader(true); // Start loader while processing

//         setTimeout(() => { // Simulate API delay
//             setLoader(false);
//             // Correct credentials check
//             if (email === 'admin@gmail.com' && password === '123456') {
//                 setMessage("Login successful!");
//                 setShowPopup(true);
//                 setTimeout(() => navigate('/Admin/dashboard'), 1500); // Redirect after a delay
//             } else {
//                 setMessage("Invalid email or password. Please try again.");
//                 setShowPopup(true);
//             }
//         }, 1000);
//     };

//     const handleInputChange = (event) => {
//         const { name } = event.target;
//         if (name === 'email') setEmailError(false);
//         if (name === 'password') setPasswordError(false);
//     };

//     return (
//         <ThemeProvider theme={defaultTheme}>
//             <Grid container component="main" sx={{ height: '100vh' }}>
//                 <CssBaseline />
//                 <Grid
//                     item
//                     xs={12}
//                     sm={4}
//                     md={6}
//                     sx={{
//                         backgroundImage: `url(${bgpic})`,
//                         backgroundRepeat: 'no-repeat',
//                         backgroundColor: (t) =>
//                             t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
//                         backgroundSize: 'cover',
//                         backgroundPosition: 'center',
//                         zIndex: '-1',
//                         filter: 'blur(2px)'
//                     }}
//                 />
//                 <Grid item xs={12} sm={5} md={4} component={Paper} elevation={6} square style={{ height: '450px', display: 'flex', justifyContent: 'right', marginTop: '75px', borderRadius: '15px' }}>
//                     <Box
//                         sx={{
//                             my: 8,
//                             mx: 8,
//                             display: 'flex',
//                             flexDirection: 'column',
//                             alignItems: 'right',
//                         }}
//                     >
//                         <Typography variant="h4" sx={{ mb: 2, color: "#2c2143" }}>
//                             {role} Login
//                         </Typography>
//                         <Typography variant="body1">
//                             Welcome back! Please enter your details
//                         </Typography>
//                         <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
//                             <TextField
//                                 margin="normal"
//                                 required
//                                 fullWidth
//                                 id="email"
//                                 label="Enter your email"
//                                 name="email"
//                                 autoComplete="email"
//                                 autoFocus
//                                 error={emailError}
//                                 helperText={emailError && 'Email is required'}
//                                 onChange={handleInputChange}
//                             />
//                             <TextField
//                                 margin="normal"
//                                 required
//                                 fullWidth
//                                 name="password"
//                                 label="Password"
//                                 type={toggle ? 'text' : 'password'}
//                                 id="password"
//                                 autoComplete="current-password"
//                                 error={passwordError}
//                                 helperText={passwordError && 'Password is required'}
//                                 onChange={handleInputChange}
//                                 InputProps={{
//                                     endAdornment: (
//                                         <InputAdornment position="end">
//                                             <IconButton onClick={() => setToggle(!toggle)}>
//                                                 {toggle ? <Visibility /> : <VisibilityOff />}
//                                             </IconButton>
//                                         </InputAdornment>
//                                     ),
//                                 }}
//                             />
//                             <LightPurpleButton
//                                 type="submit"
//                                 fullWidth
//                                 variant="contained"
//                                 sx={{ mt: 3 }}
//                             >
//                                 {loader ? (
//                                     <CircularProgress size={24} color="inherit" />
//                                 ) : (
//                                     "Login"
//                                 )}
//                             </LightPurpleButton>
//                         </Box>
//                     </Box>
//                 </Grid>
//             </Grid>
//             <Backdrop
//                 sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
//                 open={guestLoader}
//             >
//                 <CircularProgress color="primary" />
//                 Please Wait
//             </Backdrop>

//             {/* Popup component to show messages */}
//             <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
//         </ThemeProvider>
//     );
// };

// export default LoginPage;

// const StyledLink = styled(Link)`
//   margin-top: 9px;
//   text-decoration: none;
//   color: #7f56da;
// `;
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Grid, Box, Typography, Paper, TextField, CssBaseline, IconButton, InputAdornment, CircularProgress, Backdrop, Alert
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import bgpic from "../assets/students.svg";
import { LightPurpleButton } from '../component/buttonStyles';
import styled from 'styled-components';
import Popup from '../component/Popup'; // Ensure Popup is correctly imported

const defaultTheme = createTheme();

const LoginPage = ({ role }) => {
    const navigate = useNavigate();

    const [toggle, setToggle] = useState(false);
    const [guestLoader, setGuestLoader] = useState(false);
    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [popupType, setPopupType] = useState("error"); // Add state for popup type

    const handleSubmit = (event) => {
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;

        if (!email || !password) {
            if (!email) setEmailError(true);
            if (!password) setPasswordError(true);
            setMessage("Please enter both email and password.");
            setPopupType("error"); // Set popup type to error
            setShowPopup(true);
            return;
        }

        setLoader(true); // Start loader while processing

        setTimeout(() => { // Simulate API delay
            setLoader(false);
            // Correct credentials check
            if (email === 'admin@gmail.com' && password === '123456') {
                setMessage("Login successful!");
                setPopupType("success"); // Set popup type to success (green)
                setShowPopup(true);
                setTimeout(() => navigate('/Admin/dashboard'), 1500); // Redirect after a delay
            } else {
                setMessage("Invalid email or password. Please try again.");
                setPopupType("error"); // Set popup type to error
                setShowPopup(true);
            }
        }, 1000);
    };

    const handleInputChange = (event) => {
        const { name } = event.target;
        if (name === 'email') setEmailError(false);
        if (name === 'password') setPasswordError(false);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={12}
                    sm={4}
                    md={6}
                    sx={{
                        backgroundImage: `url(${bgpic})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        zIndex: '-1',
                        filter: 'blur(2px)'
                    }}
                />
                <Grid item xs={12} sm={5} md={4} component={Paper} elevation={6} square style={{ height: '450px', display: 'flex', justifyContent: 'right', marginTop: '75px', borderRadius: '15px' }}>
                    <Box
                        sx={{
                            my: 8,
                            mx: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'right',
                        }}
                    >
                        <Typography variant="h4" sx={{ mb: 2, color: "#2c2143" }}>
                            {role} Login
                        </Typography>
                        <Typography variant="body1">
                            Welcome back! Please enter your details
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Enter your email"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                error={emailError}
                                helperText={emailError && 'Email is required'}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={toggle ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                error={passwordError}
                                helperText={passwordError && 'Password is required'}
                                onChange={handleInputChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setToggle(!toggle)}>
                                                {toggle ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <LightPurpleButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3 }}
                            >
                                {loader ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    "Login"
                                )}
                            </LightPurpleButton>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={guestLoader}
            >
                <CircularProgress color="primary" />
                Please Wait
            </Backdrop>

            {/* Popup component to show messages */}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} type={popupType} />
        </ThemeProvider>
    );
};

export default LoginPage;

const StyledLink = styled(Link)`
  margin-top: 9px;
  text-decoration: none;
  color: #7f56da;
`;
