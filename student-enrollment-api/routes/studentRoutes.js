const express = require('express');
const { enrollStudent, getStudents,feesStudents, createFeeEntry, incExpEntry, getPaymentSlip, calculateMonthlyIncomeExpense } = require('../controllers/studentController');
const router = express.Router();

// // Route to enroll a student
// router.post('/', enrollStudent);

// // Route to get all students
// router.get('/', getStudents);

// Route for enrolling a student
router.post('/enroll', enrollStudent);

// Route for getting all students
router.get('/students', getStudents);

router.get('/fees', feesStudents);

router.post('/createfees', createFeeEntry);

router.post('/incexpentry', incExpEntry);

router.get('/payment-slip', getPaymentSlip);

router.post('/calculate-income-expense', calculateMonthlyIncomeExpense);


module.exports = router;
