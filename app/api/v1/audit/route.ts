import { NextResponse } from "next/server";


export  async function POST(req:Request , res:Response){
    
    //get the reqd response from body
    const {tool , teamSize , plan ,billing ,tasks ,email,company} = await req.json() ;
    //return the data in response and the job-id for now : 
    
    return NextResponse.json({
        message : "audit - created",
        success : true,
        data : {tool , teamSize , plan ,billing ,tasks ,email,company},
        jobId : "123" // static for now 
    },{
        status : 201
    })

}