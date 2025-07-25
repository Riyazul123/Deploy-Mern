const db = require('../db');

const moment = require('moment');

// const gettargetStudentBYID = async (req, res) => {
//  // const { studentID } = req.query;
//   const { studentID, empid } = req.query;

//   db.query(
//     //'SELECT * FROM t_ngo_target WHERE StudentID = ?', [studentID],
//     'SELECT * FROM t_ngo_target WHERE StudentID = ? AND EmpID = ?', [studentID, empid],
//     (err, result) => {

//       if (err) return res.status(500).send(err);
//       res.json(result);
//     });
// };

// // ✅ Bulk Insert Target Data
// const targetStudent = async (req, res) => {
//   const { EmpID, StudentID, headers } = req.body;

//   // Check if headers exist
//   if (!headers || headers.length === 0) {
//     return res.status(400).json({ error: 'Headers are required' });
//   }

//   const sql = `INSERT INTO t_ngo_target (EmpID, StudentID, HeaderName, SubHeaderName, SD, Prompt) VALUES ?`;

//   const values = [];

//   headers.forEach(header => {
//     header.subHeaders.forEach(sub => {
//       values.push([EmpID, StudentID, header.headerName, sub.name, sub.sd, sub.prompt]);
//     });
//   });

//   db.query(sql, [values], (err, result) => {
//     if (err) return res.status(500).send(err);
//     res.json({ status: 'success', inserted: result.affectedRows });
//   });
// };



// // ✅ Fetch Baseline Data
// const getbaselineStudentByID = async (req, res) => {
//   const { studentID } = req.query;
//   db.query('SELECT * FROM t_ngo_baseline WHERE StudentID = ?', [studentID], (err, result) => {
//     if (err) return res.status(500).send(err);
//     res.json(result);
//   });
// };


// const createBaseline = async (req, res) => {
//   const { EmpID, StudentID, headers } = req.body;

//   if (!headers || headers.length === 0) {
//     return res.status(400).json({ error: 'Headers are required' });
//   }

//   const baselineValues = [];
//   const targetValues = [];
//   const maintenanceValues = [];

//   headers.forEach(header => {
//     header.subHeaders.forEach(sub => {
//       const row = [EmpID, StudentID, header.headerName, sub.name, sub.sd, sub.prompt];

//       // Add to Baseline table (always)
//       baselineValues.push(row);

//       // Conditionally add to Target or Maintenance table
//       if (sub.prompt === "No") {
//         targetValues.push(row);
//       } else {
//         maintenanceValues.push(row);
//       }
//     });
//   });

//   // Insert into baseline
//   const baselineSQL = `INSERT INTO t_ngo_baseline (EmpID, StudentID, HeaderName, SubHeaderName, SD, Prompt) VALUES ?`;
//   db.query(baselineSQL, [baselineValues], (err, result) => {
//     if (err) return res.status(500).json({ error: 'Baseline Insert Failed', details: err });

//     // Insert into target
//     if (targetValues.length > 0) {
//       const targetSQL = `INSERT INTO t_ngo_target (EmpID, StudentID, HeaderName, SubHeaderName, SD, Prompt) VALUES ?`;
//       db.query(targetSQL, [targetValues], (targetErr) => {
//         if (targetErr) console.error("Target Insert Failed", targetErr);
//       });
//     }

//     // Insert into maintenance
//     if (maintenanceValues.length > 0) {
//       const maintenanceSQL = `INSERT INTO t_ngo_maintainance (EmpID, StudentID, HeaderName, SubHeaderName, SD, Prompt) VALUES ?`;
//       db.query(maintenanceSQL, [maintenanceValues], (maintErr) => {
//         if (maintErr) console.error("Maintenance Insert Failed", maintErr);
//       });
//     }

//     res.json({
//       status: "success",
//       insertedToBaseline: result.affectedRows,
//       insertedToTarget: targetValues.length,
//       insertedToMaintenance: maintenanceValues.length
//     });
//   });
// };




// //get Maintainance data

// const getMaintenanceData = (req, res) => {
//   const { studentId,empid } = req.query;

//   const sql = `SELECT * FROM t_ngo_maintainance WHERE StudentID = ? AND EmpID = ? ORDER BY DateTime DESC`;

//   db.query(sql, [studentId,empid], (err, result) => {
//     if (err) return res.status(500).json({ error: 'Failed to fetch maintenance data', details: err });
//     res.json(result);
//     // res.json({ status: "success", data: result });
//   });
// };



// const getupdateTargetData = (req, res) => {
//   const updatedTargets = req.body.targets;
//   const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

//   updatedTargets.forEach(target => {
//     const { id, studentID, EmpID, HeaderName, SubHeaderName, SD, Prompt } = target;

//     const selectQuery = `SELECT * FROM t_ngo_target WHERE id = ?`;

//     db.query(selectQuery, [id], (err, rows) => {
//       if (err) return console.error("Select error:", err);
//       if (rows.length === 0) return;

//       const existing = rows[0];
//       const existingDate = new Date(existing.DateTime).toISOString().slice(0, 10);
//       let newCount = existing.count || 0;

//       const hasChanged =
//         existing.HeaderName !== HeaderName ||
//         existing.SubHeaderName !== SubHeaderName ||
//         existing.SD !== SD ||
//         existing.Prompt !== Prompt;

//       // 🔄 Only update count if prompt is "Independent Response" AND date changed
//       if (existingDate !== today && Prompt === "Independent Response") {
//         newCount++;
//       }

//       // 🛑 Only update DB if there are actual changes OR date & prompt trigger count logic
//       if (hasChanged || (existingDate !== today && Prompt === "Independent Response")) {
//         if (newCount > 3) {
//           // 👉 Move to Maintenance
//           const insertMaintenance = `
//             INSERT INTO t_ngo_maintainance (EmpID, StudentID, HeaderName, SubHeaderName, SD, Prompt, DateTime)
//             VALUES (?, ?, ?, ?, ?, ?, NOW())
//           `;
//           db.query(insertMaintenance, [EmpID, studentID, HeaderName, SubHeaderName, SD, Prompt], (err) => {
//             if (err) return console.error("Insert to maintenance failed:", err);
//           });

//           const deleteTarget = `DELETE FROM T_NGO_TARGET WHERE id = ?`;
//           db.query(deleteTarget, [id], (err) => {
//             if (err) return console.error("Delete from target failed:", err);
//           });

//         } else {
//           const updateQuery = `
//             UPDATE t_ngo_target 
//             SET HeaderName=?, SubHeaderName=?, SD=?, Prompt=?, DateTime=NOW(), count=?
//             WHERE id = ?
//           `;
//           db.query(updateQuery, [HeaderName, SubHeaderName, SD, Prompt, newCount, id], (err) => {
//             if (err) return console.error("Update target failed:", err);
//           });
//         }
//       }
//     });
//   });

//   res.json({ success: true, message: "Target data processed successfully" });
// };


/* ------------------------------------------------------------- */
/* 1. Get Target rows by Student + Emp                            */
/* ------------------------------------------------------------- */
const gettargetStudentBYID = async (req, res) => {
  try {
    const { studentID, empid } = req.query;
    const sql =
      `SELECT * FROM t_ngo_target
        WHERE StudentID = ? AND EmpID = ?`;

    const [rows] = await db.execute(sql, [studentID, empid]);
    return res.json(rows);
  } catch (err) {
    console.error("gettargetStudentBYID error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ------------------------------------------------------------- */
/* 2. Bulk‑insert Target rows                                     */
/* ------------------------------------------------------------- */
const targetStudent = async (req, res) => {
  try {
    const { EmpID, StudentID, headers } = req.body;
    if (!headers?.length) {
      return res.status(400).json({ error: "Headers are required" });
    }

    const values = [];
    headers.forEach(h =>
      h.subHeaders.forEach(s =>
        values.push([EmpID, StudentID, h.headerName, s.name, s.sd, s.prompt])
      )
    );

    const sql =
      `INSERT INTO t_ngo_target
       (EmpID, StudentID, HeaderName, SubHeaderName, SD, Prompt)
       VALUES ?`;

    const [result] = await db.query(sql, [values]);
    return res.json({ status: "success", inserted: result.affectedRows });
  } catch (err) {
    console.error("targetStudent error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ------------------------------------------------------------- */
/* 3. Get Baseline rows                                           */
/* ------------------------------------------------------------- */
const getbaselineStudentByID = async (req, res) => {
  try {
    const { studentID } = req.query;
    const [rows] = await db.execute(
      "SELECT * FROM t_ngo_baseline WHERE StudentID = ?",
      [studentID]
    );
    return res.json(rows);
  } catch (err) {
    console.error("getbaselineStudentByID error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ------------------------------------------------------------- */
/* 4. Create Baseline (+target/+maintenance) in one go           */
/* ------------------------------------------------------------- */
const createBaseline = async (req, res) => {
  try {
    const { EmpID, StudentID, headers } = req.body;
    if (!headers?.length) {
      return res.status(400).json({ error: "Headers are required" });
    }

    const baseline = [];
    const target   = [];
    const maint    = [];

    headers.forEach(h =>
      h.subHeaders.forEach(s => {
        const row = [EmpID, StudentID, h.headerName, s.name, s.sd, s.prompt];
        baseline.push(row);
        if (s.prompt === "No") target.push(row);
        else maint.push(row);
      })
    );

    /* insert baseline */
    await db.query(
      `INSERT INTO t_ngo_baseline
       (EmpID, StudentID, HeaderName, SubHeaderName, SD, Prompt)
       VALUES ?`,
      [baseline]
    );

    /* insert target if needed */
    if (target.length) {
      await db.query(
        `INSERT INTO t_ngo_target
         (EmpID, StudentID, HeaderName, SubHeaderName, SD, Prompt)
         VALUES ?`,
        [target]
      );
    }

    /* insert maintenance if needed */
    if (maint.length) {
      await db.query(
        `INSERT INTO t_ngo_maintainance
         (EmpID, StudentID, HeaderName, SubHeaderName, SD, Prompt)
         VALUES ?`,
        [maint]
      );
    }

    return res.json({
      status: "success",
      insertedToBaseline: baseline.length,
      insertedToTarget: target.length,
      insertedToMaintenance: maint.length
    });
  } catch (err) {
    console.error("createBaseline error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ------------------------------------------------------------- */
/* 5. Get Maintenance rows                                        */
/* ------------------------------------------------------------- */
const getMaintenanceData = async (req, res) => {
  try {
    const { studentId, empid } = req.query;
    const sql =
      `SELECT *
         FROM t_ngo_maintainance
        WHERE StudentID = ? AND EmpID = ?
        ORDER BY DateTime DESC`;

    const [rows] = await db.execute(sql, [studentId, empid]);
    return res.json(rows);
  } catch (err) {
    console.error("getMaintenanceData error:", err);
    return res
      .status(500)
      .json({ error: "Failed to fetch maintenance data", details: err.message });
  }
};

/* ------------------------------------------------------------- */
/* 6. Update/Promote Target rows                                  */
/* ------------------------------------------------------------- */
const getupdateTargetData = async (req, res) => {
  try {
    const updatedTargets = req.body.targets;
    const today = moment().format("YYYY-MM-DD");

    for (const t of updatedTargets) {
      const { id, studentID, EmpID, HeaderName, SubHeaderName, SD, Prompt } = t;

      /* fetch existing row */
      const [[existing]] = await db.execute(
        "SELECT * FROM t_ngo_target WHERE id = ?",
        [id]
      );
      if (!existing) continue;

      const existingDate = moment(existing.DateTime).format("YYYY-MM-DD");
      let newCount = existing.count || 0;

      const changed =
        existing.HeaderName !== HeaderName ||
        existing.SubHeaderName !== SubHeaderName ||
        existing.SD !== SD ||
        existing.Prompt !== Prompt;

      /* increment count only once per day & only for Independent Response */
      if (existingDate !== today && Prompt === "Independent Response") {
        newCount++;
      }

      if (!changed && newCount === existing.count) continue; // nothing to do

      if (newCount > 3) {
        /* move to maintenance */
        await db.execute(
          `INSERT INTO t_ngo_maintainance
             (EmpID, StudentID, HeaderName, SubHeaderName, SD, Prompt, DateTime)
           VALUES (?, ?, ?, ?, ?, ?, NOW())`,
          [EmpID, studentID, HeaderName, SubHeaderName, SD, Prompt]
        );
        await db.execute("DELETE FROM t_ngo_target WHERE id = ?", [id]);
      } else {
        /* normal update */
        await db.execute(
          `UPDATE t_ngo_target
              SET HeaderName = ?,
                  SubHeaderName = ?,
                  SD = ?,
                  Prompt = ?,
                  DateTime = NOW(),
                  count = ?
            WHERE id = ?`,
          [HeaderName, SubHeaderName, SD, Prompt, newCount, id]
        );
      }
    }

    return res.json({ success: true, message: "Target data processed successfully" });
  } catch (err) {
    console.error("getupdateTargetData error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// const getConsecutiveIndependentResponses = async (req, res) => {
//   try {
//     const { studentId } = req.query;

//     if (!studentId) {
//       return res.status(400).json({ error: "Student ID is required" });
//     }

//     // Query to get records from both tables with "Independent Response"
//     const sql = `
//             SELECT StudentID, HeaderName, SubHeaderName, Prompt, DATE(DateTime) as DateOnly
//             FROM t_ngo_baseline 
//             WHERE StudentID = ? AND Prompt = 'Independent Response'
//             UNION ALL
//             SELECT StudentID, HeaderName, SubHeaderName, Prompt, DATE(DateTime) as DateOnly
//             FROM t_ngo_target 
//             WHERE StudentID = ? AND Prompt = 'Independent Response'
//             ORDER BY StudentID, HeaderName, SubHeaderName, DateOnly
//         `;

//     db.query(sql, [studentId, studentId], (err, results) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ error: "Database error" });
//       }

//       // Group by (HeaderName + SubHeaderName + Prompt)
//       const groupedData = {};
//       results.forEach((row) => {
//         const key = `${row.HeaderName}-${row.SubHeaderName}-${row.Prompt}`;
//         if (!groupedData[key]) {
//           groupedData[key] = [];
//         }
//         groupedData[key].push(row.DateOnly); // Store only the date (YYYY-MM-DD)
//       });

//       console.log("Grouped Data--->", groupedData); // Debugging

//       // Function to check for 3 consecutive dates
//       const isThreeConsecutiveDays = (dates) => {
//         if (dates.length < 3) return false;

//         // Convert dates to YYYY-MM-DD format and sort them
//         const sortedDates = [...new Set(dates)] // Remove duplicates
//           .map(date => new Date(date)) // Convert to Date objects
//           .sort((a, b) => a - b); // Sort in ascending order

//         for (let i = 0; i <= sortedDates.length - 3; i++) {
//           const day1 = sortedDates[i];
//           const day2 = sortedDates[i + 1];
//           const day3 = sortedDates[i + 2];

//           // Check if they are consecutive (difference = 1 day)
//           if (
//             (day2 - day1 === 86400000) && // Day 2 is exactly 1 day after Day 1
//             (day3 - day2 === 86400000)    // Day 3 is exactly 1 day after Day 2
//           ) {
//             return true;
//           }
//         }
//         return false;
//       };

//       // Filter tasks that appear for 3 consecutive days
//       const filteredTasks = Object.keys(groupedData)
//         .filter((key) => isThreeConsecutiveDays(groupedData[key]))
//         .map((key) => {
//           const [HeaderName, SubHeaderName, Prompt] = key.split("-");
//           return { StudentID: studentId, HeaderName, SubHeaderName, Prompt };
//         });

//       res.json(filteredTasks);
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

const getConsecutiveIndependentResponses = async (req, res) => {
  try {
    const { studentId } = req.query;
    if (!studentId) {
      return res.status(400).json({ error: "Student ID is required" });
    }

    /* 1️⃣  fetch baseline + target rows with Prompt = 'Independent Response' */
    const sql = `
      SELECT StudentID, HeaderName, SubHeaderName, Prompt, DATE(DateTime) AS DateOnly
        FROM t_ngo_baseline
       WHERE StudentID = ? AND Prompt = 'Independent Response'
      UNION ALL
      SELECT StudentID, HeaderName, SubHeaderName, Prompt, DATE(DateTime) AS DateOnly
        FROM t_ngo_target
       WHERE StudentID = ? AND Prompt = 'Independent Response'
      ORDER BY StudentID, HeaderName, SubHeaderName, DateOnly
    `;

    const [rows] = await db.execute(sql, [studentId, studentId]);

    /* 2️⃣  group by task (header+subheader+prompt) */
    const grouped = rows.reduce((acc, row) => {
      const key = `${row.HeaderName}-${row.SubHeaderName}-${row.Prompt}`;
      (acc[key] = acc[key] || []).push(row.DateOnly);
      return acc;
    }, {});

    /* helper: true if array contains ≥3 consecutive calendar days */
    const isThreeConsecutive = (dates) => {
      if (dates.length < 3) return false;

      const sorted = [...new Set(dates)]      // dedupe
        .map(d => new Date(d))                // → Date objects
        .sort((a, b) => a - b);               // asc

      for (let i = 0; i <= sorted.length - 3; i++) {
        const [d1, d2, d3] = [sorted[i], sorted[i + 1], sorted[i + 2]];
        if (d2 - d1 === 86400000 && d3 - d2 === 86400000) return true; // 1 day = 86 400 000 ms
      }
      return false;
    };

    /* 3️⃣  filter tasks that meet the 3‑day rule */
    const consecutiveTasks = Object.entries(grouped)
      .filter(([, dates]) => isThreeConsecutive(dates))
      .map(([key]) => {
        const [HeaderName, SubHeaderName, Prompt] = key.split("-");
        return { StudentID: studentId, HeaderName, SubHeaderName, Prompt };
      });

    return res.json(consecutiveTasks);
  } catch (err) {
    console.error("getConsecutiveIndependentResponses error:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
};


module.exports = { gettargetStudentBYID, targetStudent, getbaselineStudentByID, createBaseline, getupdateTargetData, getConsecutiveIndependentResponses, getMaintenanceData };

