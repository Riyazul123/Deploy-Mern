const mongoose = require('mongoose');
const feesSchema = new mongoose.Schema({
    student_enrollment_id: {
        type: String,
        required: true,
    },
  
    fees: {
        type: Number,
        required: true,
    },
    
    amt_paid: {
        type: Number,
        required: true,
    },
    late_fine: {
        type: Number,
        default: null, // Set default to null for optional
    },
    disc_amt: {
        type: Number,
        default: null, // Set default to null for optional
    },
    total_paid_amt: {
        type: Number,
        default: null, // Set default to null for optional
    },
    payment_details: {
        type: String,
        default: null, // Set default to null for optional
    },
     payment_type: {
        type: String,
        default: null, // Set default to null for optional
    },

    cheque_number: {
        type: String,
        default: null,
    },
    fees_for_month:{
        type: Date,
        required: true,
    },

}, { timestamps: true });

const Fees = mongoose.model('Fees', feesSchema);

module.exports = Fees;
