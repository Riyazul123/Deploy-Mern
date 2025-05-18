const db = require('../db'); 
// POST: Allocate a student to a teacher
// const allocateStudent = async (req, res) => {
//     try {
//         const { teacher_id, students } = req.body; // Expecting an array of students

//         if (!teacher_id || !Array.isArray(students) || students.length === 0) {
//             return res.status(400).json({ message: "Teacher ID and students array are required" });
//         }

//         const query = `
//             INSERT INTO T_NGO_TEACHER_STUDENT_ALLOCATION 
//             (student_id, teacher_id, student_name, allotment_datetime) 
//             VALUES ?
//         `;

//         // Preparing values for bulk insert
//         const values = students.map(student => [student.student_id, teacher_id, student.student_name, new Date()]);

//         db.query(query, [values], (err, result) => {
//             if (err) {
//                 console.error("Error allocating students:", err);
//                 return res.status(500).json({ message: "Database error", error: err });
//             }
//             res.status(201).json({ message: "Students allocated successfully", affectedRows: result.affectedRows });
//         });

//     } catch (error) {
//         res.status(500).json({ message: "Server error", error });
//     }
// };

// const allocateStudent = async (req, res) => {
//     try {
//       const { teacher_id, students } = req.body;
  
//       if (!teacher_id || !Array.isArray(students) || students.length === 0) {
//         return res.status(400).json({ message: "Teacher ID and students array are required" });
//       }
  
//       const query = `
//         INSERT IGNORE INTO T_NGO_TEACHER_STUDENT_ALLOCATION 
//         (student_id, teacher_id, student_name, allotment_datetime) 
//         VALUES ?
//       `;
  
//       const values = students.map(student => [
//         student.student_id,
//         teacher_id,
//         student.student_name,
//         new Date()
//       ]);
  
//       db.query(query, [values], (err, result) => {
//         if (err) {
//           console.error("Error allocating students:", err);
//           return res.status(500).json({ message: "Database error", error: err });
//         }
  
//         res.status(201).json({
//           message: "Students allocated successfully",
//           affectedRows: result.affectedRows
//         });
//       });
//     } catch (error) {
//       res.status(500).json({ message: "Server error", error });
//     }
//   };
  
const allocateStudent = async (req, res) => {
  try {
    const { teacher_id, students } = req.body;

    if (!teacher_id || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "Teacher ID and students array are required" });
    }

    // 1. Get existing allocations for this teacher
    const existingQuery = `
      SELECT student_id FROM T_NGO_TEACHER_STUDENT_ALLOCATION
      WHERE teacher_id = ?
    `;

    db.query(existingQuery, [teacher_id], (err, results) => {
      if (err) {
        console.error("Error fetching existing allocations:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      const alreadyAllocatedIds = new Set(results.map(row => row.student_id));

      // 2. Filter only new students not already allocated
      const newStudents = students.filter(s => !alreadyAllocatedIds.has(s.student_id));

      if (newStudents.length === 0) {
        return res.status(200).json({ message: "No new students to allocate." });
      }

      const insertQuery = `
        INSERT INTO T_NGO_TEACHER_STUDENT_ALLOCATION 
        (student_id, teacher_id, student_name, allotment_datetime)
        VALUES ?
      `;

      const values = newStudents.map(student => [
        student.student_id,
        teacher_id,
        student.student_name,
        new Date()
      ]);

      db.query(insertQuery, [values], (err, result) => {
        if (err) {
          console.error("Error allocating students:", err);
          return res.status(500).json({ message: "Database error", error: err });
        }

        res.status(201).json({
          message: "Students allocated successfully",
          newAllocations: newStudents.length,
          affectedRows: result.affectedRows
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


const getAllocationById = async (req, res) => {
    try {
        const { teacher_id } = req.query; // Expecting an array of students

        if (!teacher_id) {
            return res.status(400).json({ message: "Teacher ID  required" });
        }

        const query = `
            SELECT student_id , student_name from T_NGO_TEACHER_STUDENT_ALLOCATION 
            WHERE teacher_id = ?
        `;

      
        db.query(query, [teacher_id], (err, result) => {
         if (err) return res.status(500).json({ message: "Database error", error: err });
        res.json(result); 
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};



module.exports = { allocateStudent , getAllocationById};
