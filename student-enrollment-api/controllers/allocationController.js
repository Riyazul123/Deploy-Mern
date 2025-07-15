const db = require('../db'); 
const moment = require('moment');
// const allocateStudent = async (req, res) => {
//   try {
//     const { teacher_id, students } = req.body;

//     if (!teacher_id || !Array.isArray(students) || students.length === 0) {
//       return res.status(400).json({ message: "Teacher ID and students array are required" });
//     }

//     // 1. Get existing allocations for this teacher
//     const existingQuery = `
//       SELECT student_id FROM t_ngo_teacher_student_allocation
//       WHERE teacher_id = ?
//     `;

//     db.query(existingQuery, [teacher_id], (err, results) => {
//       if (err) {
//         console.error("Error fetching existing allocations:", err);
//         return res.status(500).json({ message: "Database error", error: err });
//       }

//       const alreadyAllocatedIds = new Set(results.map(row => row.student_id));

//       // 2. Filter only new students not already allocated
//       const newStudents = students.filter(s => !alreadyAllocatedIds.has(s.student_id));

//       if (newStudents.length === 0) {
//         return res.status(200).json({ message: "No new students to allocate." });
//       }

//       const insertQuery = `
//         INSERT INTO t_ngo_teacher_student_allocation 
//         (student_id, teacher_id, student_name, allotment_datetime)
//         VALUES ?
//       `;

//       const values = newStudents.map(student => [
//         student.student_id,
//         teacher_id,
//         student.student_name,
//         new Date()
//       ]);

//       db.query(insertQuery, [values], (err, result) => {
//         if (err) {
//           console.error("Error allocating students:", err);
//           return res.status(500).json({ message: "Database error", error: err });
//         }

//         res.status(201).json({
//           message: "Students allocated successfully",
//           newAllocations: newStudents.length,
//           affectedRows: result.affectedRows
//         });
//       });
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };


// const getAllocationById = async (req, res) => {
//     try {
//         const { teacher_id } = req.query; // Expecting an array of students

//         if (!teacher_id) {
//             return res.status(400).json({ message: "Teacher ID  required" });
//         }

//         const query = `
//             SELECT student_id , student_name from t_ngo_teacher_student_allocation 
//             WHERE teacher_id = ?
//         `;

      
//         db.query(query, [teacher_id], (err, result) => {
//          if (err) return res.status(500).json({ message: "Database error", error: err });
//         res.json(result); 
//         });

//     } catch (error) {
//         res.status(500).json({ message: "Server error", error });
//     }
// };



// const getStudentnameById = async (req, res) => {
//     try {
//         const { student_id } = req.query; // Expecting an array of students

//         if (!student_id) {
//             return res.status(400).json({ message: "Teacher ID  required" });
//         }

//         const query = `
//             SELECT student_id , student_name from t_ngo_teacher_student_allocation 
//             WHERE student_id = ?
//         `;

      
//         db.query(query, [student_id], (err, result) => {
//          if (err) return res.status(500).json({ message: "Database error", error: err });
//         res.json(result); 
//         });

//     } catch (error) {
//         res.status(500).json({ message: "Server error", error });
//     }
// };
/* -------------------------------------------------- */
/* 1. Allocate students                               */
/* -------------------------------------------------- */
const allocateStudent = async (req, res) => {
  try {
    const { teacher_id, students } = req.body;

    if (!teacher_id || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "Teacher ID and students array are required" });
    }

    /* 1️⃣  fetch existing allocations for this teacher */
    const existingSql =
      `SELECT student_id
         FROM t_ngo_teacher_student_allocation
        WHERE teacher_id = ?`;

    const [existingRows] = await db.execute(existingSql, [teacher_id]);
    const alreadyAllocated = new Set(existingRows.map(r => r.student_id));

    /* 2️⃣  filter new students */
    const newStudents = students.filter(s => !alreadyAllocated.has(s.student_id));
    if (newStudents.length === 0) {
      return res.status(200).json({ message: "No new students to allocate." });
    }

    /* 3️⃣  bulk insert */
    const insertSql =
      `INSERT INTO t_ngo_teacher_student_allocation
       (student_id, teacher_id, student_name, allotment_datetime)
       VALUES ?`;

    const values = newStudents.map(s => [
      s.student_id,
      teacher_id,
      s.student_name,
      moment().format("YYYY-MM-DD HH:mm:ss")
    ]);

    // mysql2 supports bulk INSERT with array‑of‑arrays
    const [insertResult] = await db.query(insertSql, [values]);

    return res.status(201).json({
      message: "Students allocated successfully",
      newAllocations: newStudents.length,
      affectedRows: insertResult.affectedRows
    });
  } catch (err) {
    console.error("allocateStudent error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* -------------------------------------------------- */
/* 2. Get all allocations for a teacher               */
/* -------------------------------------------------- */
const getAllocationById = async (req, res) => {
  try {
    const { teacher_id } = req.query;
    if (!teacher_id) {
      return res.status(400).json({ message: "Teacher ID required" });
    }

    const sql =
      `SELECT student_id, student_name
         FROM t_ngo_teacher_student_allocation
        WHERE teacher_id = ?`;

    const [rows] = await db.execute(sql, [teacher_id]);
    return res.json(rows);
  } catch (err) {
    console.error("getAllocationById error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* -------------------------------------------------- */
/* 3. Get a student name by ID                         */
/* -------------------------------------------------- */
const getStudentnameById = async (req, res) => {
  try {
    const { student_id } = req.query;
    if (!student_id) {
      return res.status(400).json({ message: "student_id required" });
    }

    const sql =
      `SELECT student_id, student_name
         FROM t_ngo_teacher_student_allocation
        WHERE student_id = ?`;

    const [rows] = await db.execute(sql, [student_id]);
    return res.json(rows);
  } catch (err) {
    console.error("getStudentnameById error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  allocateStudent,
  getAllocationById,
  getStudentnameById
};


module.exports = { allocateStudent , getAllocationById,getStudentnameById};
