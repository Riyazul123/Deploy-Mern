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

//for development
// app.use(cors({
//   origin: "http://localhost:3000", // Frontend URL
//   methods: ["GET", "POST", "PUT", "DELETE"], // Allow all necessary HTTP methods
//   credentials: true, // Allow credentials (cookies, headers, etc.)
//   allowedHeaders: ["Content-Type", "Authorization"], // Ensure proper headers are allowed
// }));


// Middleware
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Temporarily allow all origins for debugging
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// Routes
app.use('/api', studentRoutes);

app.get("/", (req, res) => {
    res.json("Hello");
})

// MongoDB connection
mongoose.connect('mongodb+srv://vercel-admin-user-671566d006c9dc61232e4eed:YOuLrIjMTAqtb9Xh@cluster0.k9eba.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.log(err));

app.get("/test-connection", async (req, res) => {
    try {
      await mongoose.connect('mongodb+srv://vercel-admin-user-671566d006c9dc61232e4eed:YOuLrIjMTAqtb9Xh@cluster0.k9eba.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
      res.status(200).send("MongoDB connection is successful.");
      res.json("MongoDB connection is successful.");
    } catch (err) {
      res.status(500).send("MongoDB connection failed.");
      res.json("MongoDB connection failed.");
      res.json(err);
    }
  });
  

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
