import { prisma } from "@/lib/prisma";
import { auditQueue, connection } from "@/lib/queue";
import { NextResponse } from "next/server";


export  async function POST(req:Request){
try {
        
        // 1. Get Client IP for Rate Limiting
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        const rateLimitKey = `rl:audit:${ip}`;
        
        // 2. Get the reqd response from body
        const {tool , teamSize , plan ,billing ,actualBilling, planPricing, tasks ,email,company, role, _hp} = await req.json() ;

        // 3. Honeypot check (Bots fill hidden fields)
        if (_hp) {
            console.warn(`Honeypot triggered by IP: ${ip}`);
            return NextResponse.json({ message: "Request blocked" }, { status: 400 });
        }

        // 4. Rate Limiting (5 requests per hour)
        const requestCount = await connection.incr(rateLimitKey);
        if (requestCount === 1) {
            await connection.expire(rateLimitKey, 3600); // 1 hour window
        }
        if (requestCount > 7) {
            return NextResponse.json({ 
                message: "Too many audits. Please try again in an hour.", 
                success: false 
            }, { status: 429 });
        }
        console.log(tool , teamSize , plan ,billing ,actualBilling, planPricing, tasks ,email,company, role)
        
        console.log("DB upload started ...")
        //saving the inital data in the DB and getting the ID ... 
        const audit =  await prisma.audit.create({
            data: {
                input_tool:tool,
                input_team_size:teamSize,
                input_plan:plan,
                input_billing:billing,
                input_actual_billing: actualBilling,
                input_plan_pricing: planPricing,
                input_tasks:tasks,
                input_email:email,
                input_company:company,
                input_role:role,
                status:"pending"
            }
        })

        console.log("DB upload done and now adding to queue ....")
    
        //send the data to the queue ... 
        await auditQueue.add("process-audit" ,{
            auditId: audit.id
        }) ;
        
        console.log("added to queue")
        //return the job-id ...
        
        return NextResponse.json({
            message : "audit - created",
            success : true,
            jobId : audit?.id, 
            status:audit?.status
        },{
            status : 201
        })
} catch (error) {
    return NextResponse.json({
        message : "internal server error",
        success : false,
        error : error || "unknown error"
    },{
        status : 500
    })
}

}