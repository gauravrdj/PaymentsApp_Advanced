'use client'
import prisma from "@repo/db/client";
import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransactions";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../../lib/auth";
import { useEffect, useState } from "react";
import TypewriterSpinner from "../../../components/Loader";
import fetchData from "../../lib/actions/fetchData";


// async function getBalance() {
    
//     const session = await getServerSession(authOptions);
//     const balance = await prisma.balance.findFirst({
//         where: {
//             userId: Number(session?.user?.id)
//         }
//     });
//     return {
//         amount: balance?.amount || 0,
//         locked: balance?.locked || 0
//     }
// }
// enum onRampStatus{
//     Success,
//     Failure,
//     Processing
// }

// interface transactionTypes{
//     time:Date,
//     amount:number,
//     status:onRampStatus,
//     provider : string
// }

// async function getOnRampTransactions() {
//     const session = await getServerSession(authOptions);
//     const txns= await prisma.onRampTransaction.findMany({
//         where: {
//             userId: Number(session?.user?.id)
//         }
//     });
//     return txns.map(t => ({
//         time: t.startTime,
//         amount: t.amount,
//         status: t.status,
//         provider: t.provider
//     }))
// }


export default  function() {
    const [loading, setLoading] = useState("false")
    const [data, setData]  = useState({balance : {amount : 0, locked: 0}, transactions:[]})
    // setLoading("true");
   useEffect(()=>{
    setLoading("true")
     fetchData().then((res:any)=>{
        setData(res);
        setLoading("false")
     });
    
   }, [])
    // const balance = await getBalance();
    // const transactions = await getOnRampTransactions();
    
    // setLoading("false");

    // if(loading==="true"){
    //     return (
    //        <TypewriterSpinner></TypewriterSpinner>
    //     )
    // }
   
  if(loading==="true"){
return (
    <TypewriterSpinner></TypewriterSpinner>
)
  }
    return <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            Transfer
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <div>
                <AddMoney />
            </div>
            <div>
                <BalanceCard amount={data.balance.amount} locked={data.balance.locked} />
                <div className="pt-4">
                    <OnRampTransactions transactions={data.transactions} />
                </div>
            </div>
        </div>
    </div>
}