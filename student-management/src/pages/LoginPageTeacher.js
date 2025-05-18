import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid, Box, Typography, Paper, Checkbox, FormControlLabel, TextField, CssBaseline, IconButton, InputAdornment, CircularProgress, Backdrop } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import bgpic from "../assets/designlogin.jpg"
import { LightPurpleButton } from '../component/buttonStyles';
import styled from 'styled-components';
import Popup from '../component/Popup';


const defaultTheme = createTheme();

const LoginPageTeacher = ({ role }) => {


    const navigate = useNavigate()


    const [toggle, setToggle] = useState(false)
    const [guestLoader, setGuestLoader] = useState(false)
    const [loader, setLoader] = useState(false)
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [popupType, setPopupType] = useState("error"); // Add state for popup type
    const baseUrl = process.env.REACT_APP_SERVER_URL;
    const handleSubmit = async (event) => {
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
    
        try {
            const response = await fetch(baseUrl+"/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userID: email,  // Assuming email is used as userID
                    password: password,
                    userType: "Employee", // Modify this if the role changes dynamically
                }),
            });
    
            const data = await response.json();
    
            setLoader(false); // Stop loader
    
            if (response.ok) {
                setMessage("Login successful!");
                setPopupType("success"); // Set popup type to success (green)
                setShowPopup(true);

                console.log("Emp ID====>"+ data.EmpId)

                console.log("Data ====>", data)
                // Store token or user data if needed
                localStorage.setItem("empId", data.EmpId); 
                 localStorage.setItem("empName", data.EmpName);
                
                setTimeout(() => navigate('/Notebbok'), 1500); // Redirect after a delay
            } else {
                setMessage(data.message || "Invalid email or password. Please try again.");
                setPopupType("error"); // Set popup type to error
                setShowPopup(true);
            }
        } catch (error) {
            setLoader(false);
            setMessage("Server error. Please try again later.");
            setPopupType("error");
            setShowPopup(true);
        }
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
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="h4" sx={{ mb: 2, color: "#2c2143" }}>
                            {role} Login
                        </Typography>
                        <Typography variant="h7">
                            Welcome back! Please enter your details
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Enter User ID"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    error={emailError}
                                    helperText={emailError && 'User ID is required'}
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
                                                {toggle ? (
                                                    <Visibility />
                                                ) : (
                                                    <VisibilityOff />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label="Remember me"
                                />
                                <StyledLink href="#">
                                    Forgot password?
                                </StyledLink>
                            </Grid>
                            <LightPurpleButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3 }}
                            >
                                {loader ?
                                    <CircularProgress size={24} color="inherit" />
                                    : "Login"}
                            </LightPurpleButton>
                            {/* <Button
                                fullWidth
                                onClick={guestModeHandler}
                                variant="outlined"
                                sx={{ mt: 2, mb: 3, color: "#7f56da", borderColor: "#7f56da" }}
                            >
                                Login as Guest
                            </Button> */}
                            {role === "Admin" &&
                                <Grid container>
                                    <Grid>
                                        Don't have an account?
                                    </Grid>
                                    <Grid item sx={{ ml: 2 }}>
                                        <StyledLink to="/Adminregister">
                                            Sign up
                                        </StyledLink>
                                    </Grid>
                                </Grid>
                            }
                        </Box>
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: `url(${bgpic})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            </Grid>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={guestLoader}
            >
                <CircularProgress color="primary" />
                Please Wait
            </Backdrop>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} type={popupType} />

        </ThemeProvider>
    );
}

export default LoginPageTeacher;

const StyledLink = styled(Link)`
  margin-top: 9px;
  text-decoration: none;
  color: #7f56da;
`;