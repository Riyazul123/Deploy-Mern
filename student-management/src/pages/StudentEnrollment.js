import React, { useState } from 'react';
import { styled } from '@mui/system';
import { TextField, Button, Box, Paper, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import NavbarScreen from './Navbar';
import BackgroundImage from '../assets/backg.jpg';

const StudentEnrollment = () => {
    const [formData, setFormData] = useState({
        student_name: '',
        student_dob:'',
        fathers_name: '',
        mothers_name: '',
        contact_no: '',
        email_id: '',
        alternative_contact_no: '',
        alternative_email_id: '',
        fees: '',
        date_of_admission: '',
        no_of_days: ''
    });

    const [filterDates, setFilterDates] = useState({
        start_date: '',
        end_date: '',
    });

    const [enrolledStudents, setEnrolledStudents] = useState([]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFilterChange = (e) => {
        setFilterDates({ ...filterDates, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const baseUrl = process.env.REACT_APP_SERVER_URL;
            const response = await fetch(baseUrl+'/api/enroll', {
            // const response = await fetch(baseUrl + '/api/enroll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Student enrolled successfully');
                setFormData({
                    student_name: '',
                    student_dob:'',
                    fathers_name: '',
                    mothers_name: '',
                    contact_no: '',
                    email_id: '',
                    alternative_contact_no: '',
                    alternative_email_id: '',
                    fees: '',
                    date_of_admission: '',
                    no_of_days: ''
                });
            } else {
                const errorData = await response.json();
                alert('Error: ' + errorData.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleFilterSubmit = async (e) => {

        e.preventDefault();

        try {
            const baseUrl = process.env.REACT_APP_SERVER_URL;
            const response = await fetch(`${baseUrl}/api/students?start_date=${filterDates.start_date}&end_date=${filterDates.end_date}`);
            const data = await response.json();
            setEnrolledStudents(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <NavbarScreen />
            <StyledBackground />
            <StyledContainer>
                <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#333' }}>
                    Student Enrollment Form
                </Typography>
                <Paper elevation={3} sx={{ padding: 4, borderRadius: '8px' }}>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            {Object.keys(formData).map((field, idx) => (
                                <Grid item xs={12} sm={6} key={idx}>
                                    <StyledTextField
                                        label={field.split('_').join(' ').toUpperCase()}
                                        name={field}
                                        type={field === 'date_of_admission' ||field === 'student_dob' ? 'date' : 'text'}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        fullWidth
                                        required={!(field === 'alternative_contact_no' || field === 'alternative_email_id')} 
                                        InputLabelProps={field === 'date_of_admission' || field === 'student_dob' ? { shrink: true } : {}}
                                    />
                                </Grid>
                            ))}


                        </Grid>

                        <StyledButton type="submit" variant="contained" fullWidth>
                            Enroll Student
                        </StyledButton>
                    </Box>
                </Paper>

                <Typography variant="h5" gutterBottom align="center" sx={{ marginTop: 4 }}>
                    Filter Enrolled Students by Date
                </Typography>
                <Paper elevation={3} sx={{ padding: 4, borderRadius: '8px', marginTop: 2 }}>
                    <Box component="form" onSubmit={handleFilterSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <StyledTextField
                                    label="Start Date"
                                    name="start_date"
                                    type="date"
                                    value={filterDates.start_date}
                                    onChange={handleFilterChange}
                                    fullWidth
                                    required
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <StyledTextField
                                    label="End Date"
                                    name="end_date"
                                    type="date"
                                    value={filterDates.end_date}
                                    onChange={handleFilterChange}
                                    fullWidth
                                    required
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <StyledButton type="submit" variant="contained" style={{ marginTop: '0px' }}>
                                    Filter Students
                                </StyledButton>
                            </Grid>

                        </Grid>

                    </Box>
                </Paper>

                {/* Display enrolled students */}
                {/* Display enrolled students */}
                <Paper elevation={3} sx={{ padding: 4, borderRadius: '8px', marginTop: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Enrolled Students
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead style={{
                                background: '#0c1c35',
                                color: '#fff'
                            }}>
                                <TableRow >
                                    <TableCell style={{ color: '#fff' }}>Student Enrollment ID</TableCell>
                                    <TableCell style={{ color: '#fff' }}>Student Date of Birth</TableCell>
                                    <TableCell style={{ color: '#fff' }}>Student Name</TableCell>
                                    <TableCell style={{ color: '#fff' }}>Father's Name</TableCell>
                                    <TableCell style={{ color: '#fff' }}>Mother's Name</TableCell>
                                    <TableCell style={{ color: '#fff' }}>Contact No</TableCell>
                                    <TableCell style={{ color: '#fff' }}>Email ID</TableCell>
                                    <TableCell style={{ color: '#fff' }}>Alternative Email ID</TableCell>
                                    <TableCell style={{ color: '#fff' }}>Alternative Contact No</TableCell>
                                    <TableCell style={{ color: '#fff' }}>Fees</TableCell>
                                    <TableCell style={{ color: '#fff' }}>Date of Admission</TableCell>
                                    <TableCell style={{ color: '#fff' }}>No. of Days</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {enrolledStudents.length > 0 ? (
                                    enrolledStudents.map((student, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{student.enrollment_id}</TableCell>
                                            <TableCell>{student.student_dob}</TableCell>
                                            <TableCell>{student.student_name}</TableCell>
                                            <TableCell>{student.fathers_name}</TableCell>
                                            <TableCell>{student.mothers_name}</TableCell>
                                            <TableCell>{student.contact_no}</TableCell>
                                            <TableCell>{student.email_id}</TableCell>
                                            <TableCell>{student.alternative_email_id}</TableCell>
                                            <TableCell>{student.alternative_contact_no}</TableCell>
                                            <TableCell>{student.fees}</TableCell>
                                            <TableCell>{new Date(student.date_of_admission).toLocaleDateString()}</TableCell>
                                            <TableCell>{student.no_of_days}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">No students found for the selected date range.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

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
    max-width: 900px;
    margin: 80px auto;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.8); 
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    z-index: 1;
    position: relative; 
`;

const StyledTextField = styled(TextField)`
    & .MuiOutlinedInput-root {
        border-radius: 8px;
    }
`;

const StyledButton = styled(Button)`
    
  margin-top: 16px;
    background-color: #0c1c35;
    color: white;
    padding: 10px 20px;
    font-size: 1rem;
    border-radius: 8px;
    &:hover {
        background-color: #0d47a1;
    }
`;

export default StudentEnrollment;
