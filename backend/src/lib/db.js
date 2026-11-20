import mongoose from "mongoose";
import "dotenv/config"

export async function connectDB() {
    try {
        const mongoUri = process.env.MONGO_URI

        if (!mongoUri) {
            throw new Error("MONGO_URI is required")
        }

        const conn = await mongoose.connect(mongoUri)

        console.log("MongoDB connected!", conn.connection.host)
    } catch (e) {
        console.error("MongoDB connection error:", e.message)
        process.exit(1) // 1 = FAILED : 0 = SUCCESS
    }
}