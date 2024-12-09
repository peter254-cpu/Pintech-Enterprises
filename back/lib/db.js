import mongoose from "mongoose";

export const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        // Drop the database 
        //await mongoose.connection.dropDatabase();
        console.log(`Mongo db connected: ${conn.connection.host}`)
    } catch (error) {
        console.error("Error connecting to database", error)
        process.exit(1)
    }
}