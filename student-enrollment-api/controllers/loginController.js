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


const authController = async(req, res) => {
    const { userID, password ,userType} = req.body;

    if (!userID || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const query = "SELECT * FROM t_ngo_user_master WHERE EmpID = ? AND Password = ? AND UserType = ?";
    db.query(query, [userID, password, userType], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid Employee ID or Password" });
        }

        const employee = results[0];

        console.log("employee",employee);
        // const isMatch = await bcrypt.compare(password, employee.password);

        // if (!isMatch) {
        //     return res.status(401).json({ message: "Invalid Password" });
        // }

       // const token = jwt.sign({ empID: employee.empID, userType: employee.userType }, "secretKey", { expiresIn: "1h" });

        // Update last login time
        const updateQuery = "UPDATE t_ngo_user_master SET LastLogin = NOW() WHERE EmpID = ?";
        db.query(updateQuery, [userID]);

        res.json({ message: "Login successful", EmpId: userID , userType: employee.userType, EmpName: employee.EmpName});
    });
};


module.exports = { authController};
