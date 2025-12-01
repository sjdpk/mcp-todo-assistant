import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import routes from "./routes/index.js";
import { pool } from './config/db.js';

const app = express();

// cors middleware
app.use(cors({
    origin: config.crossOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Using Routes
app.use("/api", routes);

// Server connection
pool.connect()
    .then(() => {
        console.log("Connected to the database successfully.");
        app.listen(config.port, () => {
            console.log(`Server is running on port ${config.port}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to the database:", err);
    });