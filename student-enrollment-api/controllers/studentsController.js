const db = require('../db'); 
const getAllStudents = (req, res) => {
    const query = "SELECT student_name, student_dob, fathers_name, mothers_name, contact_no, email_id, alternative_contact_no, alternative_email_id, fees, date_of_admission, no_of_days, student_type, createdAt, updatedAt, enrollment_id FROM students  ";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        res.json(results);
    });
};
module.exports = {getAllStudents};