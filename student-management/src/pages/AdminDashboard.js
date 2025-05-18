// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Box, Container, Grid, Paper, Typography, Button } from '@mui/material';
// import { styled } from '@mui/system';
// import NavbarScreen from './Navbar';
// import StudentIcon from '../assets/img1.png'; 
// import FeesIcon from '../assets/img4.png'; 
// import BackgroundImage from '../assets/backg.jpg';

// const AdminDashboard = () => {
//     const menuItems = [
//         { to: '/student/enrollment', label: 'Student Enrollment', icon: StudentIcon },
//         { to: '/fees-calculator', label: 'Fees Calculator', icon: FeesIcon },
//         { to: '/income-expense', label: 'Income Expense Form', icon: FeesIcon },
//         { to: '/Admin/dashboard', label: 'Monthly Calculation', icon: FeesIcon },
//         { to: '/payment-slip', label: 'Payment Slip', icon: FeesIcon }
//     ];

//     return (
//         <>
//             <NavbarScreen />
//             <StyledBackground>
//                 <StyledOverlay />
//                 <Container maxWidth="lg" sx={{ mt: 8, mb: 6, position: 'relative', zIndex: 1 }}>
//                     <HeaderWrapper>
//                         <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 2 }}>
//                             Welcome to the School Management System
//                         </Typography>
//                         {/* <Typography variant="h6" align="center" sx={{ color: '#7f8c8d', mb: 4 }}>
//                             Manage students, fees, and reports with ease
//                         </Typography> */}
//                     </HeaderWrapper>

//                     {/* Buttons Section */}
//                     <Grid container spacing={4} justifyContent="center">
//                         {menuItems.map((item, idx) => (
//                             <Grid item key={idx} xs={12} sm={6} md={4} lg={3}>
//                                 <StyledPaper>
//                                     <StyledButton
//                                         component={Link}
//                                         to={item.to}
//                                         variant="contained"
//                                     >
//                                         <IconWrapper>
//                                             <img src={item.icon} alt={item.label} style={{ width: '40px', height: '40px' }} />
//                                         </IconWrapper>
//                                         <ButtonText>{item.label}</ButtonText>
//                                     </StyledButton>
//                                 </StyledPaper>
//                             </Grid>
//                         ))}
//                     </Grid>

//                     {/* Notices Section */}
//                     <Grid item xs={12}>
//                         <Paper sx={{ p: 4, mt: 3, boxShadow: 3, backgroundColor: '#f9f9f9' }}>
//                             <Typography variant="h6" align="center" sx={{ color: '#666' }}>
//                                 Upcoming Announcements and Notices
//                             </Typography>
//                         </Paper>
//                     </Grid>
//                 </Container>
//             </StyledBackground>
//         </>
//     );
// };

// const HeaderWrapper = styled(Box)`
//     margin-top: 10px;
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     align-items: center;
//     text-align: center;
//     margin-bottom: 40px; /* Adds spacing below the header */
//     padding: 20px; /* Adds padding around the header text */
//     background-color: rgba(255, 255, 255, 0.8); /* Adds a semi-transparent background for clarity */
//     border-radius: 8px; /* Smoothens the corners */
//     box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Adds a subtle shadow */
// `;

// const StyledPaper = styled(Paper)`
//   padding: 24px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   text-align: center;
//   background-color: #d1e3ff;
//   box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
//   border-radius: 8px;
//   transition: transform 0.3s ease;
  
//   &:hover {
//     transform: translateY(-4px);
//     box-shadow: 0 6px 30px rgba(0, 0, 0, 0.15);
//   }
// `;

// const StyledButton = styled(Button)`
//   && {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     font-size: 1.1rem;
//     font-weight: 500;
//     background-color: #fff;
//     color: #0c1c35;
//     padding: 16px;
//     border-radius: 8px;
//     transition: background-color 0.3s ease;
//     width: 100%;
//     height: 140px;

//     &:hover {
//       background-color: #7ca7eb;
//       color: #fff;
//     }
//   }
// `;

// const ButtonText = styled('span')`
//   margin-top: 8px;
//   text-align: center;
// `;

// const IconWrapper = styled('div')`
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;

// const StyledBackground = styled(Box)`
//     position: absolute;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background-image: url(${BackgroundImage});
//     background-size: cover;
//     background-position: center;
//     z-index: -1;
// `;

// const StyledOverlay = styled(Box)`
//     position: absolute;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background-color: rgba(255, 255, 255, 0);
//     backdrop-filter: blur(8px);
//     z-index: -1;
// `;

// export default AdminDashboard;
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Container, Grid, Paper, Typography, Button, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import NavbarScreen from './Navbar';
import StudentIcon from '../assets/img1.png';
import FeesIcon from '../assets/img4.png';
import BackgroundImage from '../assets/backg.jpg';
import MenuIcon from '@mui/icons-material/Menu';
import IncomeIcon from '../assets/income.png';
import CalculationIcon from '../assets/calculation.png';
import Allocation from '../assets/allocation.png';

const AdminDashboard = () => {
    const location = useLocation(); // Hook to get the current location
    const [drawerOpen, setDrawerOpen] = React.useState(false); // Drawer open state

    // Menu items for the drawer
    const menuItems = [
        { to: '/student/enrollment', label: 'Student Enrollment', icon: StudentIcon },
        { to: '/fees-calculator', label: 'Fees Calculator', icon: FeesIcon },
        { to: '/income-expense', label: 'Income Expense Form', icon: IncomeIcon },
        { to: '/monthly-calculation', label: 'Monthly Calculation', icon: CalculationIcon },
        { to: '/payment-slip', label: 'Payment Slip', icon: FeesIcon },
        { to: '/student-allocation', label: 'Student Allocation', icon: Allocation }

    ];

    // Toggle drawer open/close
    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    return (
        <>
            <NavbarScreen />

            {/* Conditionally render drawer button on all pages except AdminDashboard */}
            {location.pathname !== '/Admin/dashboard' && (
                <IconButton
                    onClick={toggleDrawer(true)}
                    sx={{ position: 'fixed', top: 20, left: 20, zIndex: 1000 }}
                >
                    <MenuIcon fontSize="large" />
                </IconButton>
            )}

            {/* Drawer component */}
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                <List>
                    {menuItems.map((item, index) => (
                        <ListItem button key={index} component={Link} to={item.to} onClick={toggleDrawer(false)}>
                            <ListItemIcon>
                                <img src={item.icon} alt={item.label} style={{ width: '24px', height: '24px' }} />
                            </ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <StyledBackground>
                <StyledOverlay />
                <Container maxWidth="lg" sx={{ mt: 8, mb: 6, position: 'relative', zIndex: 1 }}>
                    <HeaderWrapper>
                        <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 2 }}>
                            Welcome to the School Management System
                        </Typography>
                    </HeaderWrapper>

                    {/* Buttons Section */}
                    <Grid container spacing={4} justifyContent="center">
                        {menuItems.map((item, idx) => (
                            <Grid item key={idx} xs={12} sm={6} md={4} lg={3}>
                                <StyledPaper>
                                    <StyledButton
                                        component={Link}
                                        to={item.to}
                                        variant="contained"
                                    >
                                        <IconWrapper>
                                            <img src={item.icon} alt={item.label} style={{ width: '40px', height: '40px' }} />
                                        </IconWrapper>
                                        <ButtonText>{item.label}</ButtonText>
                                    </StyledButton>
                                </StyledPaper>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Notices Section */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 4, mt: 3, boxShadow: 3, backgroundColor: '#f9f9f9' }}>
                            <Typography variant="h6" align="center" sx={{ color: '#666' }}>
                                Upcoming Announcements and Notices
                            </Typography>
                        </Paper>
                    </Grid>
                </Container>
            </StyledBackground>
        </>
    );
};

// Styled Components
const HeaderWrapper = styled(Box)`
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-bottom: 40px;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const StyledPaper = styled(Paper)`
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #d1e3ff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 30px rgba(0, 0, 0, 0.15);
  }
`;

const StyledButton = styled(Button)`
  && {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1.1rem;
    font-weight: 500;
    background-color: #fff;
    color: #0c1c35;
    padding: 16px;
    border-radius: 8px;
    transition: background-color 0.3s ease;
    width: 100%;
    height: 140px;

    &:hover {
      background-color: #7ca7eb;
      color: #fff;
    }
  }
`;

const ButtonText = styled('span')`
  margin-top: 8px;
  text-align: center;
`;

const IconWrapper = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledBackground = styled(Box)`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url(${BackgroundImage});
    background-size: cover;
    background-position: center;
    z-index: -1;
`;

const StyledOverlay = styled(Box)`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0);
    backdrop-filter: blur(8px);
    z-index: -1;
`;

export default AdminDashboard;
