"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import { createOnRampTransaction } from "../app/lib/actions/createOnRampTransaction";
import { useSession } from "next-auth/react";
import axios from 'axios'
import { getToken } from "next-auth/jwt";
import {v4} from 'uuid'
import bankServer from "../app/lib/actions/bankServer";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


const SUPPORTED_BANKS = [{
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com"
}, {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/"
}];

type UserType = {
    id: string;
    number: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  
export const AddMoney =() => {
    const session=useSession();
    const router=useRouter()
    const res=session.data?.user as UserType | undefined;

    
    //   const s=JSON.stringify(session.data)
    // console.log(s);
 
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
    const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");
    const [value, setValue] = useState(0)
    return <Card title="Add Money">
    <div className="w-full">
        <TextInput label={"Amount"} placeholder={"Amount"} onChange={(val) => {
            setValue(Number(val))
        }} />
        <div className="py-4 text-left">
            Bank
        </div>
        <Select onSelect={(value) => {
            setRedirectUrl(SUPPORTED_BANKS.find(x => x.name === value)?.redirectUrl || "");
            setProvider(SUPPORTED_BANKS.find(x => x.name === value)?.name || "");
        }} options={SUPPORTED_BANKS.map(x => ({
            key: x.name,
            value: x.name
        }))} />
        <div className="flex justify-center pt-4">
            <Button onClick={async () => {
                const token=v4();
                
                  
            //   const token=(Math.random()*100).toString();
                const res1 = await createOnRampTransaction(provider, value, token, Number(res?.id))

                const props = {
                    token, 
                    id : Number(res?.id),
                    amount:value
                }
                 await new Promise(res=> setTimeout(res, 5000))
                Swal.fire({
                    title: "Are you sure?",
                    text: "Please do not refresh or close the window!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, Add money"
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                        const res2  = await bankServer(props);
               
                        if(res2.data.status===200){
                            toast.success('Money added to wallet successfully!');
                         Swal.fire({
                            title : "Adding money to wallet",
                            text : "Money added to wallet successfully!",
                            icon : "success"
                         })
                        }
                        else{
                            toast.error(`${res2.data?.msg}`)
                            Swal.fire({
                                title : "Adding money to wallet",
                                text : `${res2.data.msg}`,
                                icon : "error"
                             })
                        }
                    }
                  });
                // const res2  = await bankServer(props);
               
                // if(res2.data.status===200){
                //     toast.success('Money added to wallet successfully!');
                //  Swal.fire({
                //     title : "Adding money to wallet",
                //     text : "Money added to wallet successfully!",
                //     icon : "success"
                //  })
                // }
                // else{
                //     toast.error(`${res2.data?.msg}`)
                //     Swal.fire({
                //         title : "Adding money to wallet",
                //         text : `${res2.data.msg}`,
                //         icon : "error"
                //      })
                // }
                
                   
            }}>
            Add Money
            </Button>
        </div>
    </div>
</Card>
}