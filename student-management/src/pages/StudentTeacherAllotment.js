import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, FormControl, RadioGroup, FormControlLabel, Radio, Checkbox, Button, Grid, Divider, Box } from '@mui/material';
import axios from "axios";
import NavbarScreen from "./Navbar";
import TeacherNavbar from "./TeacherNavbar";

const StudentTeacherAllotment = () => {
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState([]);

    const baseUrl = process.env.REACT_APP_SERVER_URL;
    
    useEffect(() => {
        fetchTeachers();
        fetchStudents();
    }, []);

    const fetchTeachers = async () => {
        try {
            const res = await axios.get(`${baseUrl}/api/getAllEmployees`);
            setTeachers(res.data);
        } catch (error) {
            console.error("Error fetching teachers:", error);
        }
    };

    const fetchStudents = async () => {
        try {
            const res = await axios.get(`${baseUrl}/api/getAllStudents`);
            setStudents(res.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    useEffect(() => {
        if (selectedTeacher) {
            fetchAssignedStudents(selectedTeacher);
        }
    }, [selectedTeacher]);

    const fetchAssignedStudents = async (teacherId) => {
        try {
            const res = await axios.get(`${baseUrl}/api/getAllocationById?teacher_id=${teacherId}`);
            setSelectedStudents(res.data.map(student => student.student_id));
        } catch (error) {
            console.error("Error fetching assigned students:", error);
        }
    };

    const handleTeacherSelect = (teacherId) => {
        setSelectedTeacher(teacherId);
    };

    const handleStudentSelect = (studentId) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleUpdate = async () => {
        if (!selectedTeacher || selectedStudents.length === 0) {
            alert("Please select a teacher and at least one student.");
            return;
        }

        try {
            await axios.post(`${baseUrl}/api/allocateStudent`, {
                teacher_id: selectedTeacher,
                students: selectedStudents.map(student_id => {
                    const student = students.find(s => s.enrollment_id === student_id);
                    return { student_id, student_name: student?.student_name };
                })
            });
            alert("Allocation updated successfully!");
            setSelectedTeacher(null);
            setSelectedStudents([]);
        } catch (error) {
            console.error("Error updating allocation:", error);
            alert("Failed to update allocation.");
        }
    };

    return (
        <>
        <NavbarScreen/>

         {/* <Card sx={{ p: 4, boxShadow: 3, borderRadius: 2, maxWidth: 600, mx: "auto", mt: 5 }}>
            <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Student-Teacher Allotment
                </Typography>

                <FormControl component="fieldset" sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight="medium">Select Teacher</Typography>
                    <RadioGroup value={selectedTeacher} onChange={(e) => handleTeacherSelect(e.target.value)}>
                        {teachers.map((teacher) => (
                            <FormControlLabel
                                key={teacher.empID}
                                value={teacher.empID}
                                control={<Radio color="primary" />}
                                label={`${teacher.empName} (ID: ${teacher.empID})`}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>

                <FormControl component="fieldset" sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight="medium">Select Students</Typography>
                    {students.map((student) => (
                        <FormControlLabel
                            key={student.enrollment_id}
                            control={
                                <Checkbox
                                    checked={selectedStudents.includes(student.enrollment_id)}
                                    onChange={() => handleStudentSelect(student.enrollment_id)}
                                    color="primary"
                                />
                            }
                            label={`${student.student_name} (ID: ${student.enrollment_id})`}
                        />
                    ))}
                </FormControl>

                <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    onClick={handleUpdate}
                    sx={{ mt: 2 }}
                >
                    Update Allotment
                </Button>
            </CardContent>
        </Card> */}
  <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <Card 
                sx={{ 
                    p: 4, 
                    boxShadow: 6, 
                    borderRadius: 4, 
                    maxWidth: 700, 
                    width: "100%", 
                    bgcolor: "linear-gradient(135deg, #f8f9fa, #e9ecef)", 
                }}
            >
                <CardContent>
                    <Typography variant="h5" fontWeight="bold" gutterBottom align="center" color="primary">
                        Student-Teacher Allotment
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    {/* Select Teacher Section */}
                    <FormControl component="fieldset" sx={{ mb: 3, width: "100%" }}>
                        <Typography variant="h6" fontWeight="medium" gutterBottom>
                            Select Teacher
                        </Typography>
                        <RadioGroup value={selectedTeacher} onChange={(e) => handleTeacherSelect(e.target.value)}>
                            <Grid container spacing={2}>
                                {teachers.map((teacher) => (
                                    <Grid item xs={12} sm={6} key={teacher.empID}>
                                        <FormControlLabel
                                            value={teacher.empID}
                                            control={<Radio color="primary" />}
                                            label={<Typography variant="body1">{teacher.empName} (ID: {teacher.empID})</Typography>}
                                            sx={{ 
                                                bgcolor: "#ffffff", 
                                                p: 2, 
                                                borderRadius: 3, 
                                                boxShadow: 2, 
                                                width: "100%", 
                                                transition: "all 0.3s ease-in-out",
                                                "&:hover": { boxShadow: 4, transform: "scale(1.02)" }
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </RadioGroup>
                    </FormControl>

                    <Divider sx={{ my: 3 }} />

                    {/* Select Students Section */}
                    <FormControl component="fieldset" sx={{ mb: 3, width: "100%" }}>
                        <Typography variant="h6" fontWeight="medium" gutterBottom>
                            Select Students
                        </Typography>
                        <Grid container spacing={2}>
                            {students.map((student) => (
                                <Grid item xs={12} sm={6} key={student.enrollment_id}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selectedStudents.includes(student.enrollment_id)}
                                                onChange={() => handleStudentSelect(student.enrollment_id)}
                                                color="primary"
                                            />
                                        }
                                        label={<Typography variant="body1">{student.student_name} (ID: {student.enrollment_id})</Typography>}
                                        sx={{ 
                                            bgcolor: "#ffffff", 
                                            p: 2, 
                                            borderRadius: 3, 
                                            boxShadow: 2, 
                                            width: "100%", 
                                            transition: "all 0.3s ease-in-out",
                                            "&:hover": { boxShadow: 4, transform: "scale(1.02)" }
                                        }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </FormControl>

                    <Divider sx={{ my: 3 }} />

                    {/* Update Button */}
                    <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth
                        onClick={handleUpdate}
                        sx={{ 
                            mt: 3, 
                            py: 1.5, 
                            fontSize: "1rem", 
                            fontWeight: "bold", 
                            borderRadius: 3, 
                            boxShadow: 4, 
                            transition: "all 0.3s ease-in-out",
                            "&:hover": { boxShadow: 6, transform: "scale(1.03)" }
                        }}
                    >
                        Update Allotment
                    </Button>
                </CardContent>
            </Card>
        </Box>

        </>
       
    );
};

export default StudentTeacherAllotment;
