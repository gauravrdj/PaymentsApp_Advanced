"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import axios from 'axios'

export async function createOnRampTransaction(provider: string, amount: number, token:string, id:number) {
    // Ideally the token should come from the banking provider (hdfc/axis)
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user?.id) {
        return {
            message: "Unauthenticated request",
            status: 403
        }
    }
    // const token = (Math.random()*100).toString();
     
    await prisma.onRampTransaction.create({
        data: {
            provider,
            status: "Processing",
            startTime: new Date(),
            token: token,
            userId: Number(session?.user?.id),
            amount: amount * 100
        }
    });

    return {
        message: "Done",
        status : 200
    }

    // const res = await axios.post('http://localhost:3002/hdfcWebhook', {
    //     token:token,
    //     amount : amount*100,
    //     userId :id
    // })


    // return res;

}





