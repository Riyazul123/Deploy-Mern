import React, { useState } from 'react';
import { styled } from '@mui/system';
import { TextField, Button, Box, Paper, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { InputLabel, Select, MenuItem } from '@mui/material';

import NavbarScreen from './Navbar';
import BackgroundImage from '../assets/backg.jpg';

const StudentEnrollment = () => {
    const [formData, setFormData] = useState({
        student_name: '',
        student_dob: '',
        fathers_name: '',
        mothers_name: '',
        contact_no: '',
        email_id: '',
        alternative_contact_no: '',
        alternative_email_id: '',
        fees: '',
        date_of_admission: '',
        no_of_days: '',
        student_type: ''
    });

    const [filterDates, setFilterDates] = useState({
        start_date: '',
        end_date: '',
    });

    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [editData, setEditData] = useState({});


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
            const response = await fetch(baseUrl + '/api/enroll', {
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
                    student_dob: '',
                    fathers_name: '',
                    mothers_name: '',
                    contact_no: '',
                    email_id: '',
                    alternative_contact_no: '',
                    alternative_email_id: '',
                    fees: '',
                    date_of_admission: '',
                    no_of_days: '',
                    student_type: ''
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

    // Handle input changes for editing
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    // Open edit dialog
    const handleEditClick = (student) => {
        setSelectedStudent(student);
        setEditData(student);
    };


    // Submit updated student details
    const handleUpdateStudent = async () => {

        console.log("editData==> " + JSON.stringify(editData),)
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/students/${selectedStudent._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData),
            });

            const data = await response.json();
            if (response.ok) {
                setEnrolledStudents((prev) =>
                    prev.map((student) => (student._id === selectedStudent._id ? data.student : student))
                );
                setSelectedStudent(null);
            } else {
                console.error('Error updating student:', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).replace(/ /g, '-');
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
                            <Grid item xs={12}>
                                <FormControl component="fieldset" fullWidth>
                                    <FormLabel component="legend" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                                        Student Type
                                    </FormLabel>
                                    <RadioGroup
                                        row
                                        name="student_type"
                                        value={formData.student_type || ''}
                                        onChange={handleChange}
                                    >
                                        <FormControlLabel
                                            value="regular"
                                            control={<Radio />}
                                            label="Regular"
                                        />
                                        <FormControlLabel
                                            value="casual"
                                            control={<Radio />}
                                            label="Casual"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>

                            {Object.keys(formData)
                                .filter((field) => field !== 'student_type')
                                .map((field, idx) => (
                                    <Grid item xs={12} sm={6} key={idx}>
                                        <StyledTextField
                                            label={field.split('_').join(' ').toUpperCase()}
                                            name={field}
                                            type={field === 'date_of_admission' || field === 'student_dob' ? 'date' : field === 'contact_no' ? 'number' : field === 'fees' ? 'number' : field === 'alternative_contact_no' ? 'number' : field === 'no_of_days' ? 'number' : 'text'}
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
                                    <TableCell style={{ color: '#fff' }}>Student Type</TableCell>
                                    <TableCell style={{ color: '#fff' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {enrolledStudents.length > 0 ? (
                                    enrolledStudents.map((student, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{student.enrollment_id}</TableCell>
                                            <TableCell>{formatDate(student.student_dob)}</TableCell>
                                            <TableCell>{student.student_name}</TableCell>
                                            <TableCell>{student.fathers_name}</TableCell>
                                            <TableCell>{student.mothers_name}</TableCell>
                                            <TableCell>{student.contact_no}</TableCell>
                                            <TableCell>{student.email_id}</TableCell>
                                            <TableCell>{student.alternative_email_id}</TableCell>
                                            <TableCell>{student.alternative_contact_no}</TableCell>
                                            <TableCell>{student.fees}</TableCell>
                                            <TableCell>{formatDate(student.date_of_admission)}</TableCell>
                                            <TableCell>{student.no_of_days}</TableCell>
                                            <TableCell>{student.student_type}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => handleEditClick(student)}
                                                >
                                                    Edit
                                                </Button>
                                            </TableCell>

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
                <Dialog open={!!selectedStudent} onClose={() => setSelectedStudent(null)}>
                    <DialogTitle>Edit Student</DialogTitle>
                    <DialogContent>
                        <TextField label="Enrollment ID" name="enrollment_id" value={editData.enrollment_id || ''} onChange={handleEditChange} fullWidth margin="dense" disabled />
                        {/* <TextField label="Date of Birth" name="student_dob" type="date" value={editData.student_dob || ''} onChange={handleEditChange} fullWidth margin="dense" InputLabelProps={{ shrink: true }} /> */}
                        <TextField label="Student Name" name="student_name" value={editData.student_name || ''} onChange={handleEditChange} fullWidth margin="dense" />
                        <TextField label="Father's Name" name="fathers_name" value={editData.fathers_name || ''} onChange={handleEditChange} fullWidth margin="dense" />
                        <TextField label="Mother's Name" name="mothers_name" value={editData.mothers_name || ''} onChange={handleEditChange} fullWidth margin="dense" />
                        <TextField label="Contact No" name="contact_no" value={editData.contact_no || ''} onChange={handleEditChange} fullWidth margin="dense" />
                        <TextField label="Email ID" name="email_id" value={editData.email_id || ''} onChange={handleEditChange} fullWidth margin="dense" />
                        <TextField label="Alternative Email ID" name="alternative_email_id" value={editData.alternative_email_id || ''} onChange={handleEditChange} fullWidth margin="dense" />
                        <TextField label="Alternative Contact No" name="alternative_contact_no" value={editData.alternative_contact_no || ''} onChange={handleEditChange} fullWidth margin="dense" />
                        <TextField label="Fees" name="fees" type="number" value={editData.fees || ''} onChange={handleEditChange} fullWidth margin="dense" />
                        {/* <TextField label="Date of Admission" name="date_of_admission" type="date" value={editData.date_of_admission || ''} onChange={handleEditChange} fullWidth margin="dense" InputLabelProps={{ shrink: true }} /> */}
                        <TextField label="No. of Days" name="no_of_days" type="number" value={editData.no_of_days || ''} onChange={handleEditChange} fullWidth margin="dense" />
                        {/* <TextField label="Student Type" name="student_type" value={editData.student_type || ''} onChange={handleEditChange} fullWidth margin="dense" /> */}
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Student Type</InputLabel>
                            <Select
                                name="student_type"
                                value={editData.student_type || ''}
                                onChange={handleEditChange}
                            >
                                <MenuItem value="regular">Regular</MenuItem>
                                <MenuItem value="casual">Casual</MenuItem>
                            </Select>
                        </FormControl>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSelectedStudent(null)} color="secondary">Cancel</Button>
                        <Button onClick={handleUpdateStudent} color="primary" variant="contained">Save</Button>
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
