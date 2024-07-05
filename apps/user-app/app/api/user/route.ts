
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../lib/auth";


export async function GET(){
    const session=await getServerSession(authOptions);
    try{
        if(session.user){
            return NextResponse.json({
                user:session,
            })
        }
    }
    catch(e){
       return NextResponse.json({
        msg: "You are not logged in",
        status: 403,
       })
    }
}