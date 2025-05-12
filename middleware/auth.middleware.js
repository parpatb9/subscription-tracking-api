import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config/env.js";
import User from '../models/user.model.js';

 // if anyone make request it varifies that if user have permision
 //and if he has permission then moves on to the next part
const authorize = async(req , res , next)=>{
    try {
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(" ")[1];
        }

        if(!token) return res.status(401).json({message:'Unauthorize'});

        const decoded = jwt.verify(token,JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if(!user) return res.status(401).json({message:'Unauthorize'});

        req.user = user;

        next();
        
    } catch (error) {
        res.status(401).json({
            message:'Unauthorize',
            error:error.message,
        })
    }
}

export default authorize;