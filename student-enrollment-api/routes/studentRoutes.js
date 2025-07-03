const express = require('express');
const { authController}= require('../controllers/loginController');
const { registerEmployee, getEmployeeById, getAllEmployees}= require('../controllers/signupController');
const { getAllStudents}= require('../controllers/studentsController');
const { allocateStudent,getAllocationById,getStudentnameById}= require('../controllers/allocationController');
const {gettargetStudentBYID ,targetStudent,getbaselineStudentByID,createBaseline,getConsecutiveIndependentResponses, getupdateTargetData, getMaintenanceData}= require('../controllers/notebookRoutes');

const { createBehaviour,createNotes,createCommunication, createEyeCommunication}= require('../controllers/behaviourController');

const { getStudentReport}= require('../controllers/studentReportCardController');

const { enrollStudent, getStudents, updateStudent, feesStudents, createFeeEntry, incExpEntry, getPaymentSlip, calculateMonthlyIncomeExpense } = require('../controllers/studentController');


const router = express.Router();

router.post('/enroll', enrollStudent);

router.get('/students', getStudents);

router.put('/students/:id', updateStudent); 

router.get('/fees', feesStudents);

router.post('/createfees', createFeeEntry);

router.post('/incexpentry', incExpEntry);

router.get('/payment-slip', getPaymentSlip);

router.post('/calculate-income-expense', calculateMonthlyIncomeExpense);




//Teacher Part

router.post('/login', authController);
router.post('/empSignUp', registerEmployee );

router.get('/getEmployeeById', getEmployeeById );
router.get('/getAllEmployees', getAllEmployees );
router.get('/getAllStudents', getAllStudents );
router.post('/allocateStudent', allocateStudent );
router.get('/getAllocationById', getAllocationById );
router.get('/getStudentnameById', getStudentnameById );

router.get('/targetStudentBYID', gettargetStudentBYID );

router.post('/targets', targetStudent);
router.get('/baselineStudentByID', getbaselineStudentByID );

router.get('/getConsecutiveIndependentResponses', getConsecutiveIndependentResponses );
router.post('/createBehaviour', createBehaviour);
router.post('/createNotes', createNotes);

router.post('/createCommunication', createCommunication);

router.post('/baseline', createBaseline);
router.put('/getupdateTargetData',getupdateTargetData)

router.get('/maintenance', getMaintenanceData);
router.get('/getStudentReport', getStudentReport);

router.post('/createEyeCommunication', createEyeCommunication);



module.exports = router;
