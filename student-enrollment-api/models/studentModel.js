const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const studentSchema = new mongoose.Schema({
    student_name: {
        type: String,
        required: true,
    },
    student_dob: {
        type: Date,
        required: true,
    },
    fathers_name: {
        type: String,
        required: true,
    },
    mothers_name: {
        type: String,
        required: true,
    },
    contact_no: {
        type: String,
        required: true,
        unique: true,
        match: [/^\d{10}$/, 'Contact number should be 10 digits long'],
    },
    email_id: {
        type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
    },
    alternative_contact_no: {
        type: String,
        
        match: [/^\d{10}$/, 'Contact number should be 10 digits long'],
    },
    alternative_email_id: {
        type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
    },
    fees: {
        type: Number,
        required: true,
    },
    date_of_admission: {
        type: Date,
        required: true,
    },
    no_of_days: {
        type: Number,
        required: true,
    },
    enrollment_id: {
        type: String,
        unique: true,
    },
    student_type: {
        type: String,
        required: true,
    },
}, { timestamps: true });



// studentSchema.pre('save', async function(next) {
//     const student = this;
    
//     // Extract initials from the student's name
//     const initials = student.student_name.split(' ').map(name => name[0].toUpperCase()).join('');
    
//     // Format the date of admission as ddmmyy
//     const admissionDate = new Date(student.date_of_admission);
//     const formattedDate = `${String(admissionDate.getDate()).padStart(2, '0')}${String(admissionDate.getMonth() + 1).padStart(2, '0')}${String(admissionDate.getFullYear()).slice(-2)}`;
    
//     // Count the number of students with the same initials and admission date
//     const sameDayStudents = await mongoose.model('Student').countDocuments({
//         student_name: student.student_name,
//         date_of_admission: admissionDate,
//     });

//     // Generate numeric sequence (e.g., 01, 02)
//     const numericSequence = String(sameDayStudents + 1).padStart(2, '0');
    
//     // Construct the enrollment ID
//     student.enrollment_id = `${initials}-${formattedDate}-${numericSequence}`;
    
//     next();
// });


studentSchema.pre('save', async function (next) {
    const student = this;

    // Check if the document is new (only run on creation, not updates)
    if (student.isNew) {
        // Extract the year from the date of admission
        const admissionYear = new Date(student.date_of_admission).getFullYear();

        // Find the highest enrollment_id for the current year
        const lastStudent = await mongoose.model('Student').findOne({
            enrollment_id: new RegExp(`^${admissionYear}-\\d{4}$`), // Matches IDs like "2024-1001"
        }).sort({ enrollment_id: -1 }); // Sort in descending order to get the latest

        let nextSequenceNumber;
        if (lastStudent) {
            // Extract the numeric part of the enrollment_id
            const lastSequenceNumber = parseInt(lastStudent.enrollment_id.split('-')[1], 10);
            nextSequenceNumber = lastSequenceNumber + 1;
        } else {
            // Start with 1001 if no students exist for the current year
            nextSequenceNumber = 1001;
        }

        // Construct the new enrollment_id
        student.enrollment_id = `${admissionYear}-${nextSequenceNumber}`;
    }

    // Continue to save the student document
    next();
});


const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
