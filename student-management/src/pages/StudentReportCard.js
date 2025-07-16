// import React, { useEffect, useRef, useState } from 'react';
// import axios from 'axios';
// import NavbarScreen from './Navbar';
// import {
//   Box,
//   Typography,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   CircularProgress,
//   Paper,
//   Grid,
//   Divider,
//   TextField,
//   Button,
//   Avatar,
// } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import html2pdf from 'html2pdf.js';

// const Section = ({ title, data, renderItem }) => (
//   <Accordion sx={{ mb: 2, backgroundColor: '#f5f7fa' }} defaultExpanded>
//     <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//       <Typography variant="h6" fontWeight="bold">{title}</Typography>
//     </AccordionSummary>
//     <AccordionDetails>
//       {data?.length > 0 ? (
//         data.map((item, index) => (
//           <Paper key={index} sx={{ p: 3, mb: 2, backgroundColor: '#ffffff', boxShadow: 2, borderRadius: 2 }}>
//             {renderItem(item)}
//           </Paper>
//         ))
//       ) : (
//         <Typography variant="body2" color="text.secondary" textAlign="center">No data available</Typography>
//       )}
//     </AccordionDetails>
//   </Accordion>
// );

// const StudentReportCard = () => {
//   const [inputStudentID, setInputStudentID] = useState('');
//   const [inputFromDate, setInputFromDate] = useState('');
//   const [inputToDate, setInputToDate] = useState('');
//   const [reportData, setReportData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const baseUrl = process.env.REACT_APP_SERVER_URL;
//   const reportRef = useRef();  // <-- Create a ref for the report

//   const fetchReport = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${baseUrl}/api/getStudentReport`, {
//         params: {
//           studentID: inputStudentID,
//           fromDate: inputFromDate,
//           toDate: inputToDate,
//         },
//       });
//       setReportData(res.data);
//     } catch (err) {
//       console.error('Failed to fetch report:', err);
//       setReportData(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadPDF = () => {
//     const element = reportRef.current;
//     const opt = {
//       margin: 0.3,
//       filename: `Student_Report_${inputStudentID}.pdf`,
//       image: { type: 'jpeg', quality: 0.98 },
//       html2canvas: { scale: 2 }, 
//       jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
//     };
//     html2pdf().from(element).set(opt).save();
//   };

//   return (
//     <>
//       <NavbarScreen />
//       <Box p={{ xs: 2, md: 4 }} maxWidth="1200px" mx="auto">

//         {/* Search Form */}
//         <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2} mb={4} alignItems="center" paddingTop="85px">
//           <TextField
//             label="Student ID"
//             value={inputStudentID}
//             onChange={(e) => setInputStudentID(e.target.value)}
//             fullWidth
//           />
//           <TextField
//             label="From Date"
//             type="date"
//             value={inputFromDate}
//             onChange={(e) => setInputFromDate(e.target.value)}
//             InputLabelProps={{ shrink: true }}
//             fullWidth
//           />
//           <TextField
//             label="To Date"
//             type="date"
//             value={inputToDate}
//             onChange={(e) => setInputToDate(e.target.value)}
//             InputLabelProps={{ shrink: true }}
//             fullWidth
//           />
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={fetchReport}
//             sx={{ height: '56px' }}
//           >
//             Search
//           </Button>
//         </Box>

//         {/* Report Section */}
//         {loading ? (
//           <Box textAlign="center" mt={6}>
//             <CircularProgress size={60} />
//             <Typography variant="h6" mt={2}>Loading Report...</Typography>
//           </Box>
//         ) : reportData ? (
//           <>
//             {/* Download Button */}
//             <Box mb={2} textAlign="right">
//               <Button variant="outlined" color="secondary" onClick={downloadPDF}>
//                 Download PDF
//               </Button>
//             </Box>

//             <Box ref={reportRef} p={3} sx={{ backgroundColor: '#fff', borderRadius: 2, boxShadow: 3 }}>
//               {/* School Header */}
//               <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
//                 <Box display="flex" alignItems="center">
//                   <Avatar
//                     alt="School Logo"
//                     src="/school-logo.png"
//                     sx={{ width: 80, height: 80, mr: 2 }}
//                   />
//                   <Box>
//                     <Typography variant="h4" fontWeight="bold" color="primary">
//                       Bright Future Academy
//                     </Typography>
//                     <Typography variant="subtitle1" color="text.secondary">
//                       Student Progress Report
//                     </Typography>
//                   </Box>
//                 </Box>
//                 <Box textAlign="right">
//                   <Typography variant="subtitle2" color="text.secondary">Academic Year: 2024-25</Typography>
//                 </Box>
//               </Box>

//               <Divider sx={{ my: 2 }} />

//               {/* Student Info */}
//               <Box mb={4}>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="h6">
//                       Student Name: <strong>{reportData.studentName}</strong>
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="h6">
//                       Student ID: <strong>{inputStudentID}</strong>
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="h6">
//                       Report Period: <strong>{reportData.period.start}</strong> to <strong>{reportData.period.end}</strong>
//                     </Typography>
//                   </Grid>
//                 </Grid>
//               </Box>

//               <Divider sx={{ my: 3 }} />

//               {/* Sections */}
//               <Section
//                 title="Baseline"
//                 data={reportData.baseline}
//                 renderItem={(item) => (
//                   <>
//                     <Typography><strong>Header:</strong> {item.HeaderName}</Typography>
//                     <Typography><strong>SubHeader:</strong> {item.SubHeaderName}</Typography>
//                     <Typography><strong>SD:</strong> {item.SD}</Typography>
//                     <Typography><strong>Prompt:</strong> {item.Prompt}</Typography>
//                   </>
//                 )}
//               />
//               <Section
//                 title="Target"
//                 data={reportData.target}
//                 renderItem={(item) => (
//                   <>
//                     <Typography><strong>Header:</strong> {item.HeaderName}</Typography>
//                     <Typography><strong>SubHeader:</strong> {item.SubHeaderName}</Typography>
//                     <Typography><strong>SD:</strong> {item.SD}</Typography>
//                     <Typography><strong>Prompt:</strong> {item.Prompt}</Typography>
//                   </>
//                 )}
//               />
//               <Section
//                 title="Maintenance"
//                 data={reportData.maintenance}
//                 renderItem={(item) => (
//                   <>
//                     <Typography><strong>Header:</strong> {item.HeaderName}</Typography>
//                     <Typography><strong>SubHeader:</strong> {item.SubHeaderName}</Typography>
//                     <Typography><strong>SD:</strong> {item.SD}</Typography>
//                     <Typography><strong>Prompt:</strong> {item.Prompt}</Typography>
//                   </>
//                 )}
//               />
//               <Section
//                 title="Communication"
//                 data={reportData.communication}
//                 renderItem={(item) => (
//                   <Grid container spacing={1}>
//                     <Grid item xs={12} sm={6}><Typography><strong>Type:</strong> {item.CommunicationType}</Typography></Grid>
//                     <Grid item xs={6} sm={3}><Typography><strong>Prompted:</strong> {item.Prompted}</Typography></Grid>
//                     <Grid item xs={6} sm={3}><Typography><strong>Independent:</strong> {item.Independent}</Typography></Grid>
//                   </Grid>
//                 )}
//               />
//               <Section
//                 title="Behavior"
//                 data={reportData.behavior}
//                 renderItem={(item) => (
//                   <>
//                     <Typography><strong>Antecedent:</strong> {item.Anticident}</Typography>
//                     <Typography><strong>Behavior:</strong> {item.Behaviour}</Typography>
//                     <Typography><strong>Consequence:</strong> {item.Consequence}</Typography>
//                     <Typography><strong>Duration:</strong> {item.Duration}</Typography>
//                     <Typography><strong>Frequency:</strong> {item.FrequencyCount}</Typography>
//                   </>
//                 )}
//               />
//               <Section
//                 title="Notes"
//                 data={reportData.notes}
//                 renderItem={(item) => (
//                   <Typography><strong>Note:</strong> {item.Notes}</Typography>
//                 )}
//               />
//             </Box>
//           </>
//         ) : (
//           <Box textAlign="center" mt={6}>
//             <Typography variant="h6" color="error">No Report Data Available</Typography>
//           </Box>
//         )}
//       </Box>
//     </>
//   );
// };

// export default StudentReportCard;

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import NavbarScreen from './Navbar';
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Button,
  Avatar,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import html2pdf from 'html2pdf.js';
import logoSrc from '../assets/stdt-logo.jpeg';
import TeacherNavbar from './TeacherNavbar';
import TeacherNavbarScreen from './TeacherNavbar';

// const TableSection = ({ title, columns, data }) => (
//   <Box mb={4}>
//     <Typography variant="h6" fontWeight="bold" mb={2}>
//       {title}
//     </Typography>
//     {data?.length > 0 ? (
//       <TableContainer component={Paper} elevation={3}>
//         <Table size="small">
//           <TableHead sx={{ backgroundColor: '#f0f2f5' }}>
//             <TableRow>
//               {columns.map((col, idx) => (
//                 <TableCell key={idx} sx={{ fontWeight: 'bold' }}>{col.headerName}</TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {data.map((row, idx) => (
//               <TableRow key={idx}>
//                 {columns.map((col, i) => (
//                   <TableCell key={i}>{row[col.field]}</TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     ) : (
//       <Typography variant="body2" color="text.secondary" textAlign="center">
//         No data available
//       </Typography>
//     )}
//   </Box>
// );


const TableSection = ({ title, columns, data }) => (
  <Box mb={6}>
    <Typography variant="h6" fontWeight="bold" mb={2} color="primary">
      {title}
    </Typography>
    {data?.length > 0 ? (
      <TableContainer component={Paper} elevation={4} sx={{ borderRadius: 3 }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#1976d2' }}>
            <TableRow>
              {columns.map((col, idx) => (
                <TableCell
                  key={idx}
                  sx={{
                    fontWeight: 'bold',
                    color: '#ffffff',
                    textTransform: 'uppercase',
                    fontSize: '0.9rem',
                    letterSpacing: 1
                  }}
                >
                  {col.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow
                key={idx}
                sx={{
                  '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                  '&:hover': { backgroundColor: '#f1f1f1' },
                  transition: 'background-color 0.3s ease',
                }}
              >
                {columns.map((col, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      fontSize: '0.85rem',
                      color: '#424242',
                    }}
                  >
                    {row[col.field] ?? '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ) : (
      <Typography variant="body2" color="text.secondary" textAlign="center">
        No data available
      </Typography>
    )}
  </Box>
);

const StudentReportCard = () => {
  const [inputStudentID, setInputStudentID] = useState('');
  const empid = localStorage.getItem('empId')
  const [inputFromDate, setInputFromDate] = useState('');
  const [inputToDate, setInputToDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const baseUrl = process.env.REACT_APP_SERVER_URL;
  const reportRef = useRef();
  const [studentName, setStudentName] = useState(""); // "" → shows "Loading..."
  useEffect(() => {

    console.log("empid----> ",empid)

   
  }, []);


  const fetchReport = async () => {
    fetchStudentName()
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/getStudentReport`, {
        params: {
          studentID: inputStudentID,
          empid: empid,
          fromDate: inputFromDate,
          toDate: inputToDate,
          
        },
      });
      setReportData(res.data);

    } catch (err) {
      console.error('Failed to fetch report:', err);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };


  const downloadPDF = () => {
    const element = reportRef.current;
    const opt = {
      margin: 0.3,
      filename: `Student_Report_${inputStudentID}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  };

    const fetchStudentName = async () => {
      try {
        /* Axios builds →  /api/getStudentnameById?student_id=2025-1001 */
        const { data } = await axios.get(`${baseUrl}/api/getStudentnameById`, {
          params: { student_id: inputStudentID },
        });

        // API returns an array; pick the first row if present
        const name = data?.[0]?.student_name || "Unknown";
        setStudentName(name);
      } catch (err) {
        console.error("Error fetching student name:", err);
        setStudentName("Error");
      }
    };

   
  return (
    <>
      <TeacherNavbarScreen />
      <Box p={{ xs: 2, md: 4 }} maxWidth="1200px" mx="auto">

        {/* Search Form */}
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2} mb={4} alignItems="center" paddingTop="85px">
          <TextField
            label="Student ID"
            value={inputStudentID}
            onChange={(e) => setInputStudentID(e.target.value)}
            fullWidth
          />
          <TextField
            label="From Date"
            type="date"
            value={inputFromDate}
            onChange={(e) => setInputFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="To Date"
            type="date"
            value={inputToDate}
            onChange={(e) => setInputToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={fetchReport}
            sx={{ height: '56px' }}
          >
            Search
          </Button>
        </Box>

        {/* Report Section */}
        {loading ? (
          <Box textAlign="center" mt={6}>
            <CircularProgress size={60} />
            <Typography variant="h6" mt={2}>Loading Report...</Typography>
          </Box>
        ) : reportData ? (
          <>
            <Box mb={2} textAlign="right">
              <Button variant="outlined" color="secondary" onClick={downloadPDF}>
                Download PDF
              </Button>
            </Box>

            <Box ref={reportRef} p={3} sx={{ backgroundColor: '#fff', borderRadius: 2, boxShadow: 3 }}>

              {/* School Header */}
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
                {/* Left Side - Logo */}
                <Box display="flex" alignItems="center">
                  <Box
                    component="img"
                    src={logoSrc}
                    alt="School Logo"
                    sx={{
                      width: { xs: 100, md: 200 },
                      height: { xs: 60, md: 100 },
                      objectFit: 'contain',
                      mr: 2,
                    }}
                  />
                  {/* Title and Subtitle */}
                  <Box>
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      color="primary"
                      sx={{ lineHeight: 1.2 }}
                    >
                      STEPS TOGETHER – Intervention Centre
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      fontStyle="italic"
                      color="text.secondary"
                    >
                      "Where Every Ability Shines"
                    </Typography>
                  </Box>
                </Box>

                {/* Right Side - Academic Year */}
                <Box textAlign="right">
                  <Typography variant="subtitle2" color="text.secondary">
                    Academic Year: 2024-25
                  </Typography>
                </Box>
              </Box>


              <Divider sx={{ my: 2 }} />

              {/* Student Info */}

              <Box
                mb={4}
                p={3}
                sx={{
                  backgroundColor: '#f9f9f9',
                  borderRadius: 2,
                  boxShadow: 1,
                  border: '1px solid #e0e0e0',
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Student Name
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {studentName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Student ID
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {inputStudentID}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Report Period
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {new Date(reportData.period.start).toLocaleDateString()} - {new Date(reportData.period.end).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>


              <Divider sx={{ my: 3 }} />

              {/* Sections as Table */}
              <TableSection
                title="Baseline"
                columns={[
                  { headerName: 'Header', field: 'HeaderName' },
                  { headerName: 'SubHeader', field: 'SubHeaderName' },
                  { headerName: 'SD', field: 'SD' },
                  { headerName: 'Prompt', field: 'Prompt' },
                ]}
                data={reportData.baseline}
              />

              <TableSection
                title="Target"
                columns={[
                  { headerName: 'Header', field: 'HeaderName' },
                  { headerName: 'SubHeader', field: 'SubHeaderName' },
                  { headerName: 'SD', field: 'SD' },
                  { headerName: 'Prompt', field: 'Prompt' },
                ]}
                data={reportData.target}
              />

              <TableSection
                title="Maintenance"
                columns={[
                  { headerName: 'Header', field: 'HeaderName' },
                  { headerName: 'SubHeader', field: 'SubHeaderName' },
                  { headerName: 'SD', field: 'SD' },
                  { headerName: 'Prompt', field: 'Prompt' },
                ]}
                data={reportData.maintenance}
              />

              <TableSection
                title="Communication"
                columns={[
                  { headerName: 'Type', field: 'CommunicationType' },
                  { headerName: 'Prompted', field: 'Prompted' },
                  { headerName: 'Independent', field: 'Independent' },
                ]}
                data={reportData.communication}
              />

              <TableSection
                title="Behavior"
                columns={[
                  { headerName: 'Antecedent', field: 'Anticident' },
                  { headerName: 'Behavior', field: 'Behaviour' },
                  { headerName: 'Consequence', field: 'Consequence' },
                  { headerName: 'Duration', field: 'Duration' },
                  { headerName: 'Frequency', field: 'FrequencyCount' },
                ]}
                data={reportData.behavior}
              />

              <TableSection
                title="Notes"
                columns={[
                  { headerName: 'Note', field: 'Notes' },
                ]}
                data={reportData.notes}
              />
            </Box>
          </>
        ) : (
          <Box textAlign="center" mt={6}>
            <Typography variant="h6" color="error">No Report Data Available</Typography>
          </Box>
        )}
      </Box>
    </>
  );
};

export default StudentReportCard;
