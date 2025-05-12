import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true,'Subscription name is required'],
        trim:true,
        minLength:2,
        maxLength:100,
    },
    price:{
        type:Number,
        required:[true,'subscription price is required'],
        min:[0,'price must be grater than 0'],
        max:[1000, 'price must be less than 1000'],

    },
    currency:{
        type:String,
        enum:['USD','EUR','GBP'],
        default:'USD',
    },
    frequency:{
        type: String,
        enum:['daily','weekly','monthly','yearly'],
    },
    category:{
        type:String,
        enum:['sports','news','entertainment','lifestyle','music','other'],
        required:true,
    },
    paymentMethod:{
        type:String,
        required:true,
        trim:true,

    },
    status:{
        type:String,
        enum:['active','cancelled','expired'],
        default:'active'
    },
    startDate:{
        type:Date,
        required:true,
        validate:{
            validator: (value)=> value <= new Date(),
            message:'start date must be in the past',
        }

    },
    renewelDate:{
        type:Date,
       
        validate:{
            validator: function(value){
               return value > this.startDate;
                
            } ,
            message:'start date must be after the startdate'
        }

    },
    user:{
       type: mongoose.Schema.Types.ObjectId,
       ref:'User',
       required:true,
       index:true,

    }

},{timestamps:true});

//autocalculate the renewel date if we don't provide
subscriptionSchema.pre('save',function(next){
    if(!this.renewelDate){
        const renewelPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };

        this.renewelDate = new Date(this.startDate);
        this.renewelDate.setDate(this.renewelDate.getDate() + renewelPeriods[this.frequency]);

    }
    //auto update status if renewel date has passed.

    if(this.renewelDate < new Date()){
        this.status='expired';
    }
    next();
});

const Subscription = mongoose.model('Sunscription',subscriptionSchema);

export default Subscription;