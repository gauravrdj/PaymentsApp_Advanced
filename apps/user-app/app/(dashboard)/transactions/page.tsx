import db from '@repo/db/client'
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import TransactionCards from '../../../components/TransactionCard';
import { Button } from '@repo/ui/button';

async function getTransaction(id:number){
   const res = await db.p2pTransfer.findMany({
    where:{
        OR:[
            {
                fromUserId : id,
            },
            {
                toUserId: id
            }
        ]
    }
   });
return res.map(t => ({
      fromId : Number(t.fromUserId),
      toId : Number(t.toUserId),
      amount:t.amount,
      time: t.timeStamp.toISOString(),
      id:id
})) 
}
export default async function TransactionCard() {
    
   const session = await getServerSession(authOptions);
   const transactions = await getTransaction(Number(session?.user?.id))
   transactions.reverse()
   console.log(transactions)
    return (
        <div className='justify-between w-full m-28'>
        {transactions.map(ele=> <TransactionCards details = {ele}></TransactionCards>)}
        </div>
    )
}