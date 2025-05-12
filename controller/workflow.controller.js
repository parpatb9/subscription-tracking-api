import dayjs from 'dayjs'; //lightweight package for date and time calculation
//we can not use simple import because upstash is written in common JS
//we have to use it as a 'const' because import don't work directly
//in package.json I switch to type:module so we can only have imports and nothing else
// so have to take a step further import
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
//we can not use simple import because upstash is written in common JS
const {serve} = require('@upstash/workflow/express');

import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send.email.js';


const REMINDERS = [7,5,2,1];

export const sendReminders = serve(async(context)=>{
    //when we trigger a specific workflow we provide subscriptionId
    const {subscriptionId} = context.requestPayload;
    const subscription = await fetchSubscription(context,subscriptionId);

    if(!subscription || subscription.status != 'active') return;

   
    // const renewelDate = new Date(subscription.renewelDate)
    const renewelDate = dayjs(subscription.renewelDate);

    if(renewelDate.isBefore(dayjs())){
        console.log(`renewel date has passed for subscription ${subscriptionId}. stopping workflow.`);
        return;
    }

    for(const daysBefore of REMINDERS){
        const reminderDate = renewelDate.subtract(daysBefore,'day');
        //'day' is from dayjs package using to subtract day from RenewelDate
        

        if(reminderDate.isAfter(dayjs())){
           //sleep function
           await sleepUntillReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
        }

        if (dayjs().isSame(reminderDate, 'day')) {
            await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
          }
       
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
      return Subscription.findById(subscriptionId).populate('user', 'name email');
    })
  }
  
  const sleepUntillReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
  }
  
  const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
      console.log(`Triggering ${label} reminder`);
  
      await sendReminderEmail({
        to: subscription.user.email,
        type: label,
        subscription,
      })
    })
  }