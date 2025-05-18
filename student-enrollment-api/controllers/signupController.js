const db = require('../db'); 


const registerEmployee = async (req, res) => {
    const { empID, password, userType, empName } = req.body;

    if (!empID || !password || !userType || !empName) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const query = "INSERT INTO t_ngo_user_master (EmpID, Password, UserType, EmpName) VALUES (?, ?, ?, ?)";

        db.query(query, [empID, password, userType, empName], (err, result) => {
            if (err) return res.status(500).json({ message: "Database error", error: err });
            res.status(201).json({ message: "Employee registered successfully", empID });
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get Employee by ID
const getEmployeeById = (req, res) => {
    const { empId } = req.query;

    const query = "SELECT EmpID, UserType, EmpName, CreationDate, LastLogin FROM t_ngo_user_master WHERE EmpID = ?";
    db.query(query, [empId], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        if (results.length === 0) return res.status(404).json({ message: "Employee not found" });

        res.json(results[0]);
    });
};

// Get All Employees
 const getAllEmployees = (req, res) => {
    const query = "SELECT empID, userType, empName, creationDate, lastLogin FROM t_ngo_user_master WHERE userType = 'Employee' ";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        res.json(results);
    });
};

module.exports = { registerEmployee, getEmployeeById, getAllEmployees};