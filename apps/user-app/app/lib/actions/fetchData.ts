'use server'
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from '@repo/db/client'

async function getBalance() {
    
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

async function getOnRampTransactions() {
    const session = await getServerSession(authOptions);
    const txns= await prisma.onRampTransaction.findMany({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return txns.map(t => ({
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }))
}

export default async function fetchData(){
    const balance = await getBalance();
    const transactions = await getOnRampTransactions();
    return {balance, transactions}
}
