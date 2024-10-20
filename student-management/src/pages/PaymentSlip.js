
// import React, { useState } from "react";
// import { Box, Grid, TextField, Typography, Paper, Button } from "@mui/material";
// import { styled } from "@mui/system";
// import BackgroundImage from '../assets/backg.jpg'; // Adjust the path as necessary
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import NavbarScreen from "./Navbar";

// const PaymentSlip = () => {
//   const [formData, setFormData] = useState({
//     date: '',
//     studentName: '',
//     parentName: '',
//     tuitionFees: '',
//     latePayment: '',
//     amountPaid: '',
//     paymentMethod: '',
//     paymentDetails: '',
//     paymentDate: '',
//     paymentMonth: '',
//     paymentYear: '',
//   });

//   const [searchValue, setSearchValue] = useState('');  const handleSearch = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/payment-slip', {
//         params: { student_name: searchValue }
//       });

//       const { student, fees } = response.data;

//       setFormData({
//         studentName: student.student_name,
//         parentName: student.fathers_name,
//         tuitionFees: fees.fees,
//         latePayment: fees.late_fine || '',
//         amountPaid: fees.amt_paid,
//         paymentMethod: fees.payment_type,
//         paymentDetails: fees.payment_details,
//         paymentDate: new Date().toISOString().split('T')[0], // current date
//         paymentMonth: new Date().getMonth() + 1, // current month
//         paymentYear: new Date().getFullYear(), // current year
//       });

//     } catch (error) {
//       console.error('Error fetching data', error);
//     }
//   };


// const generatePDF = () => {
//     const doc = new jsPDF("portrait", "pt", "a4");

//     // Add fonts and general styling
//     doc.setFont("times", "bold");
//     doc.setFontSize(18);
//     doc.text("STEPS TOGETHER – Intervention Centre", 40, 50);

//     doc.setFont("times", "italic");
//     doc.setFontSize(12);
//     doc.text('"Where Every Ability Shines"', 40, 70);

//     // Line separator after header
//     doc.setLineWidth(1);
//     doc.line(40, 80, 555, 80);

//     // Acknowledgement Section
//     doc.setFont("times", "bold");
//     doc.setFontSize(14);
//     doc.text("Acknowledgement of Payment", 40, 110);

//     // Date Section
//     doc.setFontSize(12);
//     doc.setFont("times", "normal");
//     doc.text(`Date: ${formData.date}`, 400, 110); // Align date on the right-hand side

//     // Body text
//     doc.setFontSize(12);
//     doc.text("This is to acknowledge receipt of payment for fees from:", 40, 140);

//     // Student and Parent Info
//     doc.setFont("times", "bold");
//     doc.text(`Student Name:`, 40, 170);
//     doc.setFont("times", "normal");
//     doc.text(formData.studentName, 150, 170);

//     doc.setFont("times", "bold");
//     doc.text("Parent's Name:", 40, 200);
//     doc.setFont("times", "normal");
//     doc.text(formData.parentName, 150, 200);

//     // Fees and Payment Info
//     doc.setFont("times", "bold");
//     doc.text("Tuition Fees:", 40, 230);
//     doc.setFont("times", "normal");
//     doc.text(`Rs. ${parseFloat(formData.tuitionFees).toFixed(2)}`, 150, 230);

//     doc.setFont("times", "bold");
//     doc.text("Late Payment:", 40, 260);
//     doc.setFont("times", "normal");
//     doc.text(formData.latePayment ? `Rs. ${parseFloat(formData.latePayment).toFixed(2)}` : "Nil", 150, 260);

//     doc.setFont("times", "bold");
//     doc.text("Amount Paid:", 40, 290);
//     doc.setFont("times", "normal");
//     doc.text(`Rs. ${parseFloat(formData.amountPaid).toFixed(2)}`, 150, 290);

//     // Line separator before payment method
//      // doc.setLineWidth(0.5);
//      //   doc.line(40, 320, 555, 320);

//     // Payment Method
//     doc.setFont("times", "bold");
//     doc.text("Payment Method:", 40, 320);
//     if (formData.paymentMethod.toLowerCase() === "online") {
//         doc.rect(160, 310, 12, 12, "F"); // Fill box for Online
//     } else {
//         doc.rect(160, 310, 12, 12); // Empty box for Online
//     }
//     doc.text("Online", 180, 320);

//     if (formData.paymentMethod.toLowerCase() === "cheque") {
//         doc.rect(250, 310, 12, 12, "F"); // Fill box for Cheque
//     } else {
//         doc.rect(250, 310, 12, 12); // Empty box for Cheque
//     }
//     doc.text("Cheque", 270, 320);

//     // Payment Details
//     doc.setFont("times", "bold");
//     doc.text("Payment Details (Transaction ID):", 40, 350);
//     doc.setFont("times", "normal");
//     doc.text(formData.paymentDetails, 240, 350);

//     // Payment Date and Month
//     doc.setFont("times", "bold");
//     doc.text("Date of Payment:", 40, 380);
//     doc.setFont("times", "normal");
//     doc.text(formData.paymentDate, 150, 380);

//     doc.setFont("times", "bold");
//     doc.text("Month:", 40, 410);
//     doc.setFont("times", "normal");
//     doc.text(formData.paymentMonth, 150, 410);

//     doc.setFont("times", "bold");
//     doc.text("Year:", 40, 440);
//     doc.setFont("times", "normal");
//     doc.text(formData.paymentYear, 150, 440);

//     // Line separator before signature
//     doc.setLineWidth(0.5);
//     doc.line(40, 470, 555, 470);

//     // Footer with Signature and Name
//     doc.setFont("times", "bold");
//     doc.text("For STEPS TOGETHER", 400, 500);

//     doc.setFontSize(12);
//     doc.setFont("times", "normal");
//     doc.text("Suranjita Bose", 400, 530);
//     doc.text("Special Educator & Founder", 400, 560);
//     doc.text("CRR No: A82386", 400, 590);
//     doc.save(`Payment_Slip_${formData.studentName}.pdf`);
// };


// return (
//   <>
//     <input 
//       type="text" 
//       placeholder="Search by Student Name" 
//       value={searchValue} 
//       onChange={(e) => setSearchValue(e.target.value)}
//     />
//     <button onClick={handleSearch}>Search</button>

   
//   </>
// );
// };

// const StyledBackground = styled(Box)`
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background-image: url(${BackgroundImage});
//   background-size: cover;
//   background-position: center;
//   z-index: -1;
//   filter: blur(8px); /* Blur only the background image */
// `;

// const StyledContainer = styled(Box)`
//   max-width: 800px;
//   margin: 80px auto;
//   padding: 20px;
//   background-color: rgba(255, 255, 255, 0.9); /* semi-transparent white */
//   border-radius: 8px;
//   box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
//   z-index: 1;
//   position: relative; /* Keep form content above the background */
// `;

// const StyledTextField = styled(TextField)`
//   & .MuiOutlinedInput-root {
//     border-radius: 8px;
//   }
// `;

// const StyledButton = styled(Button)`
//   background-color: #1976d2;
//   color: white;
//   border-radius: 8px;
//   &:hover {
//     background-color: #0d47a1;
//   }
// `;

// export default PaymentSlip;


import React, { useState } from "react";
import { Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import { styled } from "@mui/system";
import jsPDF from "jspdf";
import axios from 'axios'; // Ensure axios is imported
import NavbarScreen from './Navbar';
import BackgroundImage from '../assets/backg.jpg';

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

  const generatePDF = (student) => {
    const { fees } = student;
    const doc = new jsPDF("portrait", "pt", "a4");

    // PDF generation logic using student and fees info
    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.text("STEPS TOGETHER – Intervention Centre", 40, 50);

    doc.setFont("times", "italic");
    doc.setFontSize(12);
    doc.text('"Where Every Ability Shines"', 40, 70);

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
//     // Payment Method
//     doc.setFont("times", "bold");
//     doc.text("Payment Method:", 40, 320);
//     if (formData.paymentMethod.toLowerCase() === "online") {
//         doc.rect(160, 310, 12, 12, "F"); // Fill box for Online
//     } else {
//         doc.rect(160, 310, 12, 12); // Empty box for Online
//     }
//     doc.text("Online", 180, 320);

//     if (formData.paymentMethod.toLowerCase() === "cheque") {
//         doc.rect(250, 310, 12, 12, "F"); // Fill box for Cheque
//     } else {
//         doc.rect(250, 310, 12, 12); // Empty box for Cheque
//     }
//     doc.text("Cheque", 270, 320);

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
    doc.line(40, 470, 555, 470);

    doc.setFont("times", "bold");
    doc.text("For STEPS TOGETHER", 400, 500);
    doc.text("Suranjita Bose", 400, 530);
    doc.text("Special Educator & Founder", 400, 560);
    doc.text("CRR No: A82386", 400, 590);

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


