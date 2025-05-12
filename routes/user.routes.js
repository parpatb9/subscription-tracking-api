import { Router } from "express";

import authorize from "../middleware/auth.middleware.js";
import { getUser, getUsers } from "../controller/user.controller.js";

const userRouter = Router();

userRouter.get('/',getUsers);

//only logedin user can see it's details -> auth middleware in use
userRouter.get('/:id',authorize,getUser);

userRouter.post('/',(req,res)=> res.send({title: 'CREATE new users'}));

userRouter.put('/:id',(req,res)=> res.send({title: 'UPDATE user'}));

userRouter.delete('/:id',(req,res)=> res.send({title: 'DELETE a user'}));

export default userRouter;