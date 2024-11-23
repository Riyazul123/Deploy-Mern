import React, { useState } from "react";
import { Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import { styled } from "@mui/system";
import jsPDF from "jspdf";
import axios from 'axios'; // Ensure axios is imported
import NavbarScreen from './Navbar';
import BackgroundImage from '../assets/backg.jpg';
import logoSrc from '../assets/stdt-logo.jpeg';
const PaymentSlip = () => {
  const [formData, setFormData] = useState({
    date: '',
    studentName: '',
    parentName: '',
    tuitionFees: '',
    latePayment: '',
    amountPaid: '',
    paymentMethod: '',
    paymentDetails: '',
    paymentDate: '',
    paymentMonth: '',
    paymentYear: '',
  });

  const [searchValue, setSearchValue] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const baseUrl = process.env.REACT_APP_SERVER_URL;

  const handleSearch = async () => {
    setLoading(true); // Start the loader
    setError(''); // Reset any previous error

    try {
      const response = await axios.get(baseUrl+'/api/payment-slip', {
        // const response = await axios.get(baseUrl+'/api/payment-slip', {
        params: { student_name: searchValue }
      });

      const studentData = response.data.student;
      const feesData = response.data.fees;

      if (studentData && feesData) {
        // Combine student and fees information into a single object for easy rendering
        setStudents([{ ...studentData, fees: feesData }]);
      } else {
        setError('No students found with the given name');
        setStudents([]);
      }
    } catch (error) {
      setError('Error fetching data. Please try again.');
      console.error('Error fetching data', error);
    } finally {
      setLoading(false); // Stop the loader
    }
  };

  const generatePDF = async (student) => {
    const { fees } = student;
    const doc = new jsPDF("portrait", "pt", "a4");

    doc.addImage(logoSrc, "JPEG", 40, 20, 150, 60);
  
    // PDF generation logic using student and fees info
    // doc.setFont("times", "bold");
    // doc.setFontSize(18);
    // doc.text("STEPS TOGETHER – Intervention Centre", 40, 50);

    // doc.setFont("times", "italic");
    // doc.setFontSize(12);
    // doc.text('"Where Every Ability Shines"', 40, 70);

    doc.setLineWidth(1);
    doc.line(40, 80, 555, 80);

    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.text("Acknowledgement of Payment", 40, 110);

    doc.setFontSize(12);
    doc.setFont("times", "normal");
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 400, 110);

    doc.setFontSize(12);
    doc.text("This is to acknowledge receipt of payment for fees from:", 40, 140);

    doc.setFont("times", "bold");
    doc.text(`Student Name:`, 40, 170);
    doc.setFont("times", "normal");
    doc.text(student.student_name, 150, 170);

    doc.setFont("times", "bold");
    doc.text("Parent's Name:", 40, 200);
    doc.setFont("times", "normal");
    doc.text(student.fathers_name, 150, 200);

    doc.setFont("times", "bold");
    doc.text("Tuition Fees:", 40, 230);
    doc.setFont("times", "normal");
    doc.text(`Rs. ${parseFloat(fees.fees).toFixed(2)}`, 150, 230);

    doc.setFont("times", "bold");
    doc.text("Late Payment:", 40, 260);
    doc.setFont("times", "normal");
    doc.text(fees.late_fine ? `Rs. ${parseFloat(fees.late_fine).toFixed(2)}` : "Nil", 150, 260);

    doc.setFont("times", "bold");
    doc.text("Amount Paid:", 40, 290);
    doc.setFont("times", "normal");
    doc.text(`Rs. ${parseFloat(fees.amt_paid).toFixed(2)}`, 150, 290);

    doc.setFont("times", "bold");

    doc.text("Payment Method:", 40, 320);
    if (fees.payment_type.toLowerCase() === "online") {
      doc.rect(160, 310, 12, 12, "F");
    } else {
      doc.rect(160, 310, 12, 12);
    }
    doc.text("Online", 180, 320);

    if (fees.payment_type.toLowerCase() === "cheque") {
      doc.rect(250, 310, 12, 12, "F");
    } else {
      doc.rect(250, 310, 12, 12);
    }
    doc.text("Cheque", 270, 320);

    if (fees.payment_type.toLowerCase() === "cash") {
      doc.rect(340, 310, 12, 12, "F");
    } else {
      doc.rect(340, 310, 12, 12);
    }
    doc.text("Cash", 360, 320);

    doc.setFont("times", "bold");
    doc.text("Payment Details (Transaction ID):", 40, 350);
    doc.setFont("times", "normal");
    doc.text(fees.payment_details, 240, 350);

    doc.setFont("times", "bold");
    doc.text("Date of Payment:", 40, 380);
    doc.setFont("times", "normal");
    doc.text(new Date().toLocaleDateString(), 150, 380);

    doc.setLineWidth(0.5);
    doc.line(40, 500, 555, 500);

    doc.setFont("times", "bold");
    doc.text("For STEPS TOGETHER", 400, 420);
    doc.text("Suranjita Bose", 400, 435);
    doc.text("Special Educator & Founder", 400, 450);
    doc.text("CRR No: A82386", 400, 465);

      // Disclaimer
  doc.setFont("times", "italic");
  doc.setFontSize(10);
  doc.text(
    "Disclaimer: This payment receipt is generated electronically and is valid without a signature.",
    40,
    510
  );

    doc.save(`Payment_Slip_${student.student_name}.pdf`);
  };


  return (
    <>
      <NavbarScreen />
      <StyledBackground />
      <StyledContainer>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#333' }}>
          Search for Student
        </Typography>
        <Box mb={2}>
          <StyledTextField
            label="Search by Student Name or ID"
            fullWidth
            margin="normal"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}

          />
          <StyledButton variant="contained" onClick={handleSearch} sx={{ mt: 2 }}>
            Search
          </StyledButton>
        </Box>

        {loading && <Typography variant="body1">Loading...</Typography>}
        {error && <Typography variant="body1" color="error">{error}</Typography>}

        {students.length > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Father's Name</TableCell>
                  <TableCell>Tuition Fees</TableCell>
                  <TableCell>Amount Paid</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell>{student.student_name}</TableCell>
                    <TableCell>{student.fathers_name}</TableCell>
                    <TableCell>{student.fees.fees}</TableCell>
                    <TableCell>{student.fees.amt_paid}</TableCell>
                    <TableCell>
                      <StyledButton
                        variant="contained"
                        onClick={() => generatePDF(student)}
                      >
                        Download Slip
                      </StyledButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
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
    max-width: 800px;
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
  background-color: #1976d2;
  color: white;
  border-radius: 8px;
  &:hover {
    background-color: #0d47a1;
  }
`;
export default PaymentSlip;


