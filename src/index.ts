import dotenv from "dotenv";
dotenv.config();

import config from "config";
import express, { Application } from "express";
import bodyParser from "body-parser";
import { connect } from "./db";
import authRoutes from "./routes/authRoutes";

const app: Application = express();
app.use(bodyParser.json());

if (!config.get("jwtPrivateKey")) {
    console.error("Fatal error");
    process.exit(1);
}

connect()
    .then(() => {
        console.log("Connected to MongoDB");

        app.use("/auth", authRoutes);

        const port = process.env.PORT || 4000;
        app.listen(port, () => {
            console.log(`Auth Service listening on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1); // Exit process with failure
    });
