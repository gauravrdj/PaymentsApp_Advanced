"use server"
import db from '@repo/db/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth'

interface response{
    status:number,
    msg:string
}

export async function p2pTransfer(phone:string, money:number){
     const session=await getServerSession(authOptions);

     if(!session?.user){
        const data:response={
            status:403,
            msg: "Unauthenticated!"
        }
        return {
             data
        }
     }
     const fromId=Number(session?.user?.id);
     const sender=await db.user.findUnique({
        where:{
            id: fromId,
        }
    });

    if(!sender){
        const data:response={
            status:403,
            msg: "Sender not found!"
        }
        return {
            data
        }
    }


    //Finding Receipent
    const rec=await db.user.findUnique({
        where:{
            number:phone,
        }
    });
    if(!rec){
        const data:response={
            status:404,
            msg: "Receiver Not Found!"
        }
         return {
           data
         }
    }
    try{
     const res=await db.$transaction(async(transaction)=>{
        //Locking the user row to prevent sequential transfers
        await transaction.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(fromId)} FOR UPDATE`;
        const fromBalance=await transaction.balance.findUnique({
            where:{
                userId:Number(fromId),
            }
        });
//         console.log("Before Sleep")
// await new Promise(r => setTimeout(r, 4000));

        if(!fromBalance || fromBalance.amount < money){
            throw new Error("Insufficient Balance");
        }
        await transaction.balance.update({
            where:{
                userId:fromId,
            },
            data:{
                amount:{
                    decrement: money
                }
            }
        });

        await transaction.balance.update({
            where:{
                userId:Number(rec.id),
            },
            data:{
                amount:{
                    increment: money
                }
            }
        })
        
        await db.p2pTransfer.create({
            data:{
                amount :money,
                timeStamp : new Date(),
                fromUserId :fromId,
                toUserId : Number(rec.id)
            }
        })

const data:response ={
    status: 200,
    msg: "Transferred Successfully",
}
        return {
           data

        }
     })
     return res;
    }
    catch(e){
        const data:response = {
            status:403,
            msg: "Transfer Failed, Please Check Balance"
        }
        return {
            data
        }
    }
    
}