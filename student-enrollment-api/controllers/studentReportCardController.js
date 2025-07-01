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

const getStudentReport = (req, res) => {
  const { studentID, fromDate, toDate } = req.query;

  if (!studentID || !fromDate || !toDate) {
    return res.status(400).json({ message: "studentID, fromDate, and toDate are required" });
  }

  const formattedStart = moment(fromDate).format('YYYY-MM-DD HH:mm:ss');
  const formattedEnd = moment(toDate).format('YYYY-MM-DD HH:mm:ss');

  // const queries = {
  //   baseline: `SELECT * FROM t_ngo_baseline WHERE StudentID = ? AND DateTime BETWEEN ? AND ?`,
  //   target: `SELECT * FROM t_ngo_target WHERE StudentID = ? AND DateTime BETWEEN ? AND ?`,
  //   maintenance: `SELECT * FROM t_ngo_maintainance WHERE StudentID = ? AND DateTime BETWEEN ? AND ?`,
  //   communication: `SELECT * FROM t_ngo_communication WHERE StudentID = ? AND DateTime BETWEEN ? AND ?`,
  //   behavior: `SELECT * FROM t_ngo_behaviour WHERE StudentID = ? AND DateTime BETWEEN ? AND ?`,
  //   notes: `SELECT * FROM t_ngo_notes WHERE StudentID = ? AND DateTime BETWEEN ? AND ?`
  // };
  const queries = {
  baseline:      'SELECT * FROM t_ngo_baseline      WHERE StudentID = ? AND `DateTime` BETWEEN ? AND ?',
  target:        'SELECT * FROM t_ngo_target        WHERE StudentID = ? AND `DateTime` BETWEEN ? AND ?',
  maintenance:   'SELECT * FROM t_ngo_maintainance   WHERE StudentID = ? AND `DateTime` BETWEEN ? AND ?',
  communication: 'SELECT * FROM t_ngo_communication WHERE StudentID = ? AND `DateTime` BETWEEN ? AND ?',
  behavior:      'SELECT * FROM t_ngo_behaviour     WHERE StudentID = ? AND `DateTime` BETWEEN ? AND ?',
  notes:         'SELECT * FROM t_ngo_notes         WHERE StudentID = ? AND `DateTime` BETWEEN ? AND ?'
};


  const data = {};
  let completed = 0;
  const total = Object.keys(queries).length;

  for (let key in queries) {
    db.query(queries[key], [studentID, formattedStart, formattedEnd], (err, result) => {
      if (err) {
    console.error(`Error fetching ${key}:`, err); // 👈 full error object
    return res.status(500).json({ message: `Error fetching ${key}`, error: err.sqlMessage || err.message });
      }

      data[key] = result;
      completed++;

      if (completed === total) {
        res.status(200).json({
          studentID,
          period: { start: formattedStart, end: formattedEnd },
          ...data
        });
      }
    });
  }
};

module.exports = { getStudentReport };
