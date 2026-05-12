import { prisma } from "@/lib/prisma";
import { auditQueue } from "@/lib/queue";
import { NextResponse } from "next/server";


export  async function POST(req:Request){
try {
        
        //get the reqd response from body
        const {tool , teamSize , plan ,billing ,tasks ,email,company} = await req.json() ;
        console.log(tool , teamSize , plan ,billing ,tasks ,email,company)
        
        console.log("DB upload started ...")
        //saving the inital data in the DB and getting the ID ... 
        const audit =  await prisma.audit.create({
            data: {
                input_tool:tool,
                input_team_size:teamSize,
                input_plan:plan,
                input_billing:billing,
                input_tasks:tasks,
                input_email:email,
                input_company:company,
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