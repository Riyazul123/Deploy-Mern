import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Button, List, ListItem, Container, Grid } from '@mui/material';
import NavbarScreen from './Navbar';
import TeacherNavbar from './TeacherNavbar';

const TeacherDashboard = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [targets, setTargets] = useState([]);
    const [baseline, setBaseline] = useState([]);

    const baseUrl = process.env.REACT_APP_SERVER_URL;

    useEffect(() => {
        axios.get(`${baseUrl}/api/getAllocationById?teacher_id=201`)
            .then(res => setStudents(res.data))
            .catch(err => console.error("Error fetching students:", err));
    }, []);

    const fetchStudentData = (studentID) => {
        setSelectedStudent(studentID);
        setTargets([]);
        setBaseline([]);

        axios.get(`${baseUrl}/api/targetStudentBYID?studentID=${studentID}`)
            .then(res => setTargets(res.data))
            .catch(err => console.error("Error fetching targets:", err));

        axios.get(`${baseUrl}/api/baselineStudentByID?studentID=${studentID}`)
            .then(res => setBaseline(res.data))
            .catch(err => console.error("Error fetching baseline:", err));
    };

    const addTarget = () => {
        if (!selectedStudent) {
            alert("Please select a student first!");
            return;
        }
        axios.post(`${baseUrl}/api/targets`, {
            EmpID: 1,  
            StudentID: selectedStudent,
            HeaderName: "Social Skill",
            SubHeaderName: "Social Greeting",
            SD: "Example SD",
            Prompt: "Model"
        })
        .then(() => {
            alert('Target Added!');
            fetchStudentData(selectedStudent);
        })
        .catch(err => console.error("Error adding target:", err));
    };

    const addBaseline = () => {
        if (!selectedStudent) {
            alert("Please select a student first!");
            return;
        }
        axios.post(`${baseUrl}/api/baseline`, {
            StudentID: selectedStudent,
            HeaderName: "Social Skill",
            SubHeaderName: "Social Greeting",
            SD: "Example SD",
            Prompt: "Shadow"
        })
        .then(() => {
            alert('Baseline Added!');
            fetchStudentData(selectedStudent);
        })
        .catch(err => console.error("Error adding baseline:", err));
    };

    return (
        <>
        <NavbarScreen/>
          <Container maxWidth="md" sx={{ mt: 4 }}>
            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom align="center" style={{
                        paddingTop:'25px'
                    }}>
                       Note Book
                    </Typography>

                    {/* Student List */}
                    <Typography variant="h6" gutterBottom>
                        Student List
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        {students.length > 0 ? (
                            students.map(student => (
                                <Grid item key={student.student_id}>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={() => fetchStudentData(student.student_id)}
                                    >
                                        {student.student_name}
                                    </Button>
                                </Grid>
                            ))
                        ) : (
                            <Typography variant="body1" color="textSecondary">
                                No students found.
                            </Typography>
                        )}
                    </Grid>

                    {selectedStudent && (
                        <Card sx={{ mt: 2, p: 2 }}>
                            {/* Targets Section */}
                            <Typography variant="h6" gutterBottom>
                                Targets
                            </Typography>
                            <List sx={{ bgcolor: '#f5f5f5', borderRadius: 1, p: 1 }}>
                                {targets.length > 0 ? (
                                    targets.map(target => (
                                        <ListItem key={target.ID}>
                                            {target.HeaderName} → {target.SubHeaderName} ({target.Prompt})
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="textSecondary">
                                        No targets found.
                                    </Typography>
                                )}
                            </List>
                            <Button 
                                variant="contained" 
                                color="success" 
                                sx={{ mt: 1 }} 
                                onClick={addTarget}
                            >
                                Add Target
                            </Button>

                            {/* Baseline Section */}
                            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                                Baseline
                            </Typography>
                            <List sx={{ bgcolor: '#f5f5f5', borderRadius: 1, p: 1 }}>
                                {baseline.length > 0 ? (
                                    baseline.map(base => (
                                        <ListItem key={base.ID}>
                                            {base.HeaderName} → {base.SubHeaderName} ({base.Prompt})
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="textSecondary">
                                        No baseline found.
                                    </Typography>
                                )}
                            </List>
                            <Button 
                                variant="contained" 
                                color="secondary" 
                                sx={{ mt: 1 }} 
                                onClick={addBaseline}
                            >
                                Add Baseline
                            </Button>
                        </Card>
                    )}
                </CardContent>
            </Card>
        </Container>
        </>
      
    );
};

export default TeacherDashboard;
