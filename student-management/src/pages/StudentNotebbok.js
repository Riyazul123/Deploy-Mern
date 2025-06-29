import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  MenuItem,
  Grid,
  Avatar,
  Select,
  TextField,
  Button,
  FormControl,
  InputLabel,
  IconButton,
  Paper,
  Divider,
  List, ListItem, ListItemText,
  OutlinedInput, InputAdornment,
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { motion } from "framer-motion";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import NoteBookImg from '../assets/notebook.png';
import axios from 'axios';
import Popup from "../component/Popup";
import { Add, Remove } from "@mui/icons-material";
import TeacherNavbarScreen from "./TeacherNavbar";
import NavbarScreen from "./Navbar";

// const students = [
//   { name: "John Doe", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRelA6Ml7E0D4Qa1XCyDdf9ucKYuKlnFML1YA&s" },
//   { name: "Jane Smith", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRelA6Ml7E0D4Qa1XCyDdf9ucKYuKlnFML1YA&s" },
//   { name: "Michael Johnson", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRelA6Ml7E0D4Qa1XCyDdf9ucKYuKlnFML1YA&s" },
//   { name: "Emily Davis", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRelA6Ml7E0D4Qa1XCyDdf9ucKYuKlnFML1YA&s" },
//   { name: "John Doe", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRelA6Ml7E0D4Qa1XCyDdf9ucKYuKlnFML1YA&s" },
//   { name: "Jane Smith", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRelA6Ml7E0D4Qa1XCyDdf9ucKYuKlnFML1YA&s" },
//   { name: "Michael Johnson", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRelA6Ml7E0D4Qa1XCyDdf9ucKYuKlnFML1YA&s" },
//   { name: "Emily Davis", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRelA6Ml7E0D4Qa1XCyDdf9ucKYuKlnFML1YA&s" },
//   { name: "John Doe", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRelA6Ml7E0D4Qa1XCyDdf9ucKYuKlnFML1YA&s" },
//   { name: "Jane Smith", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRelA6Ml7E0D4Qa1XCyDdf9ucKYuKlnFML1YA&s" },
//   { name: "Michael Johnson", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRelA6Ml7E0D4Qa1XCyDdf9ucKYuKlnFML1YA&s" },
//   { name: "Emily Davis", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRelA6Ml7E0D4Qa1XCyDdf9ucKYuKlnFML1YA&s" }
// ];
const headerOptions = ["Personal", "Social", "Academic", "ReCreational", "Computer", "Self Help", "Vocational"];
// const promptOptions = ["Full Physical", "Light Touch", "Gesture", "Model", "Shadow", "Independent Response", "Vocal Prompt", "Partial Vocal"];
const promptOptions = ["Independent Response", "No"];
const targetpromptOptions = ["Full Physical", "Light Touch", "Gesture", "Model", "Shadow", "Vocal Prompt", "Partial Vocal", "No", "Independent Response"];





const StudentNotebook = () => {
  const baseUrl = process.env.REACT_APP_SERVER_URL;
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [headers, setHeaders] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [notesDialog, setNotesDialog] = useState(false);
  const [communicationDialog, setCommunicationDialog] = useState(false);

  const [baselineDialog, setBaseLineDialog] = useState(false);
  const empid = localStorage.getItem('empId');

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [popupType, setPopupType] = useState("error"); // Add state for popup type

  const [notes, setNotes] = useState([]);
  const [communicationType, setCommunicationType] = useState("");
  const [entries, setEntries] = useState([]);
  const [promptedCount, setPromptedCount] = useState(0);
  const [independentCount, setIndependentCount] = useState(0);

  const handleIncrement = (type) => {
    if (type === "prompted") setPromptedCount((prev) => prev + 1);
    if (type === "independent") setIndependentCount((prev) => prev + 1);
  };

  const handleDecrement = (type) => {
    if (type === "prompted" && promptedCount > 0) setPromptedCount((prev) => prev - 1);
    if (type === "independent" && independentCount > 0) setIndependentCount((prev) => prev - 1);
  };


  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setHeaders([]);
    setOpenDialog(true);
  };
  const handleNotesClick = (category) => {
    setSelectedCategory(category);
    setNotes([]);
    setNotesDialog(true);

  };



  const handleTrailSheetClick = (category, rollNumber) => {

    console.log("Roll number ===>" + rollNumber, category)
    setSelectedCategory(category);
    setBaseLineDialog(true);
  }
  const clickCommunication = (category) => {
    setSelectedCategory(category);
    setCommunicationDialog(true);

  };



  const addHeader = () => {
    setHeaders([...headers, { header: "", subHeaders: [{ name: "", sd: "", prompt: "" }] }]);
  };

  const addSubHeader = (headerIndex) => {
    const updatedHeaders = [...headers];
    updatedHeaders[headerIndex].subHeaders.push({ name: "", sd: "", prompt: "" });
    setHeaders(updatedHeaders);
  };

  const handleHeaderChange = (index, field, value) => {
    const updatedHeaders = [...headers];
    updatedHeaders[index][field] = value;
    setHeaders(updatedHeaders);
  };

  const handleSubHeaderChange = (headerIndex, subIndex, field, value) => {
    const updatedHeaders = [...headers];
    updatedHeaders[headerIndex].subHeaders[subIndex][field] = value;
    setHeaders(updatedHeaders);
  };
  const deleteHeader = (index) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);
  };

  const deleteSubHeader = (headerIndex, subIndex) => {
    const newHeaders = [...headers];
    newHeaders[headerIndex].subHeaders.splice(subIndex, 1);
    setHeaders(newHeaders);
  };


  const handleAllTrailSheetClick = async (category, rollNumber) => {
    console.log("title===>" + rollNumber, category)
    setSelectedCategory(category)

    if (category === "Target") {
      try {
        const res = await axios.get(`${baseUrl}/api/targetStudentBYID?studentID=${rollNumber}`);
        const targetData = res.data;

        // Convert DB structure to frontend format
        const formatted = [];
        console.log("Target Data==> ", targetData);
        targetData.forEach(item => {
          let index = formatted.findIndex(header => header.header === item.HeaderName);
          const subHeaderData = {
            id: item.ID,
            name: item.SubHeaderName,
            sd: item.SD,
            prompt: item.Prompt
          };

          if (index !== -1) {
            formatted[index].subHeaders.push(subHeaderData);
          } else {
            formatted.push({
              header: item.HeaderName,
              subHeaders: [subHeaderData]
            });
          }
        });

        setHeaders(formatted);
      } catch (err) {
        console.error("Error fetching target data:", err);
      }
    } else if (category === "Maintainance") {
      try {
        const res = await axios.get(`${baseUrl}/api/maintenance?studentId=${rollNumber}`);
        const targetData = res.data;

        // Convert DB structure to frontend format
        const formatted = [];
        console.log("Target Data==> ", targetData);
        targetData.forEach(item => {
          let index = formatted.findIndex(header => header.header === item.HeaderName);
          const subHeaderData = {
            id: item.ID,
            name: item.SubHeaderName,
            sd: item.SD,
            prompt: item.Prompt
          };

          if (index !== -1) {
            formatted[index].subHeaders.push(subHeaderData);
          } else {
            formatted.push({
              header: item.HeaderName,
              subHeaders: [subHeaderData]
            });
          }
        });

        setHeaders(formatted);
      } catch (err) {
        console.error("Error fetching target data:", err);
      }
    } else {
      setHeaders([]); // Clear if switching to another category
    }
    //setHeaders([]);
  }

  const handleSubmit = async (title, empId, rollNumber, headers) => {
    const payload = {
      EmpID: empId,
      StudentID: rollNumber,
      headers: headers.map(item => ({
        headerName: item.header,
        subHeaders: item.subHeaders.map(sub => ({
          name: sub.name,
          sd: sub.sd,
          prompt: sub.prompt
        }))
      }))
    };

    console.log("Payload", payload);
    console.log("Title ===> ", title);


    if (title == "Target") {
      await axios.post(`${baseUrl}/api/targets`, payload);
      alert("✅ Target Data Submitted");
      setHeaders([]);
      //call target api
    }
    else if (title == "Baseline") {
      // call baseline api
      await axios.post(`${baseUrl}/api/baseline`, payload);
      alert("✅ Baseline Data Submitted");
      setHeaders([]);
    }
    else {
      //maintainance api call

    }


  }

  const handleUpdateTarget = async (category, empid, studentId, headers) => {

    console.log("headers  ", headers);
    if (category === "Target") {
      const targetPayload = [];

      headers.forEach((header) => {
        header.subHeaders.forEach((sub) => {
          targetPayload.push({
            id: sub.id, // this is required for update
            EmpID: empid,
            studentID: studentId,
            HeaderName: header.header,
            SubHeaderName: sub.name,
            SD: sub.sd,
            Prompt: sub.prompt
          });
        });
      });

      console.log("targetPayload====> ", targetPayload);
      try {
        const res = await axios.put(`${baseUrl}/api/getupdateTargetData`, {
          targets: targetPayload
        });

        if (res.data.success) {
          alert("🎯 Target updated successfully!");
          // optionally reload data again here if needed
        } else {
          alert("⚠️ Some targets were skipped or moved to Maintenance.");
        }
      } catch (err) {
        console.error("Target update error:", err);
        alert("❌ Failed to update Target data.");
      }
    }
  };


  const [formData, setFormData] = useState({
    EmpID: "",
    StudentID: "",
    Anticident: "",
    Behaviour: "",
    Consequence: "",
    Duration: "",
    FrequencyCount: "",
    DateTime: "",
  });

  // State to hold multiple behaviour entries
  const [behaviours, setBehaviours] = useState([]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  // Add behaviour entry to list
  const addBehaviour = () => {
    setBehaviours([...behaviours, formData]);
    setFormData((prev) => ({
      EmpID: prev.EmpID,
      StudentID: prev.StudentID,
      Anticident: "",
      Behaviour: "",
      Consequence: "",
      Duration: "",
      FrequencyCount: "",
      DateTime: "",
    }));
  };

  // Remove behaviour entry from list
  const removeBehaviour = (index) => {
    setBehaviours(behaviours.filter((_, i) => i !== index));
  };

  // Submit all behaviours to API
  const submitBehaviours = async (empId, rollNumber) => {
    console.log("empId ,rollNumber", empId, rollNumber);
    console.log("Behaviour", behaviours);
    if (behaviours.length === 0) {
      alert("Please add at least one behaviour before submitting.");
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/api/createBehaviour`, behaviours);
      console.log(response.data);

      setMessage("Behaviour Submitted Successfully");
      setPopupType("success"); // Set popup type to success (green)
      setShowPopup(true);

      setOpenDialog(false); // Close dialog on success
      setBehaviours([]); // Clear behaviour list
    } catch (error) {
      setMessage("Error submitting behaviours");
      setPopupType("error"); // Set popup type to success (green)
      setShowPopup(true);

      console.error("Error submitting behaviours:", error);
    }
  };

  const handleSubmitNotes = async (empId, rollNumber) => {
    console.log("empId ,rollNumber", empId, rollNumber);
    const reqBody = [
      {
        EmpID: empId,
        studentID: rollNumber,
        Notes: notes
      }
    ]

    if (notes.length === 0) {
      alert("Please add at least one note before submitting.");
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/api/createNotes`, reqBody);
      console.log(response.data);

      setMessage("Note Submitted Successfully");
      setPopupType("success"); // Set popup type to success (green)
      setShowPopup(true);

      setNotesDialog(false); // Close dialog on success
      setNotes([]); // Clear behaviour list
    } catch (error) {
      setMessage("Error submitting Notes");
      setPopupType("error"); // Set popup type to success (green)
      setShowPopup(true);

      console.error("Error submitting behaviours:", error);
    }

  }
  const handleEyeCommunication = async (title, empId, rollNumber,promptedCount,independentCount) => {


    const reqBody=
      {
      studentID : rollNumber, 
      EmpID : empId, 
      CommunicationType : title,
      Prompted : promptedCount, 
      Independent: independentCount 
    }

    try {
      const response = await axios.post(`${baseUrl}/api/createEyeCommunication`, reqBody);
      console.log(response.data);

      setMessage("Behaviour submitted Successfully");
      setPopupType("success"); // Set popup type to success (green)
      setShowPopup(true);

      setCommunicationDialog(false); // Close dialog on success
      setPromptedCount(0);
      setIndependentCount(0);
    } catch (error) {
      setMessage("Error submitting behaviours");
      setPopupType("error"); // Set popup type to success (green)
      setShowPopup(true);

      console.error("Error submitting behaviours:", error);
    }
  
   
    console.log("title,empId, rollNumber", title, empId, rollNumber,promptedCount,independentCount)

    
  }

  const handleCommunication = async (title, empId, rollNumber, entries) => {
  const queryParams = new URLSearchParams({
    title,
    empId,
    rollNumber
  });

  try {
    const response = await fetch(`${baseUrl}/api/createCommunication?${queryParams.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entries)
    });

    const result = await response.json();
    if (response.ok) {
      console.log("Success:", result.message);
      setMessage("All communication records processed successfully!");
      setPopupType("success"); // Set popup type to success (green)
      setShowPopup(true);
      setEntries([]);
      // You can show a toast or notification here
    } else {
      console.error("Error:", result.error);
      setMessage("Error submitting ");
      setPopupType("error"); // Set popup type to success (green)
      setShowPopup(true);
      // Optionally show error message to user
    }
  } catch (error) {
    console.error("Network error:", error);
    setMessage("Network Error");
      setPopupType("error"); // Set popup type to success (green)
      setShowPopup(true);
    // Optionally show a network error message
  }
};


  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      EmpID: empid || prevState.EmpID, // Preserve previous if undefined
      StudentID: selectedStudent?.rollNumber || prevState.StudentID, // Preserve previous if undefined
    }));
  }, [empid, selectedStudent]);




  useEffect(() => {

    const empid = localStorage.getItem('empId')
    console.log("empid==> " + empid);
    // ✅ Call the API to fetch students by Teacher ID
    axios.get(`${baseUrl}/api/getAllocationById?teacher_id=${empid}`)
      .then(response => {
        if (response.data) {
          // ✅ Map response data to match the structure
          const formattedStudents = response.data.map(student => ({
            id: student.student_id,
            name: student.student_name,
            image: `https://via.placeholder.com/150?text=${student.student_name}`, // Placeholder image
            rollNumber: student.student_id
          }));
          setStudents(formattedStudents);
        }
      })
      .catch(error => console.error('Error fetching students:', error));
  }, []);



  //for communication
  const handleAddEntry = () => {
    if (!communicationType) {
      alert("Please enter a Communication Type.");
      return;
    }

    const newEntry = {
      type: communicationType,
      prompted: promptedCount,
      independent: independentCount,
    };

    setEntries(prev => [...prev, newEntry]);
    setCommunicationType("");
    setPromptedCount(0);
    setIndependentCount(0);
  };

  const handleRemoveEntry = (index) => {
    const updated = [...entries];
    updated.splice(index, 1);
    setEntries(updated);
  };

  const handleSubmitAll = () => {
    if (entries.length === 0) {
      alert("Please add at least one communication entry.");
      return;
    }

    // Replace this with your actual submit function
    console.log("Submitting:", entries);
    handleCommunication(selectedCategory, empid, selectedStudent.rollNumber, entries);
    setCommunicationDialog(false);
  };

  //end



  return (
    <>
      <TeacherNavbarScreen />
      <Box sx={{ p: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        <Typography variant="h4" gutterBottom textAlign="center" fontWeight="bold" color="primary">
          Student Notebook
        </Typography>
        {students.length > 0 ? (
          <Grid container spacing={3} justifyContent="center">
            {students.map((student, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      textAlign: "center",
                      borderRadius: 3,
                      boxShadow: 3,
                      backgroundColor: "white",
                      transition: "0.3s",
                      "&:hover": { backgroundColor: "#e3f2fd" },
                    }}
                    onClick={() => setSelectedStudent(student)}
                  >
                    <CardContent>
                      <Avatar src={student.image} alt={student.name} sx={{ width: 80, height: 80, margin: "auto", mb: 1 }} />
                      <Typography variant="h6" fontWeight="bold">{student.name}</Typography>
                      <Typography variant="body2" color="textSecondary">Roll No: {student.rollNumber}</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" align="center" color="textSecondary" sx={{ mt: 4 }}>
            No Students Available
          </Typography>
        )}

        {/* <Grid container spacing={3} justifyContent="center">
          {students.map((student, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card
                  sx={{
                    cursor: "pointer",
                    textAlign: "center",
                    borderRadius: 3,
                    boxShadow: 3,
                    backgroundColor: "white",
                    transition: "0.3s",
                    "&:hover": { backgroundColor: "#e3f2fd" },
                  }}
                  onClick={() => setSelectedStudent(student)}
                >
                  <CardContent>
                    <Avatar src={student.image} alt={student.name} sx={{ width: 80, height: 80, margin: "auto", mb: 1 }} />
                    <Typography variant="h6" fontWeight="bold">{student.name}</Typography>
                    <Typography variant="body2" color="textSecondary">Roll No: {student.rollNumber}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid> */}

        {/* Dialog for Student Notebook */}
        <Dialog
          open={Boolean(selectedStudent)}
          onClose={() => setSelectedStudent(null)}
          fullWidth maxWidth="md"
          sx={{
            "& .MuiPaper-root": {
              borderRadius: 4, padding: 2.7, overflow: "hidden",
              // backgroundImage: "url('https://as1.ftcdn.net/jpg/01/41/57/06/1000_F_141570686_qpg7B0xVqpHywTBW3KM8GYZLqqE5eVaK.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }
          }}
          TransitionComponent={motion.div}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <DialogTitle sx={{ textAlign: "center", fontSize: 22, fontWeight: "bold", color: "#1976d2" }}>
            {selectedStudent?.name}'s Notebook
          </DialogTitle>

          <DialogContent>

            <motion.div
              initial={{ rotateY: 90 }}
              animate={{ rotateY: 0 }}
              exit={{ rotateY: 90 }}
              transition={{ duration: 0.5 }}
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {/* Single Scroll Wrapper */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 2,
                  maxHeight: { xs: "500px", md: "none" }, // ✅ Single Scroll on mobile
                  overflowY: "auto", // ✅ Single scroll
                }}
              >
                {/* Left Section */}
                <Box
                  sx={{
                    flex: 1,
                    padding: 3,
                    borderRight: { md: "2px solid #ddd" },
                    backgroundColor: "rgba(227, 242, 253, 0.9)",
                    borderRadius: { xs: "8px", md: "8px 0 0 8px" },
                  }}
                >
                  {["TrialSheet", "Behaviour", "Notes"].map((title, index) => (
                    <motion.div key={index} whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.97 }}>
                      <Card
                        sx={{
                          marginBottom: 2,
                          boxShadow: 3,
                          borderRadius: 2,
                          backgroundColor: "#e3f2fd",
                        }}
                        //                        onClick={() => title === "TrailSheet" ? handleTrailSheetClick(title, selectedStudent.rollNumber) : handleCategoryClick(title)}
                        onClick={() => {
                          if (title === "TrialSheet") {
                            handleTrailSheetClick(title, selectedStudent.rollNumber);
                          } else if (title === "Notes") {
                            handleNotesClick(title);
                          } else {
                            handleCategoryClick(title);
                          }
                        }}


                      >
                        <CardContent>
                          <Typography variant="h6" fontWeight="bold" color="primary">
                            {title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Details about {title}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </Box>

                {/* Right Section */}
                <Box
                  sx={{
                    flex: 1,
                    padding: 3,
                    backgroundColor: "rgba(255, 235, 238, 0.9)",
                    borderRadius: { xs: "8px", md: "0 8px 8px 0" },
                  }}
                >
                  {["Communication", "Eye Contact", "Name Calling"].map((title, index) => (
                    <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Card
                        sx={{
                          marginBottom: 2,
                          boxShadow: 3,
                          borderRadius: 2,
                          backgroundColor: "#ffebee",
                        }}
                        onClick={() => {
                          clickCommunication(title)
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6" fontWeight="bold" color="secondary">
                            {title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Details about {title}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </Box>
              </Box>
            </motion.div>

            <Dialog
              open={openDialog}
              onClose={(event, reason) => { if (reason !== "backdropClick") setOpenDialog(false); }}
              fullWidth maxWidth="md"
              sx={{
                "& .MuiPaper-root": {
                  borderRadius: 4, padding: 2.7, overflow: "hidden",
                  // backgroundImage: "url('https://as1.ftcdn.net/jpg/01/41/57/06/1000_F_141570686_qpg7B0xVqpHywTBW3KM8GYZLqqE5eVaK.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }
              }}
              TransitionComponent={motion.div}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              {/* Title */}
              <DialogTitle
                sx={{ fontSize: 22, fontWeight: "bold", color: "#333", textAlign: "center" }}
              >
                {selectedCategory}
                <IconButton onClick={() => setOpenDialog(false)} sx={{ position: "absolute", right: 8, top: 8 }}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>

              {/* Scrollable Content */}
              <DialogContent dividers sx={{ maxHeight: "60vh", overflowY: "auto", padding: 2 }}>
                <Grid container spacing={2}>
                  {/* Row 1: Anticident & Behaviour */}
                  <Grid item xs={6}>
                    <TextField
                      label="Antecedent"
                      name="Anticident"
                      value={formData.Anticident}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={3}
                      sx={{ mt: 2, backgroundColor: "#ffffff", borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Behaviour"
                      name="Behaviour"
                      value={formData.Behaviour}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={3}
                      sx={{ mt: 2, backgroundColor: "#ffffff", borderRadius: 2 }}
                    />
                  </Grid>

                  {/* Row 2: Consequence & Duration */}
                  <Grid item xs={6}>
                    <TextField
                      label="Consequence"
                      name="Consequence"
                      value={formData.Consequence}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={3}
                      sx={{ mt: 2, backgroundColor: "#ffffff", borderRadius: 2 }}
                    />
                  </Grid>
                  {/* <Grid item xs={6}>
        <TextField
          label="Duration (HH:MM:SS)"
          name="Duration"
          type="time"
          value={formData.Duration}
          onChange={handleChange}
          fullWidth
          sx={{ mt: 2, backgroundColor: "#ffffff", borderRadius: 2 }}
          inputProps={{ step: 1 }} // Allows seconds selection
        />
      </Grid> */}
                  <Grid item xs={6}>
                    <FormControl fullWidth sx={{ mt: 2, backgroundColor: "#ffffff", borderRadius: 2, boxShadow: 2 }}>
                      <InputLabel htmlFor="duration-input">Duration (HH:MM:SS)</InputLabel>
                      <OutlinedInput
                        id="duration-input"
                        name="Duration"
                        type="time"
                        value={formData.Duration}
                        onChange={handleChange}
                        label="Duration (HH:MM:SS)"
                        inputProps={{ step: 1 }} // Allows selecting seconds
                        sx={{
                          borderRadius: 2,
                          backgroundColor: "#f9f9f9",
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#1976d2" },
                            "&:hover fieldset": { borderColor: "#155a9b" },
                            "&.Mui-focused fieldset": { borderColor: "#003c8f" },
                          },
                        }}
                        startAdornment={
                          <InputAdornment position="start">
                            <AccessTimeIcon sx={{ color: "#1976d2" }} />
                          </InputAdornment>
                        }
                      />
                    </FormControl>

                  </Grid>


                  {/* Row 3: Frequency Count & Date */}
                  <Grid item xs={6}>
                    <TextField
                      label="Frequency Count"
                      name="FrequencyCount"
                      value={formData.FrequencyCount}
                      onChange={handleChange}
                      fullWidth
                      sx={{ mt: 2, backgroundColor: "#ffffff", borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField

                      name="DateTime"
                      type="date"
                      value={formData.DateTime}
                      onChange={handleChange}
                      fullWidth
                      sx={{ mt: 2, backgroundColor: "#ffffff", borderRadius: 2 }}
                    />
                  </Grid>

                  {/* Full Width "Add Behaviour" Button */}
                  <Grid item xs={3}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={addBehaviour}
                      sx={{
                        mt: 3,
                        width: "100%",
                        fontSize: 16,
                        fontWeight: "bold",
                        padding: "12px",
                        background: "linear-gradient(135deg, #1976d2, #1259a3)",
                        "&:hover": { background: "#1259a3" },
                        borderRadius: 3
                      }}
                    >
                      Add Behaviour
                    </Button>
                  </Grid>

                  {/* Display List of Added Behaviours */}
                  {/* {behaviours.length > 0 && (
                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        {behaviours.map((item, index) => (
                          <Grid item xs={12} key={index}>
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                              <Card sx={{ borderRadius: 3, boxShadow: 3, background: "#e3f2fd" }}>
                                <CardContent>
                                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                    {item.EmpID} - {item.StudentID} - {item.Behaviour}
                                  </Typography>
                                  <IconButton edge="end" color="error" onClick={() => removeBehaviour(index)} sx={{ float: "right" }}>
                                    <DeleteIcon />
                                  </IconButton>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </Grid>
                        ))}
                      </Grid>
                  )} */}


                  {behaviours.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ marginTop: "20px" }}
                    >
                      <TableContainer component={Paper} sx={{ maxHeight: 300, overflow: "auto", borderRadius: 3, boxShadow: 3 }}>
                        <Table stickyHeader>
                          {/* Table Header */}
                          <TableHead>
                            <TableRow sx={{ backgroundColor: "rgba(255, 235, 238, 0.9)" }}>
                              <TableCell sx={{ color: "black", fontWeight: "bold" }}>Emp ID</TableCell>
                              <TableCell sx={{ color: "black", fontWeight: "bold" }}>Student ID</TableCell>
                              <TableCell sx={{ color: "black", fontWeight: "bold" }}>Anticident</TableCell>
                              <TableCell sx={{ color: "black", fontWeight: "bold" }}>Behaviour</TableCell>
                              <TableCell sx={{ color: "black", fontWeight: "bold" }}>Consequence</TableCell>
                              <TableCell sx={{ color: "black", fontWeight: "bold" }}>Duration</TableCell>
                              <TableCell sx={{ color: "black", fontWeight: "bold" }}>Frequency Count</TableCell>
                              <TableCell sx={{ color: "black", fontWeight: "bold" }}>Date</TableCell>
                              <TableCell sx={{ color: "black", fontWeight: "bold" }}>Actions</TableCell>
                            </TableRow>
                          </TableHead>

                          {/* Table Body */}
                          <TableBody>
                            {behaviours.map((item, index) => (
                              <TableRow key={index} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f1faff" } }}>
                                <TableCell>{item.EmpID}</TableCell>
                                <TableCell>{item.StudentID}</TableCell>
                                <TableCell>{item.Anticident}</TableCell>
                                <TableCell>{item.Behaviour}</TableCell>
                                <TableCell>{item.Consequence}</TableCell>
                                <TableCell>{item.Duration}</TableCell>
                                <TableCell>{item.FrequencyCount}</TableCell>
                                <TableCell>{item.DateTime}</TableCell>
                                <TableCell>
                                  <IconButton edge="end" color="error" onClick={() => removeBehaviour(index)}>
                                    <DeleteIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </motion.div>
                  )}

                </Grid>
              </DialogContent>

              {/* Full Width "Submit All" Button */}
              <DialogActions sx={{ justifyContent: "center", padding: "16px" }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    fontSize: 18,
                    fontWeight: "bold",
                    padding: "14px",
                    background: "linear-gradient(135deg, #ff9800, #e65100)",
                    "&:hover": { background: "#e65100" },
                    borderRadius: 3, width: '30%'

                  }}
                  onClick={() => submitBehaviours(empid, selectedStudent.rollNumber)}
                >
                  ✅ Submit All
                </Button>
              </DialogActions>


            </Dialog>

            <Dialog
              open={notesDialog}
              onClose={(event, reason) => { if (reason !== "backdropClick") setNotesDialog(false); }}
              disableEscapeKeyDown
              fullWidth
              maxWidth="md"
              sx={{
                "& .MuiPaper-root": {
                  borderRadius: 6,
                  padding: 3,
                  overflow: "hidden",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(15px)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                },
              }}
              TransitionComponent={motion.div}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
            >
              {/* Dialog Header */}
              <DialogTitle
                sx={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#ffffff",
                  textAlign: "center",
                  position: "relative",
                  background: "linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)",
                  padding: "18px 24px",
                  borderRadius: "8px 8px 0 0",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
                }}
              >
                {selectedCategory}
                <IconButton
                  onClick={() => setNotesDialog(false)}
                  sx={{ position: "absolute", right: 12, top: 12, color: "white" }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>

              {/* Dialog Content */}
              <DialogContent dividers sx={{ maxHeight: "60vh", overflowY: "auto", padding: 3 }}>
                <TextField
                  label="Write your notes here..."
                  placeholder="Type up to 3000 characters"
                  multiline
                  rows={8}
                  fullWidth
                  variant="outlined"
                  inputProps={{ maxLength: 3000 }}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  sx={{
                    marginBottom: 3,
                    fontSize: "16px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 4,
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "#8E2DE2",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#4A00E0",
                      },
                    },
                  }}
                />
              </DialogContent>

              {/* Dialog Actions */}
              <DialogActions sx={{ justifyContent: "center", paddingBottom: 3 }}>
                <Button
                  variant="contained"
                  onClick={() => handleSubmitNotes(empid, selectedStudent.rollNumber)}
                  disabled={notes.length === 0}
                  sx={{
                    borderRadius: 5,
                    paddingX: 5,
                    textTransform: "none",
                    fontSize: 17,
                    fontWeight: "bold",
                    color: "white",
                    background: "linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)",
                    boxShadow: "0 4px 12px rgba(255, 65, 108, 0.4)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%)",
                      transform: "scale(1.05)",
                      transition: "all 0.3s ease",
                    },
                    "&:disabled": {
                      background: "rgba(255, 255, 255, 0.3)",
                      color: "#ccc",
                    },
                  }}
                >
                  Submit Notes
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={communicationDialog}
              onClose={(event, reason) => { if (reason !== "backdropClick") setCommunicationDialog(false); }}

              fullWidth maxWidth="md" scroll="body"
              sx={{
                "& .MuiPaper-root": {
                  borderRadius: 4, padding: 2.7,
                  // backgroundImage: "url('https://as1.ftcdn.net/jpg/01/41/57/06/1000_F_141570686_qpg7B0xVqpHywTBW3KM8GYZLqqE5eVaK.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",

                  flexDirection: "column",
                  maxHeight: "80vh",



                }
              }}
              TransitionComponent={motion.div}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >

              {selectedCategory != "Communication" &&
                <>
                  <DialogTitle
                    sx={{ fontSize: 22, fontWeight: "bold", color: "#333", textAlign: "center" }}
                  >
                    {selectedCategory}
                    <IconButton onClick={() => setCommunicationDialog(false)} sx={{ position: "absolute", right: 8, top: 8 }}>
                      <CloseIcon />
                    </IconButton>
                  </DialogTitle>

                  {/* Content */}
                  <DialogContent sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    {/* Prompted Counter */}
                    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" mb={3} p={2} sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#444" }}>Prompted</Typography>
                      <Box display="flex" alignItems="center">
                        <IconButton onClick={() => handleDecrement("prompted")} sx={{ backgroundColor: "#e57373", color: "#fff", "&:hover": { backgroundColor: "#d32f2f" } }}>
                          <Remove />
                        </IconButton>
                        <Typography variant="h6" sx={{ marginX: 2, minWidth: 40, textAlign: "center" }}>{promptedCount}</Typography>
                        <IconButton onClick={() => handleIncrement("prompted")} sx={{ backgroundColor: "#81c784", color: "#fff", "&:hover": { backgroundColor: "#388e3c" } }}>
                          <Add />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Independent Counter */}
                    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" p={2} sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#444" }}>Independent</Typography>
                      <Box display="flex" alignItems="center">
                        <IconButton onClick={() => handleDecrement("independent")} sx={{ backgroundColor: "#e57373", color: "#fff", "&:hover": { backgroundColor: "#d32f2f" } }}>
                          <Remove />
                        </IconButton>
                        <Typography variant="h6" sx={{ marginX: 2, minWidth: 40, textAlign: "center" }}>{independentCount}</Typography>
                        <IconButton onClick={() => handleIncrement("independent")} sx={{ backgroundColor: "#81c784", color: "#fff", "&:hover": { backgroundColor: "#388e3c" } }}>
                          <Add />
                        </IconButton>
                      </Box>
                    </Box>
                  </DialogContent>

                  {/* Actions */}
                  <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEyeCommunication(selectedCategory, empid, selectedStudent.rollNumber,promptedCount,independentCount)}
                      disabled={promptedCount === 0 && independentCount === 0}
                      sx={{ borderRadius: 3, paddingX: 4, textTransform: "none", fontSize: 16 }}
                    >
                      Submit
                    </Button>
                  </DialogActions>

                </>
              }

              {selectedCategory === "Communication" && (
                <>
                  <DialogTitle
                    sx={{ fontSize: 22, fontWeight: "bold", color: "#333", textAlign: "center" }}
                  >
                    {selectedCategory}
                    <IconButton onClick={() => setCommunicationDialog(false)} sx={{ position: "absolute", right: 8, top: 8 }}>
                      <CloseIcon />
                    </IconButton>
                  </DialogTitle>

                  <DialogContent sx={{ px: 4, py: 3 }}>
                    {/* Communication Type Input */}
                    <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                      <Typography variant="h6" gutterBottom color="primary">
                        Add Communication Record
                      </Typography>


                      <TextField
                        label="Communication Type"
                        fullWidth
                        value={communicationType}
                        onChange={(e) => setCommunicationType(e.target.value)}
                        sx={{ mt: 2 }}
                      />

                      {/* Prompted and Independent Counters */}
                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        {["Prompted", "Independent"].map((label, idx) => (
                          <Grid item xs={6} key={label}>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>{label}</Typography>
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="space-between"
                              sx={{
                                backgroundColor: "#f5f5f5",
                                p: 1.5,
                                borderRadius: 2,
                                boxShadow: 1,
                              }}
                            >
                              <IconButton onClick={() => handleDecrement(label.toLowerCase())}>
                                <Remove />
                              </IconButton>
                              <Typography variant="h6">
                                {label === "Prompted" ? promptedCount : independentCount}
                              </Typography>
                              <IconButton onClick={() => handleIncrement(label.toLowerCase())}>
                                <Add />
                              </IconButton>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>

                      {/* Add Entry Button */}
                      <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        onClick={handleAddEntry}
                        sx={{ mt: 3, borderRadius: 3, textTransform: "none" }}
                      >
                        Add Entry
                      </Button>
                    </Paper>

                    {/* Scrollable Entry Preview Box */}
                    {entries.length > 0 && (
                      <Box>
                        <Typography variant="h6" color="primary" gutterBottom>
                          Added Entries
                        </Typography>

                        <Divider sx={{ mb: 2 }} />

                        <Box
                          sx={{
                            maxHeight: 200, // Only this section is scrollable
                            overflowY: "auto",
                            pr: 1,
                          }}
                        >
                          {entries.map((entry, index) => (
                            <Paper
                              key={index}
                              elevation={0}
                              sx={{
                                mb: 2,
                                p: 2,
                                border: "1px solid #ddd",
                                borderRadius: 2,
                                backgroundColor: "#fff",
                              }}
                            >
                              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                  <Typography variant="subtitle2"><strong>Type:</strong> {entry.type}</Typography>
                                  <Typography variant="body2"><strong>Prompted:</strong> {entry.prompted}</Typography>
                                  <Typography variant="body2"><strong>Independent:</strong> {entry.independent}</Typography>
                                </Box>
                                <IconButton
                                  onClick={() => handleRemoveEntry(index)}
                                  size="small"
                                  sx={{ color: "error.main" }}
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Paper>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </DialogContent>

                  {/* Submit Button - stays at bottom */}
                  <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmitAll}
                      sx={{
                        px: 5,
                        py: 1.5,
                        borderRadius: 3,
                        textTransform: "none",
                        fontSize: "16px",
                        boxShadow: 2,
                      }}
                      disabled={entries.length === 0}
                    >
                      Submit All
                    </Button>
                  </DialogActions>
                </>
              )}


            </Dialog>



            {/* For Target, BaseLine ,Maintainance */}
            <Dialog
              open={baselineDialog}
              onClose={(event, reason) => { if (reason !== "backdropClick") setBaseLineDialog(false); }} disableEscapeKeyDown
              fullWidth maxWidth="md"
              sx={{
                "& .MuiPaper-root": {
                  borderRadius: 4,
                  padding: 2.7,
                  overflow: "hidden",


                  // backgroundImage: "url('https://as1.ftcdn.net/jpg/01/41/57/06/1000_F_141570686_qpg7B0xVqpHywTBW3KM8GYZLqqE5eVaK.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center"

                }
              }}
              TransitionComponent={motion.div}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <DialogTitle sx={{ textAlign: "center", fontSize: 22, fontWeight: "bold", color: "#1976d2" }}>
                {selectedCategory}
                <IconButton onClick={() => setBaseLineDialog(false)} sx={{ position: "absolute", right: 8, top: 8 }}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent style={
                {
                  height: '500px'
                }
              }>
                <motion.div
                  initial={{ rotateY: 90 }}
                  animate={{ rotateY: 0 }}
                  exit={{ rotateY: 90 }}
                  transition={{ duration: 0.5 }}
                  style={{ display: "flex", flexDirection: "column", gap: "20px" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      gap: 2,
                      height: { xs: "auto", md: "100vh" },
                      overflow: { xs: "visible", md: "hidden" },
                    }}
                  >

                    {/* ✅ Left Section */}
                    <Box
                      sx={{
                        flex: 1,
                        padding: 3,
                        backgroundColor: "rgba(227, 242, 253, 0.9)",
                        borderRadius: { xs: "8px", md: "8px 0 0 8px" },
                        position: { md: "sticky" },
                        top: 0,
                        height: { md: "100vh" },
                        overflowY: { md: "hidden" },
                      }}
                    >
                      {["Baseline", "Target", "Maintainance"].map((title, index) => (
                        <motion.div key={index} whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.97 }}>
                          <Card
                            sx={{ marginBottom: 2, boxShadow: 3, borderRadius: 2, backgroundColor: "#e3f2fd" }}
                            onClick={() => handleAllTrailSheetClick(title, selectedStudent.rollNumber)}
                          >
                            <CardContent>
                              <Typography variant="h6" fontWeight="bold" color="primary">{title}</Typography>
                              <Typography variant="body2" color="text.secondary">Details about {title}</Typography>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </Box>

                    {/* ✅ Right Section */}
                    <Box
                      sx={{
                        flex: 1,
                        padding: 3,
                        backgroundColor: "rgba(255, 235, 238, 0.9)",
                        borderRadius: { xs: "8px", md: "0 8px 8px 0" },
                        overflowY: "auto",
                        maxHeight: { xs: "none", md: "100vh" },
                      }}
                    >
                      {selectedCategory === "Baseline" && (
                        <>
                          <Typography variant="h6" textAlign="center" color="secondary" fontWeight="bold">
                            {selectedCategory} - Select Header
                          </Typography>

                          {headers.map((item, index) => (
                            <Card key={index} sx={{ marginBottom: 2, padding: 2, boxShadow: 3, borderRadius: 2 }}>

                              {/* ✅ DELETE HEADER BUTTON */}
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => deleteHeader(index)}
                                sx={{ float: 'right', mb: 1 }}
                              >
                                🗑 Delete Header
                              </Button>

                              <FormControl fullWidth margin="dense">
                                <InputLabel>Select Header</InputLabel>
                                <Select
                                  value={item.header}
                                  onChange={(e) => handleHeaderChange(index, "header", e.target.value)}
                                >
                                  {headerOptions.map((header) => (
                                    <MenuItem key={header} value={header}>{header}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>

                              {item.header && (
                                <>
                                  {item.subHeaders.map((sub, subIndex) => (
                                    <Paper
                                      key={subIndex}
                                      sx={{
                                        padding: 2,
                                        marginTop: 2,
                                        backgroundColor: "#fce4ec",
                                        borderRadius: 2,
                                        boxShadow: 2,
                                        position: "relative"
                                      }}
                                    >
                                      <TextField
                                        fullWidth
                                        margin="dense"
                                        label="Sub Header"
                                        value={sub.name}
                                        onChange={(e) =>
                                          handleSubHeaderChange(index, subIndex, "name", e.target.value)
                                        }
                                      />
                                      <TextField
                                        fullWidth
                                        margin="dense"
                                        label="SD"
                                        value={sub.sd}
                                        onChange={(e) =>
                                          handleSubHeaderChange(index, subIndex, "sd", e.target.value)
                                        }
                                      />
                                      <FormControl fullWidth margin="dense">
                                        <InputLabel>Prompt</InputLabel>
                                        <Select
                                          value={sub.prompt}
                                          onChange={(e) =>
                                            handleSubHeaderChange(index, subIndex, "prompt", e.target.value)
                                          }
                                        >
                                          {promptOptions.map((prompt) => (
                                            <MenuItem key={prompt} value={prompt}>{prompt}</MenuItem>
                                          ))}
                                        </Select>
                                      </FormControl>

                                      {/* ✅ DELETE SUB HEADER BUTTON */}
                                      <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={() => deleteSubHeader(index, subIndex)}
                                        sx={{ float: 'right', mt: 1 }}
                                      >
                                        ❌ Delete Subheader
                                      </Button>
                                    </Paper>
                                  ))}

                                  <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => addSubHeader(index)}
                                    sx={{ mt: 1 }}
                                  >
                                    ➕ Add Sub Header
                                  </Button>
                                </>
                              )}
                            </Card>
                          ))}

                          <Button
                            variant="contained"

                            onClick={addHeader}
                            sx={{ mt: 2 }}
                          >
                            ➕ Add Header
                          </Button>

                          <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={() => handleSubmit(selectedCategory, empid, selectedStudent.rollNumber, headers)}
                          >
                            ✅ Submit
                          </Button>
                        </>
                      )}

                      {selectedCategory === "Target" && (
                        <>
                          <Typography variant="h6" textAlign="center" color="secondary" fontWeight="bold">
                            Target - Edit & Manage Headers
                          </Typography>

                          {
                            headers.length === 0 ? (
                              <Typography variant="body1" align="center" color="text.secondary">
                                🚫 No data found
                              </Typography>
                            ) :
                              headers.map((item, index) => (
                                <Card key={index} sx={{ marginBottom: 2, padding: 2, boxShadow: 3, borderRadius: 2 }}>
                                  {/* <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => deleteHeader(index)}
                                sx={{ float: 'right', mb: 1 }}
                              >
                                🗑 Delete Header
                              </Button> */}



                                  <FormControl fullWidth margin="dense">
                                    <InputLabel>Select Header</InputLabel>
                                    <Select
                                      value={item.header}
                                      onChange={(e) => handleHeaderChange(index, "header", e.target.value)}
                                    >
                                      {headerOptions.map((header) => (
                                        <MenuItem key={header} value={header}>{header}</MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>

                                  {item.header && item.subHeaders.map((sub, subIndex) => (
                                    <Paper
                                      key={subIndex}
                                      sx={{
                                        padding: 2,
                                        marginTop: 2,
                                        backgroundColor: "#fce4ec",
                                        borderRadius: 2,
                                        boxShadow: 2,
                                        position: "relative"
                                      }}
                                    >
                                      <TextField
                                        fullWidth
                                        margin="dense"
                                        label="Sub Header"
                                        value={sub.name}
                                        onChange={(e) =>
                                          handleSubHeaderChange(index, subIndex, "name", e.target.value)
                                        }
                                      />
                                      <TextField
                                        fullWidth
                                        margin="dense"
                                        label="SD"
                                        value={sub.sd}
                                        onChange={(e) =>
                                          handleSubHeaderChange(index, subIndex, "sd", e.target.value)
                                        }
                                      />
                                      <FormControl fullWidth margin="dense">
                                        <InputLabel>Prompt</InputLabel>
                                        <Select
                                          value={sub.prompt}
                                          onChange={(e) =>
                                            handleSubHeaderChange(index, subIndex, "prompt", e.target.value)
                                          }
                                        >
                                          {targetpromptOptions.map((prompt) => (
                                            <MenuItem key={prompt} value={prompt}>{prompt}</MenuItem>
                                          ))}
                                        </Select>
                                      </FormControl>


                                    </Paper>
                                  ))}
                                </Card>
                              ))}
                          {headers.length === 0 ? (
                            <Typography variant="body1" align="center" color="text.secondary">

                            </Typography>
                          ) : <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={() => handleUpdateTarget("Target", empid, selectedStudent.rollNumber, headers)}
                          >
                            ✅ Save Target Data
                          </Button>}
                        </>
                      )}

                      {selectedCategory === "Maintainance" && (
                        <>
                          <Typography variant="h6" textAlign="center" color="secondary" fontWeight="bold" gutterBottom>
                            Maintenance
                          </Typography>

                          {headers.length === 0 ? (
                            <Typography variant="body1" align="center" color="text.secondary">
                              🚫 No data found
                            </Typography>
                          ) : (
                            headers.map((item, index) => (
                              <Card key={index} sx={{ marginBottom: 2, padding: 2, boxShadow: 3, borderRadius: 2 }}>
                                <FormControl fullWidth margin="dense" disabled>
                                  <InputLabel>Header</InputLabel>
                                  <Select value={item.header} label="Header">
                                    <MenuItem value={item.header}>{item.header}</MenuItem>
                                  </Select>
                                </FormControl>

                                {item.header && item.subHeaders.map((sub, subIndex) => (
                                  <Paper
                                    key={subIndex}
                                    sx={{
                                      padding: 2,
                                      marginTop: 2,
                                      backgroundColor: "#fce4ec",
                                      borderRadius: 2,
                                      boxShadow: 2,
                                    }}
                                  >
                                    <TextField
                                      fullWidth
                                      margin="dense"
                                      label="Sub Header"
                                      value={sub.name}
                                      InputProps={{ readOnly: true }}
                                    />
                                    <TextField
                                      fullWidth
                                      margin="dense"
                                      label="SD"
                                      value={sub.sd}
                                      InputProps={{ readOnly: true }}
                                    />
                                    <FormControl fullWidth margin="dense" disabled>
                                      <InputLabel>Prompt</InputLabel>
                                      <Select value={sub.prompt} label="Prompt">
                                        <MenuItem value={sub.prompt}>{sub.prompt}</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Paper>
                                ))}
                              </Card>
                            ))
                          )}
                        </>
                      )}


                    </Box>
                  </Box>
                </motion.div>
              </DialogContent>
            </Dialog>
          </DialogContent>
        </Dialog>

        <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} type={popupType} />
      </Box>
    </>

  );
};


export default StudentNotebook;