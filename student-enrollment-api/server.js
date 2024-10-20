const express = require('express');
const cors = require('cors'); // Import the CORS package
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const studentRoutes = require('./routes/studentRoutes');


// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
// app.use(cors(
//     {
//         origin: ["https://student-management-admin.vercel.app"],
//         methods: ["POST", "GET"],
//         credentials: true
//     }
// ));

// CORS configuration
app.use(cors({
    origin: "https://student-management-admin.vercel.app", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow all necessary HTTP methods
    credentials: true, // Allow credentials (cookies, headers, etc.)
    allowedHeaders: ["Content-Type", "Authorization"], // Ensure proper headers are allowed
}));

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', studentRoutes);

app.get("/", (req, res) => {
    res.json("Hello");
})

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.log(err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
