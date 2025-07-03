const db = require('../db');


// const registerEmployee = async (req, res) => {
//     const { password, userType, empName } = req.body;

//     if (!password || !userType || !empName) {
//         return res.status(400).json({ message: "All fields are required" });
//     }

//     try {
//         const query = "INSERT INTO t_ngo_user_master (Password, UserType, EmpName) VALUES (?, ?, ?)";

//         db.query(query, [ password, userType, empName], (err, result) => {
//             if (err) return res.status(500).json({ message: "Database error", error: err });
            
//             const insertedEmpID = result.insertId;
//             res.status(201).json({ message: "Employee registered successfully", empID: insertedEmpID });

//           //  res.status(201).json({ message: "Employee registered successfully", empID });
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error });
//     }
// };

// // Get Employee by ID
// const getEmployeeById = (req, res) => {
//     const { empId } = req.query;

//     const query = "SELECT EmpID, UserType, EmpName, CreationDate, LastLogin FROM t_ngo_user_master WHERE EmpID = ?";
//     db.query(query, [empId], (err, results) => {
//         if (err) return res.status(500).json({ message: "Database error", error: err });
//         if (results.length === 0) return res.status(404).json({ message: "Employee not found" });

//         res.json(results[0]);
//     });
// };

// // Get All Employees
// const getAllEmployees = (req, res) => {
//     const query = "SELECT empID, userType, empName, creationDate, lastLogin FROM t_ngo_user_master WHERE userType = 'Employee' ";
//     db.query(query, (err, results) => {
//         if (err) return res.status(500).json({ message: "Database error", error: err });
//         res.json(results);
//     });
// };
/* -------------------------------------------------- */
/* 1. Register new employee                           */
/* -------------------------------------------------- */
const registerEmployee = async (req, res) => {
  try {
    const { password, userType, empName } = req.body;
    if (!password || !userType || !empName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const sql =
      `INSERT INTO t_ngo_user_master (Password, UserType, EmpName)
       VALUES (?, ?, ?)`;

    const [result] = await db.execute(sql, [password, userType, empName]);

    return res.status(201).json({
      message: "Employee registered successfully",
      empID: result.insertId
    });
  } catch (err) {
    console.error("registerEmployee error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* -------------------------------------------------- */
/* 2. Get employee by ID                              */
/* -------------------------------------------------- */
const getEmployeeById = async (req, res) => {
  try {
    const { empId } = req.query;
    if (!empId) {
      return res.status(400).json({ message: "empId is required" });
    }

    const sql =
      `SELECT EmpID, UserType, EmpName, CreationDate, LastLogin
         FROM t_ngo_user_master
        WHERE EmpID = ?`;

    const [rows] = await db.execute(sql, [empId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error("getEmployeeById error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* -------------------------------------------------- */
/* 3. Get all employees                               */
/* -------------------------------------------------- */
const getAllEmployees = async (req, res) => {
  try {
    const sql =
      `SELECT EmpID, UserType, EmpName, CreationDate, LastLogin
         FROM t_ngo_user_master
        WHERE UserType = 'Employee'`;

    const [rows] = await db.execute(sql);
    return res.json(rows);
  } catch (err) {
    console.error("getAllEmployees error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { registerEmployee, getEmployeeById, getAllEmployees };