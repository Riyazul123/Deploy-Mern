const Student = require('../models/studentModel');
const Fees = require('../models/feesModel');
const InExp = require('../models/inExpModel');

// @desc    Enroll a new student
// @route   POST /api/students
// @access  Public
// const enrollStudent = async (req, res) => {
//     const { student_name, student_dob, fathers_name, mothers_name, contact_no, email_id, alternative_contact_no,
//         alternative_email_id, fees, date_of_admission, no_of_days } = req.body;

//     try {
//         const newStudent = new Student({
//             student_name,
//             student_dob,
//             fathers_name,
//             mothers_name,
//             contact_no,
//             email_id,
//             alternative_contact_no,
//             alternative_email_id,
//             fees,
//             date_of_admission,
//             no_of_days
//         });

//         await newStudent.save();

//         res.status(201).json({
//             message: 'Student enrolled successfully',
//             student: newStudent,
//         });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };


const enrollStudent = async (req, res) => {
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
        student_type
    } = req.body;

    try {
        // Check for existing student with the same contact_no or email_id
        const existingStudent = await Student.findOne({
            $or: [{ contact_no }, { email_id }],
        });

        if (existingStudent) {
            return res.status(400).json({
                error: `A student with this ${existingStudent.contact_no === contact_no ? 'contact number' : 'email ID'
                    } already exists.`,
            });
        }

        // Create a new student if no duplicates are found
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
            no_of_days,
            student_type
        });

        await newStudent.save();

        res.status(201).json({
            message: 'Student enrolled successfully',
            student: newStudent,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// @desc    Get all students
// @route   GET /api/students
// @access  Public
// const getStudents = async (req, res) => {
//     const { start_date, end_date } = req.query;
//     try {
//         const students = await Student.find({
//             date_of_admission: {
//                 $gte: new Date(start_date),
//                 $lte: new Date(end_date),
//             },
//         });
//         res.status(200).send(students);
//     } catch (error) {
//         res.status(500).send({ error: error.message });
//     }
// };

const getStudents = async (req, res) => {
    const { start_date, end_date } = req.query;

    try {
        const students = await Student.find({
            date_of_admission: {
                $gte: new Date(start_date),
                $lte: new Date(end_date),
            },
        });

        const formattedStudents = students.map(student => ({
            ...student.toObject(),
            student_dob: formatDate(student.student_dob),
            date_of_admission: formatDate(student.date_of_admission)
        }));

        res.status(200).send(formattedStudents);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const updateStudent = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {

        if (updatedData.student_dob) {
            const dobParts = updatedData.student_dob.split('-'); // Splitting "29-10-2016" -> ["29", "10", "2016"]
            const admisParts = updatedData.date_of_admission.split('-');
            if (dobParts.length === 3) {
                updatedData.student_dob = new Date(`${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`); // Convert to "2016-10-29"
                updatedData.date_of_admission = new Date(`${admisParts[2]}-${admisParts[1]}-${admisParts[0]}`); 
            } else {
                return res.status(400).json({ message: 'Invalid date format for student_dob or date_of_admission' });
            }
        }

        const updatedStudent = await Student.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
    } catch (error) {
        res.status(500).json({ message: 'Error updating student', error: error.message });
    }
};


const feesStudents = async (req, res) => {
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

// const createFeeEntry = async (req, res) => {
//     const {
//         student_enrollment_id,
//         fees, // This should match the remaining fees in the Student DB
//         amt_paid,
//         late_fine = 0, // Default to 0 if not provided
//         disc_amt = 0,  // Default to 0 if not provided
//         payment_details,
//         payment_type,
//         cheque_number,
//         fees_for_month,
//     } = req.body;

//     try {
//         // Fetch the student record using the enrollment ID
//         const student = await Student.findOne({ enrollment_id: student_enrollment_id });

//         if (!student) {
//             return res.status(404).json({ message: 'Student not found' });
//         }

//         // Calculate the remaining fees after payment
//         const total_paid_amt = amt_paid + late_fine - disc_amt;
//         const remaining_fees = student.fees - total_paid_amt;

//         if (remaining_fees < 0) {
//             return res.status(400).json({
//                 message: 'Amount paid exceeds the remaining fees',
//             });
//         }

//         // Update the student's remaining fees
//         student.fees = remaining_fees;
//         await student.save();

//         // Create a new fee entry with the calculated total amount paid
//         const feeEntry = new Fees({
//             student_enrollment_id,
//             fees: student.fees, // Remaining fees
//             amt_paid,
//             late_fine,
//             disc_amt,
//             total_paid_amt,
//             payment_details,
//             payment_type,
//             cheque_number,
//             fees_for_month,
//         });

//         await feeEntry.save();

//         res.status(201).json({
//             message: 'Fee entry created successfully',
//             feeEntry,
//             remaining_fees: student.fees,
//         });
//     } catch (error) {
//         res.status(400).json({ message: 'Error creating fee entry', error: error.message });
//     }
// };

const createFeeEntry = async (req, res) => {
    const {
        student_enrollment_id,
        fees, // This should match the remaining fees in the Student DB
        amt_paid,
        late_fine = 0, // Default to 0 if not provided
        disc_amt = 0,  // Default to 0 if not provided
        payment_details,
        payment_type,
        cheque_number,
        fees_for_month, // This should include the month and year (e.g., "2024-12")
    } = req.body;

    try {
        // Fetch the student record using the enrollment ID
        const student = await Student.findOne({ enrollment_id: student_enrollment_id });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const currentMonth = new Date(fees_for_month).getMonth();
        const currentYear = new Date(fees_for_month).getFullYear();

        // Check if the student is "regular" and has already paid for this month
        if (student.student_type === 'regular') {
            const existingFeeEntry = await Fees.findOne({
                student_enrollment_id,
                fees_for_month: { $gte: new Date(`${currentYear}-${currentMonth + 1}-01`), $lt: new Date(`${currentYear}-${currentMonth + 2}-01`) },
            });

            if (existingFeeEntry) {
                return res.status(400).json({
                    message: 'Regular students can only make one fee payment per month',
                });
            }
        }

        // Calculate the total paid amount
        const total_paid_amt = amt_paid + late_fine - disc_amt;

        // Ensure the payment does not exceed the remaining fees
        // const remaining_fees = student.fees - total_paid_amt;

       const remaining_fees = student.fees ;

        if (remaining_fees < 0) {
            return res.status(400).json({
                message: 'Amount paid exceeds the remaining fees',
            });
        }

        // Update the student's remaining fees
        // student.fees = remaining_fees;
        // await student.save();

        // Create a new fee entry
        const feeEntry = new Fees({
            student_enrollment_id,
            fees: remaining_fees,
            amt_paid,
            late_fine,
            disc_amt,
            total_paid_amt,
            payment_details,
            payment_type,
            cheque_number,
            fees_for_month,
        });

        await feeEntry.save();

        res.status(201).json({
            message: 'Fee entry created successfully',
            feeEntry,
            remaining_fees: student.fees,
        });
    } catch (error) {
        res.status(400).json({ message: 'Error creating fee entry', error: error.message });
    }
};

const incExpEntry = async (req, res) => {
    const { inExp_type, inExp_details, rec_send_name, amt_paid, payment_type, cheque_number, cheque_date, date_of_inexp, payment_details  } = req.body;

    try {
        const newEntry = new InExp({
            inExp_type,
            inExp_details,
            rec_send_name,
            amt_paid,
            payment_type,
            cheque_number,
            cheque_date, // Make sure to include cheque_date in the entry
            date_of_inexp,
            payment_details
        });

        await newEntry.save();
        res.status(201).json({ message: 'Entry created successfully', newEntry });
    } catch (error) {
        res.status(400).json({ message: 'Error creating entry', error });
    }
};

// const getPaymentSlip = async (req, res) => {
//     const { search } = req.query;

//     try {
//         // Find students by either enrollment ID or student name (case insensitive)
//         const students = await Student.find({
//             $or: [
//                 { enrollment_id: { $regex: search, $options: 'i' } },
//                 { student_name: { $regex: search, $options: 'i' } } // Case insensitive search
//             ]
//         });

//         if (!students || students.length === 0) {
//             return res.status(404).json({ message: 'No students found' });
//         }

//         // Fetch fees for each student based on their enrollment ID
//         const studentFees = await Promise.all(
//             students.map(async (student) => {
//                 const enrollmentId = String(student.enrollment_id).trim(); // Ensure it's a string and remove any leading/trailing spaces
//                 console.log(`Looking for fees with enrollment_id: ${enrollmentId}`); // Log for debugging

//                 // Ensure both student_enrollment_id and enrollment_id are treated as strings
//                 const fees = await Fees.findOne({ student_enrollment_id: enrollmentId });

//                 // Log fees for debugging
//                 console.log('Found fees:', fees);

//                 // Only return data if fees are found
//                 if (!fees) {
//                     console.log(`Fees not found for student with enrollment_id: ${student.enrollment_id}`); // Log the missing fees
//                     return null; // Return null if no fees found
//                 }

//                 return {
//                     student_id: student._id,
//                     fees: {
//                         fees: fees.fees,
//                         amt_paid: fees.amt_paid,
//                         late_fine: fees.late_fine,
//                         disc_amt: fees.disc_amt,
//                         payment_details: fees.payment_details,
//                         payment_type: fees.payment_type,
//                         cheque_number: fees.cheque_number,
//                     },
//                     student: {
//                         student_name: student.student_name,
//                         fathers_name: student.fathers_name,
//                         mothers_name: student.mothers_name,
//                         contact_no: student.contact_no,
//                         email_id: student.email_id,
//                         enrollment_id: student.enrollment_id,
//                         date_of_admission: student.date_of_admission,
//                     }
//                 };
//             })
//         )        ;

//         // Filter out students with no fees data (null)
//         const validStudentFees = studentFees.filter(item => item !== null);

//         if (validStudentFees.length === 0) {
//             return res.status(404).json({ message: 'No matching students with fees found' });
//         }

//         // Return the combined student and fees data
//         res.status(200).json(validStudentFees);
//     } catch (error) {
//         console.error('Error fetching payment slip:', error); // Log error details for debugging
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

//modified 04-02-2025 payment slip

const getPaymentSlip = async (req, res) => {
    const { search } = req.query;

    try {
        // Find students by either enrollment ID or student name (case insensitive)
        const students = await Student.find({
            $or: [
                { enrollment_id: { $regex: search, $options: 'i' } },
                { student_name: { $regex: search, $options: 'i' } }
            ]
        });

        if (!students || students.length === 0) {
            return res.status(404).json({ message: 'No students found' });
        }

        // Fetch fees for each student based on their enrollment ID
        const studentFees = await Promise.all(
            students.map(async (student) => {
                const enrollmentId = String(student.enrollment_id).trim();
                console.log(`Looking for fees with enrollment_id: ${enrollmentId}`);

                // Fetch all fee records for the student
                const feesList = await Fees.find({ student_enrollment_id: enrollmentId });

                console.log('Found fees:', feesList);

                if (!feesList || feesList.length === 0) {
                    console.log(`Fees not found for student with enrollment_id: ${student.enrollment_id}`);
                    return null;
                }

                return {
                    student_id: student._id,
                    fees: feesList.map(fees => ({
                        fees: fees.fees,
                        amt_paid: fees.amt_paid,
                        late_fine: fees.late_fine,
                        disc_amt: fees.disc_amt,
                        total_paid_amt: fees.total_paid_amt,
                        payment_details: fees.payment_details,
                        payment_type: fees.payment_type,
                        cheque_number: fees.cheque_number,
                        fees_for_month: fees.fees_for_month,
                    })),
                    student: {
                        student_name: student.student_name,
                        fathers_name: student.fathers_name,
                        mothers_name: student.mothers_name,
                        contact_no: student.contact_no,
                        email_id: student.email_id,
                        enrollment_id: student.enrollment_id,
                        date_of_admission: student.date_of_admission,
                    }
                };
            })
        );

        // Filter out students with no fees data
        const validStudentFees = studentFees.filter(item => item !== null);

        if (validStudentFees.length === 0) {
            return res.status(404).json({ message: 'No matching students with fees found' });
        }

        // Return the combined student and fees data
        res.status(200).json(validStudentFees);
    } catch (error) {
        console.error('Error fetching payment slip:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
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
                paymentDetails:entry.payment_details || "00"
            })),
            ...feesIncomeData.map((fees) => ({
                date: fees.fees_for_month.toLocaleDateString(),
                incomeHead: "Tuition Fees",
                receivedFrom: fees.student_enrollment_id,
                amount: fees.total_paid_amt.toFixed(2),
                paymentDetails:fees.payment_details
            })),
        ];

        // Prepare rows for expenses
        const expenseRows = expenseData.map((entry) => ({
            date: entry.date_of_inexp.toLocaleDateString(),
            expensesHead: entry.inExp_details || "N/A",
            paymentTo: entry.rec_send_name || "N/A",
            amount: entry.amt_paid.toFixed(2),
             paymentDetails:entry.payment_details || "00"
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
// Helper function to format the date as DDMMYYYY
const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};



module.exports = { enrollStudent, getStudents, updateStudent, feesStudents, createFeeEntry, incExpEntry, getPaymentSlip, calculateMonthlyIncomeExpense };
