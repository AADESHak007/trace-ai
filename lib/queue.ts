import { Queue } from "bullmq";
import {Redis} from "ioredis"



//shared redis instance ..
const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379',{
    maxRetriesPerRequest : null ,
}) ;

//defining the queue ... 

export const auditQueue = new Queue("audit-queue" , {
    connection ,
    defaultJobOptions : {
        attempts : 3 ,
        backoff : {
            type :"exponential",
            delay : 1000
        },
        removeOnComplete :true ,
        removeOnFail :false ,
    }
})

export {connection} ;