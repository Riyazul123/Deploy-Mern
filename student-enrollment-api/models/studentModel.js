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
        match: [/^\d{10}$/, 'Contact number should be 10 digits long'],
    },
    email_id: {
        type: String,
        
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
}, { timestamps: true });

// studentSchema.pre('save', function(next) {
//     const student = this;
    
//     // Extract initials from the student's name
//     const initials = student.student_name.split(' ').map(name => name[0].toUpperCase()).join('');
    
//     // Generate a unique enrollment ID
//     const uniqueID = `${initials}-${Date.now()}-${uuidv4().slice(0, 6).toUpperCase()}`;
    
//     student.enrollment_id = uniqueID;
    
//     next();
// });
// Pre-save hook to generate enrollment_id

studentSchema.pre('save', async function(next) {
    const student = this;
    
    // Extract initials from the student's name
    const initials = student.student_name.split(' ').map(name => name[0].toUpperCase()).join('');
    
    // Format the date of admission as ddmmyy
    const admissionDate = new Date(student.date_of_admission);
    const formattedDate = `${String(admissionDate.getDate()).padStart(2, '0')}${String(admissionDate.getMonth() + 1).padStart(2, '0')}${String(admissionDate.getFullYear()).slice(-2)}`;
    
    // Count the number of students with the same initials and admission date
    const sameDayStudents = await mongoose.model('Student').countDocuments({
        student_name: student.student_name,
        date_of_admission: admissionDate,
    });

    // Generate numeric sequence (e.g., 01, 02)
    const numericSequence = String(sameDayStudents + 1).padStart(2, '0');
    
    // Construct the enrollment ID
    student.enrollment_id = `${initials}-${formattedDate}-${numericSequence}`;
    
    next();
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
