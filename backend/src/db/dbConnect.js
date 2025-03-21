import mongoose from "mongoose";

const dbConnect=async()=>{
    try {
        const connect =await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDb connected ${connect.connection.host}`)
    } catch (error) {
        console.log(`Error connecting to MongoDb ${error.message}`);
        process.exit(1);       
    }
}

export default dbConnect;