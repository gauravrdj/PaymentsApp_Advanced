"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Swal from 'sweetalert2'

export function SendCard() {
    const router=useRouter();
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading]=useState(false);
    // const [loading, setLoading]=useState(false);

    return <div className="h-[90vh]">
        <Center>
            <Card title="Send">
                <div className="min-w-72 pt-2">
                    <TextInput placeholder={"Number"} label="Number" onChange={(value) => {
                        setNumber(value)
                    }} />
                    <TextInput placeholder={"Amount"} label="Amount" onChange={(value) => {
                        setAmount(value)
                    }} />
                    <div className="pt-4 flex justify-center">
                        {!loading ? <Button onClick={async() => {
                           //Add logic here
                           setLoading(true);
                          const res=await p2pTransfer(number, Number(amount)*100);
                        //   console.log(res.data?.msg);
                          if(res.data?.status===200){
                            toast.success(`${res.data?.msg}`)
                               Swal.fire({
                            title: "P2P Transfer",
                            text : `${res.data?.msg}`,
                            icon : "success"
                           })
                          }
                          else{
                            toast.error(`${res.data?.msg}`)
                            Swal.fire({
                                title: "Oops...",
                                text: `${res.data?.msg}`,
                                icon : 'error'
                            })
                          }
                        //    toast.info(`${res.data.}`)
                        //    Swal.fire({
                        //     title: "P2P Transfer",
                        //     text : `${res.msg}`,
                        //     icon : "success"
                        //    })
                        setLoading(false);
                          router.push('/transfer')
                        }}>Send</Button> : <button type="button" className="text-white bg-gray-800 hover:bg-gray-900  focus:ring-gray-300 font-medium text-sm px-5 py-2.5  transition ease-in duration-200 text-center  shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg max-w-md cursor-wait">
                        <svg width="20" height="20" fill="currentColor" className="mr-2 animate-spin" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                            <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z">
                            </path>
                        </svg>
                        loading
                    </button>}
                    </div>
                </div>
            </Card>
        </Center>
    </div>
}