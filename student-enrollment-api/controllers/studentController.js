const Student = require('../models/studentModel');
const Fees = require('../models/feesModel');
const InExp = require('../models/inExpModel');

// @desc    Enroll a new student
// @route   POST /api/students
// @access  Public
const enrollStudent = async (req, res) => {
    const { student_name, student_dob, fathers_name, mothers_name, contact_no, email_id, alternative_contact_no,
        alternative_email_id, fees, date_of_admission, no_of_days } = req.body;

    try {
        const newStudent = new Student({
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
            no_of_days
        });

        await newStudent.save();

        res.status(201).json({
            message: 'Student enrolled successfully',
            student: newStudent,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc    Get all students
// @route   GET /api/students
// @access  Public
const getStudents = async (req, res) => {
    const { start_date, end_date } = req.query;
    try {
        const students = await Student.find({
            date_of_admission: {
                $gte: new Date(start_date),
                $lte: new Date(end_date),
            },
        });
        res.status(200).send(students);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
const feesStudents= async (req, res) => {
    const { search } = req.query;

    try {
        const students = await Student.find({
            $or: [
                { enrollment_id: search },
                { student_name: { $regex: search, $options: 'i' } } // Case insensitive search
            ]
        });

        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createFeeEntry = async (req, res) => {
    const { student_enrollment_id, fees, amt_paid, late_fine, disc_amt, payment_details, payment_type, cheque_number ,fees_for_month} = req.body;

    try {
        // const feeEntry = new Fees({
        //     student_enrollment_id,
        //     fees,
        //     amt_paid,
        //     late_fine,
        //     disc_amt,
        //     payment_details,
        //     payment_type,
        //     cheque_number,
        // });

        const total_paid_amt = amt_paid + late_fine - disc_amt;

        // Create a new fee entry with the calculated total_amt_paid
        const feeEntry = new Fees({
            student_enrollment_id,
            fees,
            amt_paid,
            late_fine,
            disc_amt,
            total_paid_amt, // Add total amount paid to the entry
            payment_details,
            payment_type,
            cheque_number,
            fees_for_month
        });

        await feeEntry.save();
        res.status(201).json({ message: 'Fee entry created successfully', feeEntry });
    } catch (error) {
        res.status(400).json({ message: 'Error creating fee entry', error });
    }
};


const incExpEntry = async (req, res) => {
    const { inExp_type, inExp_details, rec_send_name, amt_paid, payment_type, cheque_number, cheque_date, date_of_inexp } = req.body;

    try {
        const newEntry = new InExp({
            inExp_type,
            inExp_details,
            rec_send_name,
            amt_paid,
            payment_type,
            cheque_number,
            cheque_date, // Make sure to include cheque_date in the entry
            date_of_inexp
        });

        await newEntry.save();
        res.status(201).json({ message: 'Entry created successfully', newEntry });
    } catch (error) {
        res.status(400).json({ message: 'Error creating entry', error });
    }
};

 const getPaymentSlip = async (req, res) => {
    const { enrollment_id, student_name } = req.query;
  
    try {
      let student;
      if (enrollment_id) {
        // Fetch by enrollment ID
        student = await Student.findOne({ enrollment_id });
      } else if (student_name) {
        // Fetch by student name
        student = await Student.findOne({ student_name: new RegExp(student_name, 'i') });
      }
  
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Fetch fees based on the student's enrollment ID
      const fees = await Fees.findOne({ student_enrollment_id: student.enrollment_id });
  
      if (!fees) {
        return res.status(404).json({ message: 'Fees details not found for this student' });
      }
  
      // Return the combined student and fees data
      res.status(200).json({
        student: {
          student_name: student.student_name,
          fathers_name: student.fathers_name,
          mothers_name: student.mothers_name,
          contact_no: student.contact_no,
          email_id: student.email_id,
          fees: student.fees,
          enrollment_id: student.enrollment_id,
          date_of_admission: student.date_of_admission,
        },
        fees: {
          fees: fees.fees,
          amt_paid: fees.amt_paid,
          late_fine: fees.late_fine,
          disc_amt: fees.disc_amt,
          payment_details: fees.payment_details,
          payment_type: fees.payment_type,
          cheque_number: fees.cheque_number,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  const calculateMonthlyIncomeExpense = async (req, res) => {
    const { fromDate, toDate } = req.body;

    try {
        // Validate the date inputs
        if (!fromDate || !toDate) {
            return res.status(400).json({ message: "Please provide both 'fromDate' and 'toDate'." });
        }

        // Convert the input dates into valid Date objects
        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999); // Include the entire 'toDate' day

        // Fetch income and expenses from 'InExp'
        const incomeData = await InExp.find({
            inExp_type: 'income',
            date_of_inexp: { $gte: startDate, $lte: endDate },
        });

        const expenseData = await InExp.find({
            inExp_type: 'expense',
            date_of_inexp: { $gte: startDate, $lte: endDate },
        });

        // Fetch fees data from 'Fees' collection
        const feesIncomeData = await Fees.find({
            fees_for_month: { $gte: startDate, $lte: endDate },
        });

        // Prepare rows for income
        const incomeRows = [
            ...incomeData.map((entry) => ({
                date: entry.date_of_inexp.toLocaleDateString(),
                incomeHead: entry.inExp_details || "N/A",
                receivedFrom: entry.rec_send_name || "N/A",
                amount: entry.amt_paid.toFixed(2),
            })),
            ...feesIncomeData.map((fees) => ({
                date: fees.fees_for_month.toLocaleDateString(),
                incomeHead: "Tuition Fees",
                receivedFrom: fees.student_enrollment_id,
                amount: fees.total_paid_amt.toFixed(2),
            })),
        ];

        // Prepare rows for expenses
        const expenseRows = expenseData.map((entry) => ({
            date: entry.date_of_inexp.toLocaleDateString(),
            expensesHead: entry.inExp_details || "N/A",
            paymentTo: entry.rec_send_name || "N/A",
            amount: entry.amt_paid.toFixed(2),
        }));

        // Calculate totals
        const totalIncome = incomeRows.reduce((sum, row) => sum + parseFloat(row.amount), 0);
        const totalExpense = expenseRows.reduce((sum, row) => sum + parseFloat(row.amount), 0);

        // Return the formatted data
        return res.status(200).json({
            incomeRows,
            expenseRows,
            totalIncome: totalIncome.toFixed(2),
            totalExpense: totalExpense.toFixed(2),
        });
    } catch (error) {
        console.error("Error calculating monthly income and expense:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



//   const calculateMonthlyIncomeExpense = async (req, res) => {
//     const { fromDate, toDate } = req.body;

//     try {
//         // Validate the date inputs
//         if (!fromDate || !toDate) {
//             return res.status(400).json({ message: "Please provide both 'fromDate' and 'toDate'." });
//         }

//         // Convert the input dates into valid Date objects
//         const startDate = new Date(fromDate);
//         const endDate = new Date(toDate);
//         endDate.setHours(23, 59, 59, 999);  // To include the entire 'toDate' day

//         // Fetch income from 'InExp' where 'inExp_type' is income
//         const incomeData = await InExp.find({
//             inExp_type: 'income',
//             createdAt: { $gte: startDate, $lte: endDate }
//         });

//         // Fetch expense from 'InExp' where 'inExp_type' is expense
//         const expenseData = await InExp.find({
//             inExp_type: 'expense',
//             createdAt: { $gte: startDate, $lte: endDate }
//         });

//         // Fetch additional income from the 'Fees' collection (fees paid)
//         const feesIncomeData = await Fees.find({
//             createdAt: { $gte: startDate, $lte: endDate }
//         });

//         // Calculate the total income and expense
//         let totalIncome = 0;
//         let totalExpense = 0;

//         // Sum up income from 'InExp'
//         incomeData.forEach(entry => {
//             totalIncome += entry.amt_paid;
//         });

//         // Sum up fees paid as income
//         feesIncomeData.forEach(fees => {
//             totalIncome += fees.total_paid_amt;
//         });

//         // Sum up expense from 'InExp'
//         expenseData.forEach(entry => {
//             totalExpense += entry.amt_paid;
//         });

//         // Return the result
//         return res.status(200).json({
//             income: totalIncome,
//             expense: totalExpense,
//         });
//     } catch (error) {
//         console.error("Error calculating monthly income and expense:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };

module.exports = { enrollStudent, getStudents, feesStudents, createFeeEntry, incExpEntry, getPaymentSlip, calculateMonthlyIncomeExpense };
