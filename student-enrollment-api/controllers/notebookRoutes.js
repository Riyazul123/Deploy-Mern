const db = require('../db'); 

// const gettargetStudentBYID = async (req, res) => {
//     const {studentID} = req.query;
//     db.query('SELECT * FROM T_NGO_TARGET WHERE StudentID = ?', [studentID], (err, result) => {
//         if (err) return res.status(500).send(err);
//         res.json(result);
//     });
// };

// // Insert a new Target
// const targetStudent=async(req, res) => {
//     const { EmpID, StudentID, HeaderName, SubHeaderName, SD, Prompt } = req.body;
//     const sql = `INSERT INTO T_NGO_TARGET (EmpID, StudentID, HeaderName, SubHeaderName, SD, Prompt) VALUES (?, ?, ?, ?, ?, ?)`;
//     db.query(sql, [EmpID, StudentID, HeaderName, SubHeaderName, SD, Prompt], (err, result) => {
//         if (err) return res.status(500).send(err);
//         res.json({ status: 'success' });
//     });
// };

const gettargetStudentBYID = async (req, res) => {
    const { studentID } = req.query;
    db.query('SELECT * FROM t_ngo_target WHERE StudentID = ?', [studentID], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
};

// ✅ Bulk Insert Target Data
const targetStudent = async (req, res) => {
    const { EmpID, StudentID, headers } = req.body;

    // Check if headers exist
    if (!headers || headers.length === 0) {
        return res.status(400).json({ error: 'Headers are required' });
    }

    const sql = `INSERT INTO t_ngo_target (EmpID, StudentID, HeaderName, SubHeaderName, SD, Prompt) VALUES ?`;

    const values = [];

    headers.forEach(header => {
        header.subHeaders.forEach(sub => {
            values.push([EmpID, StudentID, header.headerName, sub.name, sub.sd, sub.prompt]);
        });
    });

    db.query(sql, [values], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ status: 'success', inserted: result.affectedRows });
    });
};



// ✅ Fetch Baseline Data
const getbaselineStudentByID = async (req, res) => {
    const { studentID } = req.query;
    db.query('SELECT * FROM t_ngo_baseline WHERE StudentID = ?', [studentID], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
};

// ✅ Bulk Insert Baseline Data
// const createBaseline = async (req, res) => {
//     const { StudentID, headers } = req.body;

//     // Check if headers exist
//     if (!headers || headers.length === 0) {
//         return res.status(400).json({ error: 'Headers are required' });
//     }

//     const sql = `INSERT INTO T_NGO_BASELINE (StudentID, HeaderName, SubHeaderName, SD, Prompt) VALUES ?`;

//     const values = [];

//     headers.forEach(header => {
//         header.subHeaders.forEach(sub => {
//             values.push([StudentID, header.headerName, sub.name, sub.sd, sub.prompt]);
//         });
//     });

//     db.query(sql, [values], (err, result) => {
//         if (err) return res.status(500).send(err);
//         res.json({ status: 'success', inserted: result.affectedRows });
//     });
// };

const createBaseline = async (req, res) => {
    const { EmpID, StudentID, headers } = req.body;
  
    if (!headers || headers.length === 0) {
      return res.status(400).json({ error: 'Headers are required' });
    }
  
    const baselineValues = [];
    const targetValues = [];
    const maintenanceValues = [];
  
    headers.forEach(header => {
      header.subHeaders.forEach(sub => {
        const row = [EmpID, StudentID, header.headerName, sub.name, sub.sd, sub.prompt];
  
        // Add to Baseline table (always)
        baselineValues.push(row);
  
        // Conditionally add to Target or Maintenance table
        if (sub.prompt === "No") {
          targetValues.push(row);
        } else {
          maintenanceValues.push(row);
        }
      });
    });
  
    // Insert into baseline
    const baselineSQL = `INSERT INTO t_ngo_baseline (EmpID, StudentID, HeaderName, SubHeaderName, SD, Prompt) VALUES ?`;
    db.query(baselineSQL, [baselineValues], (err, result) => {
      if (err) return res.status(500).json({ error: 'Baseline Insert Failed', details: err });
  
      // Insert into target
      if (targetValues.length > 0) {
        const targetSQL = `INSERT INTO t_ngo_target (EmpID, StudentID, HeaderName, SubHeaderName, SD, Prompt) VALUES ?`;
        db.query(targetSQL, [targetValues], (targetErr) => {
          if (targetErr) console.error("Target Insert Failed", targetErr);
        });
      }
  
      // Insert into maintenance
      if (maintenanceValues.length > 0) {
        const maintenanceSQL = `INSERT INTO t_ngo_maintainance (EmpID, StudentID, HeaderName, SubHeaderName, SD, Prompt) VALUES ?`;
        db.query(maintenanceSQL, [maintenanceValues], (maintErr) => {
          if (maintErr) console.error("Maintenance Insert Failed", maintErr);
        });
      }
  
      res.json({
        status: "success",
        insertedToBaseline: result.affectedRows,
        insertedToTarget: targetValues.length,
        insertedToMaintenance: maintenanceValues.length
      });
    });
  };


  

  //get Maintainance data

  const getMaintenanceData = (req, res) => {
    const { studentId } = req.query;
  
    const sql = `SELECT * FROM t_ngo_maintainance WHERE StudentID = ? ORDER BY DateTime DESC`;
  
    db.query(sql, [studentId], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch maintenance data', details: err });
      res.json(result);
     // res.json({ status: "success", data: result });
    });
  };
  
  

  // PUT /api/targets/:studentId
//router.put('/api/targets/:studentId', (req, res)

// const getupdateTargetData = (req, res)=> {
//  // const { studentId } = req.params;
//   const updatedTargets = req.body.targets; // expecting array of updated targets

//   const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

//   updatedTargets.forEach(target => {
//     const { id, studentID, EmpID, HeaderName, SubHeaderName, SD, Prompt } = target;

//     // Step 1: Get existing record
//     const selectQuery = `SELECT * FROM T_NGO_TARGET WHERE id = ?`;

//     console.log("Query data",selectQuery);
//     db.query(selectQuery, [id], (err, rows) => {
//       if (err) return console.error("Select error:", err);

//       if (rows.length === 0) return;

//       const existing = rows[0];

//       console.log("existing",existing)
//       const existingDate = new Date(existing.DateTime).toISOString().slice(0, 10); // Get only the date part

//       // Step 2: Compare date and update accordingly
//       let newCount = existing.count || 0;

//       if (existingDate !== today && Prompt === "Independent Response") {
//         newCount++;
//       }

//       if (newCount > 3) {
//         // Move to Maintenance
//         const insertMaintenance = `
//           INSERT INTO T_NGO_MAINTENANCE (EmpID,StudentID, HeaderName, SubHeaderName, SD, Prompt, DateTime)
//           VALUES (?, ?, ?, ?, ?, ?, NOW())
//         `;
//         db.query(insertMaintenance, [EmpID,studentID, HeaderName, SubHeaderName, SD, Prompt], (err) => {
//           if (err) return console.error("Insert to maintenance failed:", err);
//         });

//         // Delete from Target
//         const deleteTarget = `DELETE FROM T_NGO_TARGET WHERE id = ?`;
//         db.query(deleteTarget, [id], (err) => {
//           if (err) return console.error("Delete from target failed:", err);
//         });

//       } else {
//         // Just update Target
//         const updateQuery = `
//           UPDATE T_NGO_TARGET 
//           SET HeaderName=?, SubHeaderName=?, SD=?, Prompt=?, DateTime=NOW(), count=?
//           WHERE id = ?
//         `;
//         db.query(updateQuery, [HeaderName, SubHeaderName, SD, Prompt, newCount, id], (err) => {
//           if (err) return console.error("Update target failed:", err);
//         });
//       }
//     });
//   });

//   res.json({ success: true, message: "Target data processed successfully" });
// };
const getupdateTargetData = (req, res) => {
  const updatedTargets = req.body.targets;
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  updatedTargets.forEach(target => {
    const { id, studentID, EmpID, HeaderName, SubHeaderName, SD, Prompt } = target;

    const selectQuery = `SELECT * FROM t_ngo_target WHERE id = ?`;

    db.query(selectQuery, [id], (err, rows) => {
      if (err) return console.error("Select error:", err);
      if (rows.length === 0) return;

      const existing = rows[0];
      const existingDate = new Date(existing.DateTime).toISOString().slice(0, 10);
      let newCount = existing.count || 0;

      const hasChanged =
        existing.HeaderName !== HeaderName ||
        existing.SubHeaderName !== SubHeaderName ||
        existing.SD !== SD ||
        existing.Prompt !== Prompt;

      // 🔄 Only update count if prompt is "Independent Response" AND date changed
      if (existingDate !== today && Prompt === "Independent Response") {
        newCount++;
      }

      // 🛑 Only update DB if there are actual changes OR date & prompt trigger count logic
      if (hasChanged || (existingDate !== today && Prompt === "Independent Response")) {
        if (newCount > 3) {
          // 👉 Move to Maintenance
          const insertMaintenance = `
            INSERT INTO t_ngo_maintainance (EmpID, StudentID, HeaderName, SubHeaderName, SD, Prompt, DateTime)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
          `;
          db.query(insertMaintenance, [EmpID, studentID, HeaderName, SubHeaderName, SD, Prompt], (err) => {
            if (err) return console.error("Insert to maintenance failed:", err);
          });

          const deleteTarget = `DELETE FROM T_NGO_TARGET WHERE id = ?`;
          db.query(deleteTarget, [id], (err) => {
            if (err) return console.error("Delete from target failed:", err);
          });

        } else {
          const updateQuery = `
            UPDATE t_ngo_target 
            SET HeaderName=?, SubHeaderName=?, SD=?, Prompt=?, DateTime=NOW(), count=?
            WHERE id = ?
          `;
          db.query(updateQuery, [HeaderName, SubHeaderName, SD, Prompt, newCount, id], (err) => {
            if (err) return console.error("Update target failed:", err);
          });
        }
      }
    });
  });

  res.json({ success: true, message: "Target data processed successfully" });
};




const getConsecutiveIndependentResponses = async (req, res) => {
    try {
        const { studentId } = req.query;

        if (!studentId) {
            return res.status(400).json({ error: "Student ID is required" });
        }

        // Query to get records from both tables with "Independent Response"
        const sql = `
            SELECT StudentID, HeaderName, SubHeaderName, Prompt, DATE(DateTime) as DateOnly
            FROM t_ngo_baseline 
            WHERE StudentID = ? AND Prompt = 'Independent Response'
            UNION ALL
            SELECT StudentID, HeaderName, SubHeaderName, Prompt, DATE(DateTime) as DateOnly
            FROM t_ngo_target 
            WHERE StudentID = ? AND Prompt = 'Independent Response'
            ORDER BY StudentID, HeaderName, SubHeaderName, DateOnly
        `;

        db.query(sql, [studentId, studentId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database error" });
            }

            // Group by (HeaderName + SubHeaderName + Prompt)
            const groupedData = {};
            results.forEach((row) => {
                const key = `${row.HeaderName}-${row.SubHeaderName}-${row.Prompt}`;
                if (!groupedData[key]) {
                    groupedData[key] = [];
                }
                groupedData[key].push(row.DateOnly); // Store only the date (YYYY-MM-DD)
            });

            console.log("Grouped Data--->", groupedData); // Debugging

            // Function to check for 3 consecutive dates
            const isThreeConsecutiveDays = (dates) => {
                if (dates.length < 3) return false;

                // Convert dates to YYYY-MM-DD format and sort them
                const sortedDates = [...new Set(dates)] // Remove duplicates
                    .map(date => new Date(date)) // Convert to Date objects
                    .sort((a, b) => a - b); // Sort in ascending order

                for (let i = 0; i <= sortedDates.length - 3; i++) {
                    const day1 = sortedDates[i];
                    const day2 = sortedDates[i + 1];
                    const day3 = sortedDates[i + 2];

                    // Check if they are consecutive (difference = 1 day)
                    if (
                        (day2 - day1 === 86400000) && // Day 2 is exactly 1 day after Day 1
                        (day3 - day2 === 86400000)    // Day 3 is exactly 1 day after Day 2
                    ) {
                        return true;
                    }
                }
                return false;
            };

            // Filter tasks that appear for 3 consecutive days
            const filteredTasks = Object.keys(groupedData)
                .filter((key) => isThreeConsecutiveDays(groupedData[key]))
                .map((key) => {
                    const [HeaderName, SubHeaderName, Prompt] = key.split("-");
                    return { StudentID: studentId, HeaderName, SubHeaderName, Prompt };
                });

            res.json(filteredTasks);
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};



module.exports = {gettargetStudentBYID, targetStudent, getbaselineStudentByID, createBaseline, getupdateTargetData,getConsecutiveIndependentResponses, getMaintenanceData};

