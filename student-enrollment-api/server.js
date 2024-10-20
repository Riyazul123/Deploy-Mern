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
app.use(cors(
    {
        origin: ["https://deploy-mern-frontend.vercel.app"],
        methods: ["POST", "GET"],
        credentials: true
    }
));

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
