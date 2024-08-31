'use server'
import axios from 'axios'
interface bankTypes{
    token:string,
    id : number | undefined,
    amount : number
}

export default async function bankServer(props : bankTypes){
        const res = await axios.post('https://webhook-latest.onrender.com/hdfcWebhook', {
            token:props.token,
            amount : props.amount*100,
            userId : props.id
        })
        return res;
}