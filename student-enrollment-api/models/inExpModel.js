const mongoose = require('mongoose');
const inExpSchema = new mongoose.Schema({
    inExp_type: {
        type: String,
        required: true,
    },
    inExp_details: {
        type: String,
        default: null,
    },
    
    rec_send_name: {
        type: String,
        default: null,
    },
    amt_paid: {
        type: Number,
        required: true, // Set default to null for optional
    },
     payment_type: {
        type: String,
        default: null, // Set default to null for optional
    },

    cheque_number: {
        type: String,
        default: null,
    },
    cheque_date: { 
        type: Date,
        default: null,
    },
    date_of_inexp: { 
        type: Date,
        default: null,
    },
    payment_details:{
        type: String,
        default: null,
    }

}, { timestamps: true });

const InExp = mongoose.model('InExp', inExpSchema);

module.exports = InExp;
