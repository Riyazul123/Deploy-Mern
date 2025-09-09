// const db = require('../db'); 
// const moment = require('moment');
// const getStudentReport = async (req, res) => {
//     const { studentID } = req.query;
//     const { type = "weekly", date = new Date() } = req.query;
  
//     // Calculate date range
//     const startDate = {
//       daily: moment(date).startOf('day'),
//       weekly: moment(date).startOf('week'),
//       monthly: moment(date).startOf('month')
//     }[type];
  
//     const endDate = {
//       daily: moment(date).endOf('day'),
//       weekly: moment(date).endOf('week'),
//       monthly: moment(date).endOf('month')
//     }[type];
  
//     try {
//       const [baseline] = await db.query(
//         `SELECT * FROM t_ngo_baseline WHERE StudentID = ? AND DateTime BETWEEN ? AND ?`,
//         [studentID, startDate.format(), endDate.format()]
//       );
  
//       const [target] = await db.query(
//         `SELECT * FROM t_ngo_target WHERE StudentID = ? AND DateTime BETWEEN ? AND ?`,
//         [studentID, startDate.format(), endDate.format()]
//       );
  
//       const [maintenance] = await db.query(
//         `SELECT * FROM t_ngo_maintainance WHERE StudentID = ? AND DateTime BETWEEN ? AND ?`,
//         [studentID, startDate.format(), endDate.format()]
//       );
  
//       const [communication] = await db.query(
//         `SELECT * FROM t_ngo_communication WHERE StudentID = ? AND DateTime BETWEEN ? AND ?`,
//         [studentID, startDate.format(), endDate.format()]
//       );
  
//       const [behavior] = await db.query(
//         `SELECT * FROM t_ngo_behaviour WHERE StudentID = ? AND DateTime BETWEEN ? AND ?`,
//         [studentID, startDate.format(), endDate.format()]
//       );
  
//       const [notes] = await db.query(
//         `SELECT * FROM t_ngo_notes WHERE StudentID = ? AND DateTime BETWEEN ? AND ?`,
//         [studentID, startDate.format(), endDate.format()]
//       );
  
//       res.status(200).json({
//         studentID,
//         period: { start: startDate.format(), end: endDate.format() },
//         baseline,
//         target,
//         maintenance,
//         communication,
//         behavior,
//         notes,
//       });
//     } catch (err) {
//       console.error("Error fetching report:", err);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   };

//   module.exports = {getStudentReport};

// const db = require('../db');
// const moment = require('moment');

// const getStudentReport = (req, res) => {
//   const { studentID } = req.query;
//   const { type = "weekly", date = new Date() } = req.query;

//   const startDate = {
//     daily: moment(date).startOf('day'),
//     weekly: moment(date).startOf('week'),
//     monthly: moment(date).startOf('month')
//   }[type];

//   const endDate = {
//     daily: moment(date).endOf('day'),
//     weekly: moment(date).endOf('week'),
//     monthly: moment(date).endOf('month')
//   }[type];

//   const formattedStart = startDate.format('YYYY-MM-DD HH:mm:ss');
//   const formattedEnd = endDate.format('YYYY-MM-DD HH:mm:ss');

//   const queries = {
//     baseline: `SELECT * FROM t_ngo_baseline WHERE StudentID = ? AND DateTime BETWEEN ? AND ?`,
//     target: `SELECT * FROM t_ngo_target WHERE StudentID = ? AND DateTime BETWEEN ? AND ?`,
//     maintenance: `SELECT * FROM t_ngo_maintainance WHERE StudentID = ? AND DateTime BETWEEN ? AND ?`,
//     communication: `SELECT * FROM t_ngo_communication WHERE StudentID = ? AND DateTime BETWEEN ? AND ?`,
//     behavior: `SELECT * FROM t_ngo_behaviour WHERE StudentID = ? AND DateTime BETWEEN ? AND ?`,
//     notes: `SELECT * FROM t_ngo_notes WHERE StudentID = ? AND DateTime BETWEEN ? AND ?`
//   };

//   const data = {};
//   let completed = 0;
//   const total = Object.keys(queries).length;

//   for (let key in queries) {
//     db.query(queries[key], [studentID, formattedStart, formattedEnd], (err, result) => {
//       if (err) {
//         console.error(`Error fetching ${key}:`, err);
//         return res.status(500).json({ message: `Error fetching ${key}` });
//       }

//       data[key] = result;
//       completed++;

//       if (completed === total) {
//         res.status(200).json({
//           studentID,
//           period: { start: formattedStart, end: formattedEnd },
//           ...data
//         });
//       }
//     });
//   }
// };

// module.exports = { getStudentReport };
const db = require('../db');
const moment = require('moment');

// const getStudentReport = (req, res) => {
//   const { studentID, fromDate, toDate } = req.query;

//   if (!studentID || !fromDate || !toDate) {
//     return res.status(400).json({ message: "studentID, fromDate, and toDate are required" });
//   }

//   const formattedStart = moment(fromDate).format('YYYY-MM-DD HH:mm:ss');
//   const formattedEnd = moment(toDate).format('YYYY-MM-DD HH:mm:ss');

//   // const queries = {
//   //   baseline: `SELECT * FROM t_ngo_baseline WHERE StudentID = ? AND DateTime BETWEEN ? AND ?`,
//   //   target: `SELECT * FROM t_ngo_target WHERE StudentID = ? AND DateTime BETWEEN ? AND ?`,
//   //   maintenance: `SELECT * FROM t_ngo_maintainance WHERE StudentID = ? AND DateTime BETWEEN ? AND ?`,
//   //   communication: `SELECT * FROM t_ngo_communication WHERE StudentID = ? AND DateTime BETWEEN ? AND ?`,
//   //   behavior: `SELECT * FROM t_ngo_behaviour WHERE StudentID = ? AND DateTime BETWEEN ? AND ?`,
//   //   notes: `SELECT * FROM t_ngo_notes WHERE StudentID = ? AND DateTime BETWEEN ? AND ?`
//   // };
//   const queries = {
//   baseline:      'SELECT * FROM t_ngo_baseline      WHERE StudentID = ? AND `DateTime` BETWEEN ? AND ?',
//   target:        'SELECT * FROM t_ngo_target        WHERE StudentID = ? AND `DateTime` BETWEEN ? AND ?',
//   maintenance:   'SELECT * FROM t_ngo_maintainance   WHERE StudentID = ? AND `DateTime` BETWEEN ? AND ?',
//   communication: 'SELECT * FROM t_ngo_communication WHERE StudentID = ? AND `DateTime` BETWEEN ? AND ?',
//   behavior:      'SELECT * FROM t_ngo_behaviour     WHERE StudentID = ? AND `DateTime` BETWEEN ? AND ?',
//   notes:         'SELECT * FROM t_ngo_notes         WHERE StudentID = ? AND `DateTime` BETWEEN ? AND ?'
// };


//   const data = {};
//   let completed = 0;
//   const total = Object.keys(queries).length;

//   for (let key in queries) {
//     db.query(queries[key], [studentID, formattedStart, formattedEnd], (err, result) => {
//       if (err) {
//     console.error(`Error fetching ${key}:`, err); // 👈 full error object
//     return res.status(500).json({ message: `Error fetching ${key}`, error: err.sqlMessage || err.message });
//       }

//       data[key] = result;
//       completed++;

//       if (completed === total) {
//         res.status(200).json({
//           studentID,
//           period: { start: formattedStart, end: formattedEnd },
//           ...data
//         });
//       }
//     });
//   }
// };


// const getStudentReport = (req, res) => {
//   const { studentID, fromDate, toDate } = req.query;

//   if (!studentID || !fromDate || !toDate) {
//     return res.status(400).json({ message: "studentID, fromDate, and toDate are required" });
//   }

//   // Cover entire date range
//   const formattedStart = moment(fromDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
//   const formattedEnd = moment(toDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');

//   const queries = {
//     baseline:      'SELECT * FROM t_ngo_baseline      WHERE StudentID = ? AND `DateTime` BETWEEN ? AND ?',
//     target:        'SELECT * FROM t_ngo_target        WHERE StudentID = ? AND `DateTime` BETWEEN ? AND ?',
//     maintenance:   'SELECT * FROM t_ngo_maintainance  WHERE StudentID = ? AND `DateTime` BETWEEN ? AND ?',
//     communication: 'SELECT * FROM t_ngo_communication WHERE StudentID = ? AND `DateTime` BETWEEN ? AND ?',
//     behavior:      'SELECT * FROM t_ngo_behaviour     WHERE StudentID = ? AND `DateTime` BETWEEN ? AND ?',
//     notes:         'SELECT * FROM t_ngo_notes         WHERE StudentID = ? AND `DateTime` BETWEEN ? AND ?'
//   };

//   const data = {};
//   let completed = 0;
//   const total = Object.keys(queries).length;

//   for (let key in queries) {
//     db.query(queries[key], [studentID, formattedStart, formattedEnd], (err, result) => {
//       if (err) {
//         console.error(`Error fetching ${key}:`, err);
//         return res.status(500).json({ message: `Error fetching ${key}`, error: err.sqlMessage || err.message });
//       }

//       data[key] = result;
//       completed++;

//       if (completed === total) {
//         res.status(200).json({
//           studentID,
//           period: { start: formattedStart, end: formattedEnd },
//           ...data
//         });
//       }
//     });
//   }
// };

// const getStudentReport = async (req, res) => {
//   const { studentID, fromDate, toDate } = req.query;

//   if (!studentID || !fromDate || !toDate) {
//     return res.status(400).json({ message: "studentID, fromDate, and toDate are required" });
//   }

//   const formattedStart = moment(fromDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
//   const formattedEnd = moment(toDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');

//   const queries = {
//     baseline:      'SELECT * FROM t_ngo_baseline      WHERE StudentID = ? AND `DateTime` BETWEEN ? AND ?',
//     target:        'SELECT * FROM t_ngo_target        WHERE StudentID = ? AND `DateTime` BETWEEN ? AND ?',
//     maintenance:   'SELECT * FROM t_ngo_maintainance  WHERE StudentID = ? AND `DateTime` BETWEEN ? AND ?',
//     communication: 'SELECT * FROM t_ngo_communication WHERE StudentID = ? AND `DateTime` BETWEEN ? AND ?',
//     behavior:      'SELECT * FROM t_ngo_behaviour     WHERE StudentID = ? AND `DateTime` BETWEEN ? AND ?',
//     notes:         'SELECT * FROM t_ngo_notes         WHERE StudentID = ? AND `DateTime` BETWEEN ? AND ?'
//   };

//   const data = {};

//   try {
//     const connection = await db.getConnection(); // Get one connection from the pool

//     try {
//       for (let key in queries) {
//         const [rows] = await connection.execute(
//           queries[key],
//           [studentID, formattedStart, formattedEnd]
//         );
//         data[key] = rows;
//       }

//       res.status(200).json({
//         studentID,
//         period: { start: formattedStart, end: formattedEnd },
//         ...data
//       });

//     } finally {
//       connection.release(); // ✅ always release connection
//     }
//   } catch (err) {
//     console.error("Error fetching student report:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };
// const getStudentReport = async (req, res) => {
//   const { studentID, fromDate, toDate } = req.query;
//   if (!studentID || !fromDate || !toDate) {
//     return res.status(400).json({ message: "studentID, fromDate, and toDate are required" });
//   }

//   const start = moment(fromDate).startOf("day").format("YYYY-MM-DD HH:mm:ss");
//   const end   = moment(toDate)  .endOf("day")  .format("YYYY-MM-DD HH:mm:ss");

//   const queries = {
//     baseline:      "SELECT * FROM t_ngo_baseline      WHERE StudentID=? AND DateTime BETWEEN ? AND ?",
//     target:        "SELECT * FROM t_ngo_target        WHERE StudentID=? AND DateTime BETWEEN ? AND ?",
//     maintenance:   "SELECT * FROM t_ngo_maintainance  WHERE StudentID=? AND DateTime BETWEEN ? AND ?",
//     communication: "SELECT * FROM t_ngo_communication WHERE StudentID=? AND DateTime BETWEEN ? AND ?",
//     behavior:      "SELECT * FROM t_ngo_behaviour     WHERE StudentID=? AND DateTime BETWEEN ? AND ?",
//     notes:         "SELECT * FROM t_ngo_notes         WHERE StudentID=? AND DateTime BETWEEN ? AND ?"
//   };

//   try {
//     const data = {};
//     for (const key of Object.keys(queries)) {
//       const [rows] = await db.execute(queries[key], [studentID, start, end]);
//       data[key] = rows;
//     }

//     return res.status(200).json({
//       studentID,
//       period: { start, end },
//       ...data
//     });
//   } catch (err) {
//     console.error("Error fetching student report:", err);
//     return res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// module.exports = { getStudentReport };


const getStudentReport = async (req, res) => {
  const { studentID, empid, fromDate, toDate } = req.query;
  if (!studentID || !fromDate || !toDate) {
    return res.status(400).json({
      message: "studentID, fromDate, and toDate are required"
    });
  }

  const start = moment(fromDate).startOf("day").format("YYYY-MM-DD HH:mm:ss");
  const end   = moment(toDate)  .endOf("day")  .format("YYYY-MM-DD HH:mm:ss");

  const queries = {
    baseline:      "SELECT * FROM t_ngo_baseline      WHERE StudentID=? AND EmpID=? AND DateTime BETWEEN ? AND ?",
    target:        "SELECT * FROM t_ngo_target        WHERE StudentID=? AND EmpID=? AND DateTime BETWEEN ? AND ?",
    maintenance:   "SELECT * FROM t_ngo_maintainance  WHERE StudentID=? AND EmpID=? AND DateTime BETWEEN ? AND ?",
    communication: "SELECT * FROM t_ngo_communication WHERE StudentID=? AND EmpID=? AND DateTime BETWEEN ? AND ?",
    // behavior:      "SELECT * FROM t_ngo_behaviour     WHERE StudentID=? AND EmpID=? AND DateTime BETWEEN ? AND ?",
    behavior: "SELECT * FROM t_ngo_behaviour WHERE StudentID = ? AND EmpID = ? AND (DATE(DateTime) BETWEEN DATE(?) AND DATE(?) OR DateTime BETWEEN CONCAT(DATE(?), ' 00:00:00') AND CONCAT(DATE(?), ' 23:59:59'))",
    notes:         "SELECT * FROM t_ngo_notes         WHERE StudentID=? AND EmpID=? AND DateTime BETWEEN ? AND ?"
  };

  try {
    const data = {};
    for (const key of Object.keys(queries)) {
      // pool.execute returns [rows, fields]
      const [rows] = await db.execute(queries[key], [studentID, empid, start, end]);
      data[key] = rows;
    }

    return res.status(200).json({
      studentID,
      period: { start, end },
      ...data
    });
  } catch (err) {
    console.error("Error fetching student report:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

module.exports = { getStudentReport };
