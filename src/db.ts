import mongoose from "mongoose";

const connect = async (): Promise<void> => {
    const mongoURI = process.env.DB_URL ?? "mongodb://localhost:27017/auth";

    try {
        await mongoose.connect(mongoURI);
        console.log("Successfully connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit process with failure
    }
};

export { connect };
