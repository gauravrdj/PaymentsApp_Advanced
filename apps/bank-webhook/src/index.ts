import express from 'express';
import db from '@repo/db/client'
const app=express();

app.use(express.json());
app.post('/hdfcWebhook', async (req, res)=>{
//add Zod Validation here

// console.log(req.body);

const paymentInformation:{
    token:string,
    userId:number,
    amount:number
} = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount
};

//Detecting whether the onRampStatus is Processing or not

const check=await db.onRampTransaction.findFirst({
    where:{
        token: req.body.token,
    }
});

  if(check?.status!="Processing"){
     return res.status(411).json({
        msg: "Invalid Request",
        status: 411
     })
  }



try{
  await db.$transaction([
     db.balance.updateMany({
        where:{
            userId:paymentInformation.userId
        },
        data:{
            amount:{
    
            increment: paymentInformation.amount,
    
            }
        }
       }),
        db.onRampTransaction.updateMany({
         where:{
            token:paymentInformation.token
        },
         data:{
            status: "Success"
        }
      })
]);

return res.status(200).json({
    msg: "Captured",
    status:200,
})
}
catch(e){
    console.log(e);
    res.status(411).json({
        msg: "Error while processing webhook",
        status:411

    })
}

});

app.listen(3002, ()=>{
    console.log("Webhook server started")
})
