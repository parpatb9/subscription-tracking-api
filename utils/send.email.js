import dayjs from "dayjs";
import transporter, { accountEmail } from "../config/nodemailer.js";
import { emailTemplates } from "./email.template.js";

export const sendReminderEmail = async ({to , type, subscription})=>{
    if(!to || !type){
        throw new Error('Missing required parameters to send email');
    }

    const tamplate = emailTemplates.find((template)=> template.label === type);

    if(!tamplate){
        throw new Error('Invalid email template type');
    }

    const mailInfo = {
        username: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewelDate).format('MMM D, YYYY'),
        price:`${subscription.currency} ${subscription.price} (${subscription.frequency})`,
        paymentMethod: subscription.paymentMethod,
    }

    const message = tamplate.generateBody(mailInfo);
    const subject = tamplate.generateSubject(mailInfo);
    const mailOptions = {
        from: accountEmail,
        to : to,
        subject: subject,
        html: message,
    }

    transporter.sendMail(mailOptions, (error, info)=>{
        if(error){
            console.log('Error sending email:', error);
            return;
        }
        console.log('Email sent:', info.response);
    })
}