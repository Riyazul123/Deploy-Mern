import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, Box, MenuItem, Select, TextField, Button, Typography, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";

const headers = ["Personal", "Social", "Academic", "Recreational", "Computer", "Self Help", "Vocational"];
const promptOptions = ["Full Physical", "Light Touch", "Gesture", "Model", "Shadow", "Independent Response", "Vocal Prompt", "Partial Vocal"];

const StudentNotebookDialog = ({ selectedStudent, setSelectedStudent }) => {
  const [selectedHeader, setSelectedHeader] = useState("");
  const [subHeaders, setSubHeaders] = useState([]);
  const [subHeaderText, setSubHeaderText] = useState("");
  const [sdText, setSdText] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState("");

  const handleAddSubHeader = () => {
    if (subHeaderText.trim()) {
      setSubHeaders([...subHeaders, { text: subHeaderText, sd: "", prompt: "" }]);
      setSubHeaderText("");
    }
  };

  const handleUpdateSubHeader = (index, field, value) => {
    const updatedSubHeaders = [...subHeaders];
    updatedSubHeaders[index][field] = value;
    setSubHeaders(updatedSubHeaders);
  };

  return (
    <Dialog
      open={Boolean(selectedStudent)}
      onClose={() => setSelectedStudent(null)}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {selectedStudent?.name}'s Notebook
        <IconButton onClick={() => setSelectedStudent(null)}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Select value={selectedHeader} onChange={(e) => setSelectedHeader(e.target.value)} fullWidth displayEmpty>
            <MenuItem value="" disabled>Select a Header</MenuItem>
            {headers.map((header) => (
              <MenuItem key={header} value={header}>{header}</MenuItem>
            ))}
          </Select>

          {selectedHeader && (
            <Box>
              <Typography variant="h6" gutterBottom>Subheader Section</Typography>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <TextField
                  label="Enter Subheader"
                  value={subHeaderText}
                  onChange={(e) => setSubHeaderText(e.target.value)}
                  fullWidth
                />
                <Button variant="contained" onClick={handleAddSubHeader}>Add</Button>
              </Box>

              {subHeaders.map((subHeader, index) => (
                <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Box sx={{ display: "flex", gap: 2, mt: 2, alignItems: "center", p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
                    <Typography>{subHeader.text}</Typography>
                    <TextField
                      label="SD Input"
                      value={subHeader.sd}
                      onChange={(e) => handleUpdateSubHeader(index, "sd", e.target.value)}
                      fullWidth
                    />
                    <Select
                      value={subHeader.prompt}
                      onChange={(e) => handleUpdateSubHeader(index, "prompt", e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>Select Prompt</MenuItem>
                      {promptOptions.map((option) => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </Box>
                </motion.div>
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default StudentNotebookDialog;
