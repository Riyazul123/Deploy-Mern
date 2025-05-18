const db = require('../db'); 

// const createBehaviour = (req, res) => {
//     const { EmpID, StudentID, Anticident, Behaviour, Consequence, Duration, FrequencyCount, DateTime } = req.body;
    
//     const sql = `INSERT INTO t_ngo_behaviour (EmpID, StudentID, Anticident, Behaviour, Consequence, Duration, FrequencyCount, DateTime) 
//                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

//     db.query(sql, [EmpID, StudentID, Anticident, Behaviour, Consequence, Duration, FrequencyCount, DateTime], (err, result) => {
//         if (err) {
//             return res.status(500).json({ error: "Database error", details: err });
//         }
//         res.status(201).json({ message: "Record added successfully!", id: result.insertId });
//     });
// };
const createBehaviour = (req, res) => {
    const behaviours = req.body; // Expecting an array of behaviour objects

    if (!Array.isArray(behaviours) || behaviours.length === 0) {
        return res.status(400).json({ error: "Invalid input, expected an array of objects." });
    }

    const sql = `INSERT INTO t_ngo_behaviour (EmpID, StudentID, Anticident, Behaviour, Consequence, Duration, FrequencyCount, DateTime) 
                 VALUES ?`;

    const values = behaviours.map(({ EmpID, StudentID, Anticident, Behaviour, Consequence, Duration, FrequencyCount, DateTime }) => 
        [EmpID, StudentID, Anticident, Behaviour, Consequence, Duration, FrequencyCount, DateTime]
    );

    db.query(sql, [values], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err });
        }
        res.status(201).json({ message: "Records added successfully!", affectedRows: result.affectedRows });
    });
};


const createNotes= (req, res) => {
 const notes=req.body;
 if (!Array.isArray(notes) || notes.length === 0) {
    return res.status(400).json({ error: "Invalid input, expected an array of objects." });
}


const sql = `INSERT INTO t_ngo_notes (EmpID, studentID, Notes,DateTime) 
VALUES ?`;

const values = notes.map(({EmpID, studentID, Notes}) => 
    [EmpID, studentID, Notes,new Date()]
);

db.query(sql, [values], (err, result) => {
    if (err) {
        return res.status(500).json({ error: "Database error", details: err });
    }
    res.status(201).json({ message: "Notes added successfully!", affectedRows: result.affectedRows });
});
};


// Create or update communication record
const createCommunication = (req, res) => {
    const { studentID, EmpID, CommunicationType, Prompted, Independent } = req.body;
  
    if (!studentID || !EmpID || !CommunicationType || !Prompted || !Independent) {
      return res.status(400).json({ error: "All fields are required." });
    }
  
    // Check if the record already exists
    const checkSql = `SELECT * FROM t_ngo_communication WHERE studentID = ? AND CommunicationType = ?`;
    
    db.query(checkSql, [studentID, CommunicationType], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error", details: err });
      }
  
      if (result.length > 0) {
        // Update existing record
        const updateSql = `
          UPDATE t_ngo_communication 
          SET Prompted = ?, Independent = ?, DateTime = CURRENT_TIMESTAMP 
          WHERE studentID = ? AND CommunicationType = ?`;
  
        db.query(updateSql, [Prompted, Independent, studentID, CommunicationType], (updateErr, updateResult) => {
          if (updateErr) {
            return res.status(500).json({ error: "Database error", details: updateErr });
          }
          res.status(200).json({ message: "Communication record updated successfully!" });
        });
  
      } else {
        // Insert new record
        const insertSql = `INSERT INTO t_ngo_communication (studentID, EmpID, CommunicationType, Prompted, Independent) VALUES (?, ?, ?, ?, ?)`;
        
        db.query(insertSql, [studentID, EmpID, CommunicationType, Prompted, Independent], (insertErr, insertResult) => {
          if (insertErr) {
            return res.status(500).json({ error: "Database error", details: insertErr });
          }
          res.status(201).json({ message: "Communication record added successfully!" });
        });
      }
    });
  };
  

module.exports={createBehaviour, createNotes, createCommunication};