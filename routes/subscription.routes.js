import { Router } from "express";
import authorize from '../middleware/auth.middleware.js';
import {createSubscription, getUserSubscription } from "../controller/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/',(req,res)=> res.send({title: 'GET all subscription'}));
subscriptionRouter.get('/:id',(req,res)=> res.send({title: 'GET subscription details'}));
subscriptionRouter.post('/',authorize,createSubscription);
subscriptionRouter.put('/:id',(req,res)=> res.send({title: 'UPDATE a subscription'}));
subscriptionRouter.delete('/:id',(req,res)=> res.send({title: 'DELETE a subscription'}));

subscriptionRouter.get('/user/:id',authorize,getUserSubscription);
subscriptionRouter.put('/:id/cancel',(req,res)=> res.send({title: 'CANCEL a subscription'}));

subscriptionRouter.get('/upcoming-renewel',(req,res)=> res.send({title: 'GET upcoming renewels'}));

export default subscriptionRouter;