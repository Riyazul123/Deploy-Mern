// import React from 'react';
// import { Link } from 'react-router-dom';
// import { AppBar, Button, Box, Container, Grid, Paper, Typography, Toolbar } from '@mui/material';
// import { styled } from '@mui/system';
// import profileImage from '../assets/download.png'; // Replace with your actual image path

// const NavbarScreen = () => {
//     return (
//         <>
//             <Navbar>
//                 <Toolbar>
//                     <Typography variant="h5" sx={{ flexGrow: 1 }}>
//                         Admin Dashboard
//                     </Typography>
//                     <ProfileSection>
//                         <ProfileImage src={profileImage} alt="Profile" />
//                         <Typography variant="body1" sx={{ ml: 1 }}>
//                             Admin Name
//                         </Typography>
//                     </ProfileSection>
//                 </Toolbar>
//             </Navbar>

           
//         </>
//     );
// };

// // Styled components
// const Navbar = styled(AppBar)`
//     background-color: #0c1c35;
//     box-shadow: none;
//     margin-bottom: 14px;
// `;

// const StyledPaper = styled(Paper)`
//   padding: 24px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   text-align: center;
//   background-color: #fff;
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
//     font-size: 1.1rem;
//     font-weight: 500;
//     background-color: #1976d2;
//     color: white;
//     padding: 12px 24px;
//     border-radius: 8px;
//     transition: background-color 0.3s ease;

//     &:hover {
//       background-color: #0d47a1;
//     }
//   }
// `;

// const ProfileSection = styled(Box)`
//     display: flex;
//     align-items: center;
// `;

// const ProfileImage = styled('img')`
//     width: 40px;
//     height: 40px;
//     border-radius: 50%;
// `;

// export default NavbarScreen;
import React, { useEffect , useState} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Box, Typography, Toolbar, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import { styled } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu'; // Icon for the drawer
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Logout icon
import profileImage from '../assets/download.png'; // Replace with your actual image path
import stdnLogo from '../assets/stdt-logo.jpeg';
import HomeIcon from '../assets/home.png';
import { useNavigate } from 'react-router-dom';
const TeacherNavbarScreen = () => {
    const location = useLocation(); // Hook to get the current route
    const [drawerOpen, setDrawerOpen] = React.useState(false); // Drawer state
    const navigate = useNavigate(); // Use navigate for redirection

  const [empId, setEmpId] = useState(null);
  const [empName, setEmpName] = useState("");


    const menuItems = [
        { to: '/Notebbok', label: 'Home', icon: HomeIcon },
        { to: '/ReportCard', label: 'Report', icon: HomeIcon }
    ];


  useEffect(() => {
    const storedEmpId = localStorage.getItem("empId");
    const storedEmpName = localStorage.getItem("empName");

    if (storedEmpId) {
      setEmpId(storedEmpId);
    }
    if (storedEmpName) {
      setEmpName(storedEmpName);
    }
  }, []);

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    const handleLogout = () => {
        // Implement your logout functionality here
        console.log("Logging out...");

          localStorage.removeItem("empId");
         localStorage.removeItem("empName");
        navigate('/'); 

    };

    return (
        <>
            <TeacherNavbar>
                <Toolbar>
                    {/* Conditionally render the drawer button on all routes except /Admin/dashboard */}
                    {location.pathname !== '/Admin/dashboard' && (
                        <IconButton
                            onClick={toggleDrawer(true)}
                            edge="start"
                            color="inherit"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    {/* <LogoSection> */}
                        <StdnLogo src={stdnLogo} alt="StdnLogo"/>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                       
                    </Typography>
{/* 
                    </LogoSection> */}
                    

                    <ProfileSection>
                        <ProfileImage src={profileImage} alt="Profile" />
                        <Typography variant="body1" sx={{ ml: 1 }}>
                          {empName}
                        </Typography>
                    </ProfileSection>
                </Toolbar>
            </TeacherNavbar>

            {/* Drawer component */}
            <CustomDrawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                <DrawerContainer>
                    <List>
                    <StdnLogo src={stdnLogo} alt="StdnLogo" style={{width:'204px',height:'74px'}}/>
                        <Typography variant="h5" sx={{ flexGrow: 1 }} style={{ paddingBottom: '40px', paddingLeft: '15px' }}>
                            
                        </Typography>

                        {menuItems.map((item, index) => (
                            <CustomListItem button key={index} component={Link} to={item.to} onClick={toggleDrawer(false)}>
                                <ListItemIcon>
                                    <img src={item.icon} alt={item.label} style={{ width: '24px', height: '24px' }} />
                                </ListItemIcon>
                                <CustomListItemText primary={item.label} />
                            </CustomListItem>
                        ))}
                    </List>

                    {/* Footer section with Logout Button */}
                    <DrawerFooter>
                        <LogoutButton
                            fullWidth
                            variant="contained"
                            startIcon={<ExitToAppIcon />}
                            onClick={handleLogout}
                        >
                            Logout
                        </LogoutButton>
                    </DrawerFooter>
                </DrawerContainer>
            </CustomDrawer>
        </>
    );
};

// Styled components
const TeacherNavbar = styled(AppBar)`
    background-color: #0c1c35;
    box-shadow: none;
    margin-bottom: 14px;
`;

const ProfileSection = styled(Box)`
    display: flex;
    align-items: center;
`;
const LogoSection = styled(Box)`
    display: flex;
    align-items: left;
`;

const ProfileImage = styled('img')`
    width: 40px;
    height: 40px;
    border-radius: 50%;
`;

const StdnLogo = styled('img')`
    width: 142px;
    height: 61px;
    border-top-left-radius: 19px;
    border-bottom-right-radius: 19px;
`;

const CustomDrawer = styled(Drawer)`
    .MuiDrawer-paper {
        width: 260px; /* Customize the width of the drawer */
        background-color: #0c1c35;
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
`;

const DrawerContainer = styled(Box)`
    padding: 16px;
    flex-grow: 1; /* Allows the List to take up the available space */
`;

const CustomListItem = styled(ListItem)`
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    transition: background-color 0.3s ease;
    
    &:hover {
        background-color: #1e2a40;
    }
`;

const CustomListItemText = styled(ListItemText)`
    span {
        font-size: 1rem;
        font-weight: 500;
        color: white;
    }
`;

const DrawerFooter = styled(Box)`
    padding: 16px;
    background-color: #0c1c35;
`;

const LogoutButton = styled(Button)`
    background-color: #ff6b6b;
    color: white;
    &:hover {
        background-color: #ff4b4b;
    }
`;

export default TeacherNavbarScreen;
