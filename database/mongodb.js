import mongoose from "mongoose";
import { DB_URI,NODE_ENV } from "../config/env.js";

if(!DB_URI){
    throw new Error('please define the MONGODB_URI environment variable inside .env<development/production>.local')
    
}

//connect

const connectToDatabase = async()=>{
    try {

        await mongoose.connect(DB_URI);

        console.log(`connected to database in ${NODE_ENV} mode`)
        
    } catch (error) {
        console.error('error connecting database:', error);

        process.exit(1);
        
    }
}

export default connectToDatabase;