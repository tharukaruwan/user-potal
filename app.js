const express = require("express"); // require express 05
const app = express();              // create express server 06
const morgan = require("morgan");
const mongoose = require("mongoose");
const swaggerUI = require("swagger-ui-express");    // swagger UI
const swaggerJsDoc = require("swagger-jsdoc");      // swagger
require('dotenv').config();

const userRoutes = require('./api/routes/users/users');
const tockenRoutes = require('./api/routes/tocken/tocken');

mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
}).then(() => {
    console.log('Connected to persystance db...');
}).catch(err => {
    console.log('unabel to connect persystance db...', err);
});

const options = {
    definition: {
        info: {
            title: "User Potal API",
            version: "1.0.0",
            description: "User APIs documentation created by Tharuka Ruwan",
        },
        servers: [
            {
                url: "http://localhost:3001/api",
                description: "Localhost"
            }
        ],
    },
    apis: ["./api/routes/users/*.js", "./api/routes/tocken/*.js"],
};
const specs = swaggerJsDoc(options);

app.use(morgan("dev"));
// app.use("/upload", express.static("upload")); // make static and publicaly avalabel
app.use(express.urlencoded({ extended: false })); // allow url encorded data with extended false
app.use(express.json());                          // say we use json data

app.use((req, res, next) => {
    const allowedOrigins = ['*', 'http://localhost:3000'];   // allow all *
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma, Expires"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

// Routes users
app.use('/api/users', userRoutes);

// Routes tocken
app.use('/api/tocken', tockenRoutes);

// API documentation
app.use("/api/v1/docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;