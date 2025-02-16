import React, { useState } from "react";
import { Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import { styled } from "@mui/system";
import jsPDF from "jspdf";
import axios from 'axios'; // Ensure axios is imported
import NavbarScreen from './Navbar';
import BackgroundImage from '../assets/backg.jpg';
import logoSrc from '../assets/stdt-logo.jpeg';
import sign from '../assets/Sign.png';
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

  // const handleSearch = async () => {
  //   setLoading(true); // Start the loader
  //   setError(''); // Reset any previous error

  //   try {
  //     const response = await axios.get(baseUrl+`/api/payment-slip?search=${searchValue}`);

  //     const studentData = response.data.student;
  //     const feesData = response.data.fees;

  //     if (studentData && feesData) {
  //       // Combine student and fees information into a single object for easy rendering
  //       setStudents([{ ...studentData, fees: feesData }]);
  //     } else {
  //       setError('No students found with the given name');
  //       setStudents([]);
  //     }
  //   } catch (error) {
  //     setError('Error fetching data. Please try again.');
  //     console.error('Error fetching data', error);
  //   } finally {
  //     setLoading(false); // Stop the loader
  //   }
  // };

  const handleSearch = async () => {
    setLoading(true); // Start the loader
    setError(''); // Reset any previous error

    try {
      const response = await axios.get(baseUrl + `/api/payment-slip?search=${searchValue}`);

      // Check if the response is an array
      if (Array.isArray(response.data) && response.data.length > 0) {
        // Map through the response to extract the student and fees data
        // const studentData = response.data.map(item => ({
        //   ...item.student, // Extract student data
        //   fees: item.fees   // Include fees data for each student
        // }));
        const studentData = response.data.flatMap(item =>
          item.fees.map(fee => ({
            ...item.student,  // Extract student details
            fees: fee,       // Map each fee record separately
          }))
        );


        // Set the student data with fees combined
        setStudents(studentData);
      } else {
        setError('No students found with the given name');
        setStudents([]); // Clear the students data if no result is found
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
    const paymentDate = new Date(student.fees.fees_for_month); // Use the actual payment date if available
    const paymentMonth = paymentDate.toLocaleString('default', { month: 'long' });
    const paymentYear = paymentDate.getFullYear();
    const pageWidth = doc.internal.pageSize.getWidth();

    const formattedDate = new Date().toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });


    doc.addImage(logoSrc, "JPEG", 440, 20, 120, 60);




    // Add title
    const title = "STEPS TOGETHER – Intervention Centre";
    const subtitle = "“Where Every Ability Shines”";
    const ackn = "Acknowledgement of Payment";
    doc.setFont("times", "bold");
    doc.setFontSize(14);

    // Calculate center position for title
    const titleX = (pageWidth - doc.getTextWidth(title)) / 2;
    doc.text(title, titleX, 40);

    doc.setFontSize(12);
    const subtitleX = (pageWidth - doc.getTextWidth(subtitle)) / 2;
    doc.text(subtitle, subtitleX, 60);



    doc.setLineWidth(1);
    doc.line(40, 80, 555, 80);



    doc.setFont("times", "bold");
    doc.setFontSize(14);
    const acknX = (pageWidth - doc.getTextWidth(ackn)) / 2;
    doc.text(ackn, acknX, 110);


    doc.setFontSize(12);
    doc.setFont("times", "normal");
    doc.text(`Date: ${formattedDate}`, 40, 125);


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
   // doc.text(`Rs. ${parseFloat(fees.amt_paid + fees.fees).toFixed(2)}`, 150, 230);
   doc.text(`Rs. ${parseFloat(fees.amt_paid).toFixed(2)}`, 150, 230);

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
    doc.text(`${new Date(student.fees.fees_for_month).toLocaleDateString()}`, 150, 380);



    doc.setFont("times", "bold");
    doc.text("Payment has been received for the following month:", 40, 410);
    doc.setFont("times", "bold");
    doc.text("Month:", 40, 430);
    doc.setFont("times", "normal");
    doc.text(`${paymentMonth}`, 150, 430);

    doc.setFont("times", "bold");
    doc.text("Year :", 40, 450);

    doc.setFont("times", "normal");
    doc.text(`${paymentYear}`, 150, 450);

    // Footer
    doc.setFont("times", "bold");
    doc.text("Thank you for your payment.", 40, 500);

    doc.setLineWidth(0.5);
    doc.line(40, 730, 555, 730);

    // doc.text("For STEPS TOGETHER", 40, 550);

    // doc.text("Suranjita Bose", 40, 565);
    // doc.text("Special Educator & Founder", 40, 580);
    // doc.text("CRR No: A82386", 40, 595);

    // // Disclaimer
    // doc.setFont("times", "normal");
    // doc.setFontSize(10);
    // doc.text(
    //     "BE – 47, 114 Shanti Pally, Kasba, Kolkata 700107 | Contact: +91-9836418180",
    //     40,
    //     650
    // );
    // Footer Section
    doc.setFont("times", "bold");
    doc.text("For STEPS TOGETHER", 40, 550);

    // Adding Signature
    doc.addImage(sign, "PNG", 40, 560, 100, 40); // Adjusts position and size for the signature image

    doc.setFont("times", "normal");
    doc.text("Suranjita Bose", 40, 615);
    doc.text("Special Educator & Founder", 40, 630);
    doc.text("CRR No: A82386", 40, 645);

    const disclaimerText = "BE – 47, 114 Shanti Pally, Kasba, Kolkata 700107     |    Contact: +91-9836418180";
    const textWidth = doc.getTextWidth(disclaimerText); // Get the width of the disclaimer text
    const xPosition = (pageWidth - textWidth) / 2;
    // Disclaimer
    // doc.setFontSize(10);
    // doc.setFont("times", "normal");
    // doc.text(
    //     "BE – 47, 114 Shanti Pally, Kasba, Kolkata 700107 | Contact: +91-9836418180",
    //     40,
    //     690
    // );

    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.text(disclaimerText, xPosition, 750); // Centered text

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
                  <TableCell>Enrollment ID</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Father's Name</TableCell>
                  <TableCell>Tuition Fees</TableCell>
                  <TableCell>Amount Paid</TableCell>
                  <TableCell>Fees Date</TableCell>
                  <TableCell>Fees Month</TableCell>
                 
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell>{student.enrollment_id}</TableCell>
                    <TableCell>{student.student_name}</TableCell>
                    <TableCell>{student.fathers_name}</TableCell>
                    <TableCell>{student.fees.fees}</TableCell>
                    <TableCell>{student.fees.amt_paid}</TableCell>
                    <TableCell>{new Date(student.fees.fees_for_month).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(student.fees.fees_for_month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</TableCell>

                  
                    

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
    max-width: 1000px;
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


