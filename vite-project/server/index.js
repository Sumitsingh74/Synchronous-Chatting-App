import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import authRoutes from "./routes/AuthRoutes.js"

dotenv.config();

const app=express();
const port=process.env.PORT || 3001;
// console.log(port);
const databaseURL=process.env.DATABASE_URL;


// header('Access-Control-Allow-Origin', '*'); // Allow all origins
// header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allowed HTTP methods
// header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers

app.use(cors({
    origin:"*",
    // methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials: true,  // Allow credentials (cookies, auth headers)
    // allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
}));

app.use("/uploads/profiles",express.static("uploads/profiles"));

app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('CORS policy applied successfully.');
});

app.use("/api/auth",authRoutes);



const server =app.listen(port,()=>{
    console.log(`Server started at Port ${port}`);
});

mongoose.connect(databaseURL)

// Get the default connection
// Mongoose maintains a default connection object representing the MongoDB connection.
const db = mongoose.connection;

// Define event listeners for database connection

db.on('connected', () => {
    console.log('Connected to MongoDB server');
});

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Export the database connection
// module.exports = db;
