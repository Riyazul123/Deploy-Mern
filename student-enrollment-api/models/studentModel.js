const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const studentSchema = new mongoose.Schema({
    student_name: {
        type: String,
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
    enrollment_id: {
        type: String,
        unique: true,
    },
}, { timestamps: true });

studentSchema.pre('save', function(next) {
    const student = this;
    
    // Extract initials from the student's name
    const initials = student.student_name.split(' ').map(name => name[0].toUpperCase()).join('');
    
    // Generate a unique enrollment ID
    const uniqueID = `${initials}-${Date.now()}-${uuidv4().slice(0, 6).toUpperCase()}`;
    
    student.enrollment_id = uniqueID;
    
    next();
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
