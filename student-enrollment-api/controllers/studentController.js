// const Student = require('../models/studentModel');
// const Fees = require('../models/feesModel');
// const InExp = require('../models/inExpModel');

const db = require('../db'); 
const crypto = require('crypto'); 

//-------------------------Start  mysql api-=----------------------------

// const enrollStudent = (req, res) => {
//     const {
//         student_name,
//         student_dob,
//         fathers_name,
//         mothers_name,
//         contact_no,
//         email_id,
//         alternative_contact_no,
//         alternative_email_id,
//         fees,
//         date_of_admission,
//         no_of_days,
//         student_type
//     } = req.body;

//     const checkQuery = 'SELECT * FROM students WHERE contact_no = ? OR email_id = ?';
//     db.query(checkQuery, [contact_no, email_id], (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });

//         if (results.length > 0) {
//             return res.status(400).json({
//                 error: `A student with this ${results[0].contact_no === contact_no ? 'contact number' : 'email ID'} already exists.`,
//             });
//         }

//         const admissionYear = new Date(date_of_admission).getFullYear();

//         const findLastQuery = `SELECT enrollment_id FROM students WHERE enrollment_id LIKE '${admissionYear}-%' ORDER BY enrollment_id DESC LIMIT 1`;

//         db.query(findLastQuery, (err, last) => {
//             if (err) return res.status(500).json({ error: err.message });

//             let nextSequence = 1001;
//             if (last.length > 0) {
//                 const lastId = last[0].enrollment_id;
//                 const lastNumber = parseInt(lastId.split('-')[1], 10);
//                 nextSequence = lastNumber + 1;
//             }

//             const enrollment_id = `${admissionYear}-${nextSequence}`;
//             const _id = crypto.randomBytes(12).toString('hex');
//             const createdAt = new Date();
//             const updatedAt = new Date();

//             const insertQuery = `
//                 INSERT INTO students (
//                     _id, student_name, student_dob, fathers_name, mothers_name, contact_no, email_id,
//                     alternative_contact_no, alternative_email_id, fees, date_of_admission,
//                     no_of_days, student_type, enrollment_id, createdAt, updatedAt
//                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//             `;

//             const values = [
//                 _id, student_name, student_dob, fathers_name, mothers_name, contact_no, email_id,
//                 alternative_contact_no, alternative_email_id, fees, date_of_admission,
//                 no_of_days, student_type, enrollment_id, createdAt, updatedAt
//             ];

//             db.query(insertQuery, values, (err, result) => {
//                 if (err) return res.status(500).json({ error: err.message });

//                 res.status(201).json({
//                     message: 'Student enrolled successfully',
//                     student_id: result.insertId,
//                     enrollment_id
//                 });
//             });
//         });
//     });
// };

// //-------------------------end mysql api-=----------------------------

// //-------------------------Start mysql api-=----------------------------
// const getStudents = (req, res) => {
//     const { start_date, end_date } = req.query;

//     const query = `SELECT * FROM students WHERE date_of_admission BETWEEN ? AND ?`;

//     db.query(query, [start_date, end_date], (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });

//         res.status(200).json(results);
//     });
// };
// //-------------------------end mysql api-=----------------------------


// //-------------------------Start mysql api-=----------------------------
// const updateStudent = (req, res) => {
//     const { id } = req.params;
//     const data = req.body;

//     // Optional: convert date if in dd-mm-yyyy
//     if (data.student_dob && data.student_dob.includes('-')) {
//         const dobParts = data.student_dob.split('-');
//         const admisParts = data.date_of_admission.split('-');
//         if (dobParts.length === 3 && admisParts.length === 3) {
//             data.student_dob = `${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`;
//             data.date_of_admission = `${admisParts[2]}-${admisParts[1]}-${admisParts[0]}`;
//         }
//     }

//     data.updatedAt = new Date();

//     const updateQuery = `UPDATE students SET ? WHERE id = ?`;

//     db.query(updateQuery, [data, id], (err, result) => {
//         if (err) return res.status(500).json({ error: err.message });

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ message: 'Student not found' });
//         }

//         res.status(200).json({ message: 'Student updated successfully' });
//     });
// };
// //-------------------------end mysql api-=----------------------------

// //-------------------------end mysql api-=----------------------------
// const feesStudents = (req, res) => {
//     const { search } = req.query;

//     const query = `
//         SELECT * FROM students
//         WHERE enrollment_id = ? OR student_name LIKE ?
//     `;

//     db.query(query, [search, `%${search}%`], (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });

//         res.json(results);
//     });
// };
// //-------------------------end mysql api-=----------------------------

/* --------------------------------------------------------- */
/* 1. Enroll a student                                        */
/* --------------------------------------------------------- */
const enrollStudent = async (req, res) => {
  try {
    const {
      student_name,
      student_dob,
      fathers_name,
      mothers_name,
      contact_no,
      email_id,
      alternative_contact_no,
      alternative_email_id,
      fees,
      date_of_admission,
      no_of_days,
      student_type,
    } = req.body;

    /* 1️⃣  duplicate check */
    const [dupes] = await db.execute(
      "SELECT contact_no, email_id FROM students WHERE contact_no = ? OR email_id = ?",
      [contact_no, email_id]
    );
    if (dupes.length) {
      return res.status(400).json({
        error: `A student with this ${
          dupes[0].contact_no === contact_no ? "contact number" : "email ID"
        } already exists.`,
      });
    }

    /* 2️⃣  generate enrollment_id */
    const admissionYear = new Date(date_of_admission).getFullYear();
    const [last] = await db.execute(
      `SELECT enrollment_id
         FROM students
        WHERE enrollment_id LIKE ?
        ORDER BY enrollment_id DESC
        LIMIT 1`,
      [`${admissionYear}-%`]
    );

    let nextSeq = 1001;
    if (last.length) {
      nextSeq = parseInt(last[0].enrollment_id.split("-")[1], 10) + 1;
    }
    const enrollment_id = `${admissionYear}-${nextSeq}`;

    /* 3️⃣  insert row */
    const insertSql = `
      INSERT INTO students
        (_id, student_name, student_dob, fathers_name, mothers_name,
         contact_no, email_id, alternative_contact_no, alternative_email_id,
         fees, date_of_admission, no_of_days, student_type, enrollment_id,
         createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const _id       = crypto.randomBytes(12).toString("hex");
    const now       = new Date();

    const [result]  = await db.execute(insertSql, [
      _id,
      student_name,
      student_dob,
      fathers_name,
      mothers_name,
      contact_no,
      email_id,
      alternative_contact_no,
      alternative_email_id,
      fees,
      date_of_admission,
      no_of_days,
      student_type,
      enrollment_id,
      now,
      now,
    ]);

    return res.status(201).json({
      message: "Student enrolled successfully",
      student_id: result.insertId,
      enrollment_id,
    });
  } catch (err) {
    console.error("enrollStudent error:", err);
    return res.status(500).json({ error: err.message });
  }
};

/* --------------------------------------------------------- */
/* 2. Get students between two admission dates                */
/* --------------------------------------------------------- */
const getStudents = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const [rows] = await db.execute(
      "SELECT * FROM students WHERE date_of_admission BETWEEN ? AND ?",
      [start_date, end_date]
    );
    return res.json(rows);
  } catch (err) {
    console.error("getStudents error:", err);
    return res.status(500).json({ error: err.message });
  }
};

/* --------------------------------------------------------- */
/* 3. Update student                                          */
/* --------------------------------------------------------- */
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const data   = { ...req.body };

    /* Convert dd-mm-yyyy → yyyy-mm-dd if needed */
    if (data.student_dob?.includes("-")) {
      const dobParts   = data.student_dob.split("-");
      const admisParts = data.date_of_admission?.split("-");
      if (dobParts.length === 3) {
        data.student_dob = `${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`;
      }
      if (admisParts?.length === 3) {
        data.date_of_admission = `${admisParts[2]}-${admisParts[1]}-${admisParts[0]}`;
      }
    }
    data.updatedAt = new Date();

    /* mysql2 supports object‑literal SET syntax */
    const [result] = await db.query("UPDATE students SET ? WHERE id = ?", [
      data,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json({ message: "Student updated successfully" });
  } catch (err) {
    console.error("updateStudent error:", err);
    return res.status(500).json({ error: err.message });
  }
};

/* --------------------------------------------------------- */
/* 4. Search students for fees page                           */
/* --------------------------------------------------------- */
// const feesStudents = async (req, res) => {
//   try {
//     const { search } = req.query;
//     const [rows] = await db.execute(
//       `SELECT * FROM students
//         WHERE enrollment_id = ? OR student_name LIKE ?`,
//       [search, `%${search}%`]
//     );
//     return res.json(rows);
//   } catch (err) {
//     console.error("feesStudents error:", err);
//     return res.status(500).json({ error: err.message });
//   }
// };
const feesStudents = async (req, res) => {
  try {
    const { search = "" } = req.query;
    const like = `%${search}%`;

    const sql = `
      SELECT *
      FROM students
      WHERE enrollment_id = ?
         OR student_name LIKE ?
    `;

    // 👇 use query() not execute()
    const [rows] = await db.query(sql, [search, like]);

    res.json(rows);
  } catch (err) {
    console.error("feesStudents error:", err);
    res.status(500).json({ error: err.message });
  }
};



// //-------------------------Start mysql api-=----------------------------
// const createFeeEntry = (req, res) => {
//     const {
//         student_enrollment_id,
//         amt_paid,
//         late_fine = 0,
//         disc_amt = 0,
//         payment_details,
//         payment_type,
//         cheque_number,
//         fees_for_month,
//     } = req.body;

//     // Validate fees_for_month
//     const feesDate = new Date(fees_for_month);
//     if (isNaN(feesDate)) {
//         return res.status(400).json({ message: 'Invalid fees_for_month format' });
//     }

//     const currentMonth = feesDate.getMonth() + 1;
//     const currentYear = feesDate.getFullYear();

//     // Step 1: Fetch the student
//     const studentQuery = 'SELECT * FROM students WHERE enrollment_id = ? LIMIT 1';
//     db.query(studentQuery, [student_enrollment_id], (err, studentResults) => {
//         if (err) return res.status(500).json({ error: err.message });

//         if (studentResults.length === 0) {
//             return res.status(404).json({ message: 'Student not found' });
//         }

//         const student = studentResults[0];

//         // Step 2: Check if regular student already paid this month
//         if (student.student_type === 'regular') {
//             const startDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
//             const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
//             const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
//             const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;

//             const checkQuery = `SELECT * FROM fees WHERE student_enrollment_id = ? AND fees_for_month >= ? AND fees_for_month < ?`;
//             db.query(checkQuery, [student_enrollment_id, startDate, endDate], (err, feeResults) => {
//                 if (err) return res.status(500).json({ error: err.message });

//                 if (feeResults.length > 0) {
//                     return res.status(400).json({ message: 'Regular students can only make one fee payment per month' });
//                 }

//                 insertFee(student);
//             });
//         } else {
//             insertFee(student);
//         }

//         function insertFee(student) {
//             const total_paid_amt = amt_paid + late_fine - disc_amt;
//             const fees = student.fees;
//             const id = crypto.randomBytes(12).toString('hex');
//             const createdAt = new Date();
//             const updatedAt = new Date();

//             if (fees < 0) {
//                 return res.status(400).json({ message: 'Amount paid exceeds the remaining fees' });
//             }

//             const insertQuery = `INSERT INTO fees (
//                 id,student_enrollment_id, fees, amt_paid, late_fine, disc_amt,
//                 total_paid_amt, payment_details, payment_type, cheque_number,
//                 fees_for_month, createdAt, updatedAt
//             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)`;

//             const values = [
//                 id,
//                 student_enrollment_id,
//                 fees,
//                 amt_paid,
//                 late_fine,
//                 disc_amt,
//                 total_paid_amt,
//                 payment_details,
//                 payment_type,
//                 cheque_number,
//                 fees_for_month,
//                 createdAt,
//                 updatedAt
//             ];

//             db.query(insertQuery, values, (err, result) => {
//                 if (err) return res.status(500).json({ error: err.message });

//                 res.status(201).json({
//                     message: 'Fee entry created successfully',
//                     fee_id: result.insertId,
//                     remaining_fees: student.fees
//                 });
//             });
//         }
//     });
// };

// //-------------------------end mysql api-=----------------------------

// //-------------------------Start mysql api-=----------------------------
// const incExpEntry = (req, res) => {
//     const {
//         inExp_type,
//         inExp_details,
//         rec_send_name,
//         amt_paid,
//         payment_type,
//         cheque_number,
//         cheque_date,
//         date_of_inexp,
//         payment_details
//     } = req.body;

//     const createdAt = new Date();
//     const updatedAt = new Date();
//     const id = crypto.randomBytes(12).toString('hex');
//     const query = `
//         INSERT INTO in_exp 
//         (id, inExp_type, inExp_details, rec_send_name, amt_paid, payment_type, cheque_number, cheque_date, date_of_inexp, payment_details, createdAt, updatedAt)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     const values = [
//         id,
//         inExp_type,
//         inExp_details,
//         rec_send_name,
//         amt_paid,
//         payment_type,
//         cheque_number,
//         cheque_date,
//         date_of_inexp,
//         payment_details,
//         createdAt,
//         updatedAt
//     ];

//     db.query(query, values, function (err, result) {
//         if (err) {
//             console.error('Error creating income/expense entry:', err);
//             return res.status(400).json({ message: 'Error creating entry', error: err });
//         }

//         res.status(201).json({
//             message: 'Entry created successfully',
//             insertedId: result.insertId
//         });
//     });
// };
/* ------------------------------------------------------------------ */
/* 1. Create a fee entry                                              */
/* ------------------------------------------------------------------ */
const createFeeEntry = async (req, res) => {
  try {
    const {
      student_enrollment_id,
      amt_paid,
      late_fine = 0,
      disc_amt = 0,
      payment_details,
      payment_type,
      cheque_number,
      fees_for_month,
    } = req.body;

    const feesDate = new Date(fees_for_month);
    if (isNaN(feesDate)) {
      return res.status(400).json({ message: "Invalid fees_for_month format" });
    }

    /* 1️⃣  fetch student */
    const [students] = await db.execute(
      "SELECT * FROM students WHERE enrollment_id = ? LIMIT 1",
      [student_enrollment_id]
    );

    if (students.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    const student = students[0];

    /* 2️⃣  if regular, ensure only one payment per calendar month */
    if (student.student_type === "regular") {
      const month  = feesDate.getMonth() + 1;
      const year   = feesDate.getFullYear();
      const start  = `${year}-${String(month).padStart(2, "0")}-01`;
      const nextM  = month === 12 ? 1 : month + 1;
      const nextY  = month === 12 ? year + 1 : year;
      const end    = `${nextY}-${String(nextM).padStart(2, "0")}-01`;

      const [existingFees] = await db.execute(
        `SELECT 1 FROM fees
          WHERE student_enrollment_id = ?
            AND fees_for_month >= ?
            AND fees_for_month < ?`,
        [student_enrollment_id, start, end]
      );

      if (existingFees.length > 0) {
        return res.status(400).json({
          message: "Regular students can only make one fee payment per month",
        });
      }
    }

    /* 3️⃣  insert fee row */
    const total_paid_amt = amt_paid + late_fine - disc_amt;
    if (total_paid_amt < 0) {
      return res
        .status(400)
        .json({ message: "Amount paid exceeds the remaining fees" });
    }

    const id        = crypto.randomBytes(12).toString("hex");
    const now       = new Date();
    const insertSql = `
      INSERT INTO fees
        (id, student_enrollment_id, fees, amt_paid, late_fine, disc_amt,
         total_paid_amt, payment_details, payment_type, cheque_number,
         fees_for_month, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await db.execute(insertSql, [
      id,
      student_enrollment_id,
      student.fees,          // original fees from student table
      amt_paid,
      late_fine,
      disc_amt,
      total_paid_amt,
      payment_details,
      payment_type,
      cheque_number,
      fees_for_month,
      now,
      now,
    ]);

    return res.status(201).json({
      message: "Fee entry created successfully",
      fee_id: result.insertId,
      remaining_fees: student.fees, // you might recalc remaining fees here
    });
  } catch (err) {
    console.error("createFeeEntry error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ------------------------------------------------------------------ */
/* 2. Create income / expense entry                                   */
/* ------------------------------------------------------------------ */
const incExpEntry = async (req, res) => {
  try {
    const {
      inExp_type,
      inExp_details,
      rec_send_name,
      amt_paid,
      payment_type,
      cheque_number,
      cheque_date,
      date_of_inexp,
      payment_details,
    } = req.body;

    const id  = crypto.randomBytes(12).toString("hex");
    const now = new Date();

    const sql = `
      INSERT INTO in_exp
        (id, inExp_type, inExp_details, rec_send_name, amt_paid,
         payment_type, cheque_number, cheque_date, date_of_inexp,
         payment_details, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await db.execute(sql, [
      id,
      inExp_type,
      inExp_details,
      rec_send_name,
      amt_paid,
      payment_type,
      cheque_number,
      cheque_date,
      date_of_inexp,
      payment_details,
      now,
      now,
    ]);

    return res.status(201).json({
      message: "Entry created successfully",
      insertedId: result.insertId,
    });
  } catch (err) {
    console.error("incExpEntry error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

//-------------------------end mysql api-=----------------------------


//-------------------------Start  mysql api-=----------------------------
// const getPaymentSlip = (req, res) => {
//     const { search } = req.query;

//     if (!search) {
//         return res.status(400).json({ message: 'Search query is required' });
//     }

//     const searchQuery = `
//         SELECT * FROM students 
//         WHERE enrollment_id LIKE ? OR student_name LIKE ?
//     `;

//     const searchValue = `%${search}%`;

//     db.query(searchQuery, [searchValue, searchValue], function (err, students) {
//         if (err) {
//             console.error('Error fetching students:', err);
//             return res.status(500).json({ message: 'Error fetching students', error: err });
//         }

//         if (students.length === 0) {
//             return res.status(404).json({ message: 'No students found' });
//         }

//         let results = [];
//         let pending = students.length;

//         students.forEach((student) => {
//             const enrollmentId = student.enrollment_id;

//             const feeQuery = `SELECT * FROM fees WHERE student_enrollment_id = ?`;
//             db.query(feeQuery, [enrollmentId], function (feeErr, fees) {
//                 if (feeErr) {
//                     console.error('Error fetching fees:', feeErr);
//                     return res.status(500).json({ message: 'Error fetching fees', error: feeErr });
//                 }

//                 if (fees.length > 0) {
//                     results.push({
//                         student_id: student.id,
//                         student: {
//                             student_name: student.student_name,
//                             fathers_name: student.fathers_name,
//                             mothers_name: student.mothers_name,
//                             contact_no: student.contact_no,
//                             email_id: student.email_id,
//                             enrollment_id: student.enrollment_id,
//                             date_of_admission: student.date_of_admission
//                         },
//                         fees: fees.map(f => ({
//                             fees: f.fees,
//                             amt_paid: f.amt_paid,
//                             late_fine: f.late_fine,
//                             disc_amt: f.disc_amt,
//                             total_paid_amt: f.total_paid_amt,
//                             payment_details: f.payment_details,
//                             payment_type: f.payment_type,
//                             cheque_number: f.cheque_number,
//                             fees_for_month: f.fees_for_month
//                         }))
//                     });
//                 }

//                 pending--;

//                 // Send response when all queries are done
//                 if (pending === 0) {
//                     if (results.length === 0) {
//                         return res.status(404).json({ message: 'No matching students with fees found' });
//                     }
//                     res.status(200).json(results);
//                 }
//             });
//         });
//     });
// };
const getPaymentSlip = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const searchSql = `
      SELECT *
        FROM students
       WHERE enrollment_id LIKE ? OR student_name LIKE ?
    `;
    const searchVal = `%${search}%`;

    /* 1️⃣  fetch matching students */
    const [students] = await db.query(searchSql, [searchVal, searchVal]);
    if (students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }

    /* 2️⃣  for each student fetch fees (in parallel via Promise.all) */
    const feeSql = "SELECT * FROM fees WHERE student_enrollment_id = ?";

    const resultPromises = students.map(async (stu) => {
      const [fees] = await db.execute(feeSql, [stu.enrollment_id]);
      if (fees.length === 0) return null; // no fees ⇒ skip

      return {
        student_id: stu.id,
        student: {
          student_name: stu.student_name,
          fathers_name: stu.fathers_name,
          mothers_name: stu.mothers_name,
          contact_no: stu.contact_no,
          email_id: stu.email_id,
          enrollment_id: stu.enrollment_id,
          date_of_admission: stu.date_of_admission,
        },
        fees: fees.map((f) => ({
          fees: f.fees,
          amt_paid: f.amt_paid,
          late_fine: f.late_fine,
          disc_amt: f.disc_amt,
          total_paid_amt: f.total_paid_amt,
          payment_details: f.payment_details,
          payment_type: f.payment_type,
          cheque_number: f.cheque_number,
          fees_for_month: f.fees_for_month,
        })),
      };
    });

    const results = (await Promise.all(resultPromises)).filter(Boolean);

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No matching students with fees found" });
    }

    return res.status(200).json(results);
  } catch (err) {
    console.error("getPaymentSlip error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
//-------------------------end mysql api-=----------------------------

//-------------------------Start mysql api-=----------------------------

// const calculateMonthlyIncomeExpense = (req, res) => {
//     const { fromDate, toDate } = req.body;

//     if (!fromDate || !toDate) {
//         return res.status(400).json({ message: "Please provide both 'fromDate' and 'toDate'." });
//     }

//     const startDate = new Date(fromDate);
//     const endDate = new Date(toDate);
//     endDate.setHours(23, 59, 59, 999);

//     const formattedStart = startDate.toISOString().slice(0, 19).replace('T', ' ');
//     const formattedEnd = endDate.toISOString().slice(0, 19).replace('T', ' ');

//     const incomeQuery = `
//         SELECT * FROM in_exp
//         WHERE inExp_type = 'income' AND date_of_inexp BETWEEN ? AND ?
//     `;
//     const expenseQuery = `
//         SELECT * FROM in_exp
//         WHERE inExp_type = 'expense' AND date_of_inexp BETWEEN ? AND ?
//     `;
//     const feesQuery = `
//         SELECT * FROM fees
//         WHERE fees_for_month BETWEEN ? AND ?
//     `;

//     db.query(incomeQuery, [formattedStart, formattedEnd], (err1, incomeData) => {
//         if (err1) return res.status(500).json({ message: 'Error fetching income data', error: err1 });

//         db.query(expenseQuery, [formattedStart, formattedEnd], (err2, expenseData) => {
//             if (err2) return res.status(500).json({ message: 'Error fetching expense data', error: err2 });

//             db.query(feesQuery, [formattedStart, formattedEnd], (err3, feesIncomeData) => {
//                 if (err3) return res.status(500).json({ message: 'Error fetching fees data', error: err3 });

//                 const incomeRows = [
//                     ...incomeData.map(entry => ({
//                         date: formatDate(new Date(entry.date_of_inexp)),
//                         incomeHead: entry.inExp_details || "N/A",
//                         receivedFrom: entry.rec_send_name || "N/A",
//                         amount: parseFloat(entry.amt_paid).toFixed(2),
//                         paymentDetails: entry.payment_details || "00"
//                     })),
//                     ...feesIncomeData.map(fees => ({
//                         date: formatDate(new Date(fees.fees_for_month)),
//                         incomeHead: "Tuition Fees",
//                         receivedFrom: fees.student_enrollment_id,
//                         amount: parseFloat(fees.total_paid_amt).toFixed(2),
//                         paymentDetails: fees.payment_details || "00"
//                     }))
//                 ];

//                 const expenseRows = expenseData.map(entry => ({
//                     date: formatDate(new Date(entry.date_of_inexp)),
//                     expensesHead: entry.inExp_details || "N/A",
//                     paymentTo: entry.rec_send_name || "N/A",
//                     amount: parseFloat(entry.amt_paid).toFixed(2),
//                     paymentDetails: entry.payment_details || "00"
//                 }));

//                 const totalIncome = incomeRows.reduce((sum, row) => sum + parseFloat(row.amount), 0);
//                 const totalExpense = expenseRows.reduce((sum, row) => sum + parseFloat(row.amount), 0);

//                 res.status(200).json({
//                     incomeRows,
//                     expenseRows,
//                     totalIncome: totalIncome.toFixed(2),
//                     totalExpense: totalExpense.toFixed(2),
//                 });
//             });
//         });
//     });
// };
const calculateMonthlyIncomeExpense = async (req, res) => {
  try {
    const { fromDate, toDate } = req.body;

    if (!fromDate || !toDate) {
      return res.status(400).json({ message: "Please provide both 'fromDate' and 'toDate'." });
    }

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    endDate.setHours(23, 59, 59, 999);

    const formattedStart = startDate.toISOString().slice(0, 19).replace("T", " ");
    const formattedEnd = endDate.toISOString().slice(0, 19).replace("T", " ");

    const incomeQuery = `
      SELECT * FROM in_exp
      WHERE inExp_type = 'income' AND date_of_inexp BETWEEN ? AND ?
    `;
    const expenseQuery = `
      SELECT * FROM in_exp
      WHERE inExp_type = 'expense' AND date_of_inexp BETWEEN ? AND ?
    `;
    const feesQuery = `
      SELECT * FROM fees
      WHERE fees_for_month BETWEEN ? AND ?
    `;

    // Await all three queries in parallel (faster)
    const [incomeResult, expenseResult, feesResult] = await Promise.all([
      db.query(incomeQuery, [formattedStart, formattedEnd]),
      db.query(expenseQuery, [formattedStart, formattedEnd]),
      db.query(feesQuery, [formattedStart, formattedEnd])
    ]);

    const incomeData = incomeResult[0];
    const expenseData = expenseResult[0];
    const feesIncomeData = feesResult[0];

    // const incomeRows = [
    //   ...incomeData.map(entry => ({
    //     date: formatDate(new Date(entry.date_of_inexp)),
    //     incomeHead: entry.inExp_details || "N/A",
    //     receivedFrom: entry.rec_send_name || "N/A",
    //     amount: parseFloat(entry.amt_paid).toFixed(2),
    //     paymentDetails: entry.payment_details || "00"
    //   })),
    //   ...feesIncomeData.map(fees => ({
    //     date: formatDate(new Date(fees.fees_for_month)),
    //     incomeHead: "Tuition Fees",
    //     receivedFrom: fees.student_enrollment_id,
    //     amount: parseFloat(fees.total_paid_amt).toFixed(2),
    //     paymentDetails: fees.payment_details || "00"
    //   }))
    // ];

    // const expenseRows = expenseData.map(entry => ({
       

    //   date: formatDate(new Date(entry.date_of_inexp)),
    //   expensesHead: entry.inExp_details || "N/A",
    //   paymentTo: entry.rec_send_name || "N/A",
    //   amount: parseFloat(entry.amt_paid).toFixed(2),
    //   paymentDetails: entry.payment_details || "00"
    // }));

const incomeRows = [
  ...incomeData.map(entry => {
    const raw = new Date(entry.date_of_inexp);
    return {
      _rawDate: raw,                              // <-- keep raw
      date: formatDate(raw),
      incomeHead: entry.inExp_details || "N/A",
      receivedFrom: entry.rec_send_name || "N/A",
      amount: parseFloat(entry.amt_paid).toFixed(2),
      paymentDetails: entry.payment_details || "00"
    };
  }),
  ...feesIncomeData.map(fees => {
    const raw = new Date(fees.fees_for_month);
    return {
      _rawDate: raw,
      date: formatDate(raw),
      incomeHead: "Tuition Fees",
      receivedFrom: fees.student_enrollment_id,
      amount: parseFloat(fees.total_paid_amt).toFixed(2),
      paymentDetails: fees.payment_details || "00"
    };
  })
];

const expenseRows = expenseData.map(entry => {
  const raw = new Date(entry.date_of_inexp);
  return {
    _rawDate: raw,
    date: formatDate(raw),
    expensesHead: entry.inExp_details || "N/A",
    paymentTo: entry.rec_send_name || "N/A",
    amount: parseFloat(entry.amt_paid).toFixed(2),
    paymentDetails: entry.payment_details || "00"
  };
});

// 1. Sort by _rawDate
incomeRows.sort((a, b) => a._rawDate - b._rawDate);
expenseRows.sort((a, b) => a._rawDate - b._rawDate);

// 2. Drop the helper field before replying (optional but tidy)
incomeRows.forEach(row => delete row._rawDate);
expenseRows.forEach(row => delete row._rawDate);


    const totalIncome = incomeRows.reduce((sum, row) => sum + parseFloat(row.amount), 0);
    const totalExpense = expenseRows.reduce((sum, row) => sum + parseFloat(row.amount), 0);

    res.status(200).json({
      incomeRows,
      expenseRows,
      totalIncome: totalIncome.toFixed(2),
      totalExpense: totalExpense.toFixed(2),
    });
  } catch (err) {
    console.error("Error calculating income/expense:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//-------------------------end mysql api-=----------------------------

// Helper function to format the date as DDMMYYYY
const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};



module.exports = { enrollStudent, getStudents, updateStudent, feesStudents, createFeeEntry, incExpEntry, getPaymentSlip, calculateMonthlyIncomeExpense };
