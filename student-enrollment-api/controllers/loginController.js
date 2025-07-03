const db = require('../db'); 
// const authController = async (req, res) =>{
//     const { userID, password, userType } = req.body;
//     const sql = `SELECT * FROM t_ngo_user_master WHERE EmpID = ? AND Password = ? AND UserType = ?`;
//     db.query(sql, [userID, password, userType], (err, result) => {
//         if (err) return res.status(500).send(err);
//         if (result.length > 0) {
//             res.json({ status: 'success', user: result[0] });
//         } else {
//             res.status(401).json({ status: 'fail', message: 'Invalid Credentials' });
//         }
//     });
// };


// const authController = async(req, res) => {
//     const { userID, password ,userType} = req.body;

//     if (!userID || !password) {
//         return res.status(400).json({ message: "All fields are required" });
//     }

//     const query = "SELECT * FROM t_ngo_user_master WHERE EmpID = ? AND Password = ? AND UserType = ?";
//     db.query(query, [userID, password, userType], (err, results) => {
//         if (err) return res.status(500).json({ message: "Database error", error: err });

//         if (results.length === 0) {
//             return res.status(401).json({ message: "Invalid Employee ID or Password" });
//         }

//         const employee = results[0];

//         console.log("employee",employee);
     
//         // Update last login time
//         const updateQuery = "UPDATE t_ngo_user_master SET LastLogin = NOW() WHERE EmpID = ?";
//         db.query(updateQuery, [userID]);

//         res.json({ message: "Login successful", EmpId: userID , userType: employee.userType, EmpName: employee.EmpName});
//     });
// };

const authController = async (req, res) => {
  try {
    const { userID, password, userType } = req.body;

    if (!userID || !password || !userType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    /* 1️⃣  verify credentials */
    const loginSql =
      `SELECT EmpID, EmpName, UserType
         FROM t_ngo_user_master
        WHERE EmpID = ? AND Password = ? AND UserType = ?`;

    const [rows] = await db.execute(loginSql, [userID, password, userType]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid Employee ID or Password" });
    }

    const employee = rows[0];

    /* 2️⃣  update last‑login (fire‑and‑forget is OK) */
    await db.execute(
      `UPDATE t_ngo_user_master SET LastLogin = NOW() WHERE EmpID = ?`,
      [userID]
    );

    /* 3️⃣  respond */
    return res.json({
      message: "Login successful",
      EmpId:   employee.EmpID,
      EmpName: employee.EmpName,
      userType: employee.UserType
    });
  } catch (err) {
    console.error("authController error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { authController};
