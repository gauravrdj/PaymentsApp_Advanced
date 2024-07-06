"use client"

interface p2p{
    fromId:number,
    toId:number,
    amount:number,
    time : Date,
    id:number
}


export default function TransactionCards({details}:any) {
 
    let isReceived = false;
         if(details.id === details.toId){
            isReceived=true;
         }
    return <div className="flex justify-between items-center p-4  text-white rounded-lg mb-4 w-full">
    <div className="flex items-center">
      <div className="p-2 bg-purple-600 rounded-full mr-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {!isReceived ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V2"
            />
          )}
        </svg>
      </div>
      <div>
        <div className="text-lg font-semibold text-purple-600">
          {isReceived ? 'Received from' : 'Paid to'} {isReceived ? details.fromId : details.toId}
        </div>
        <div className="text-sm text-gray-400">{details.time}</div>
      </div>
    </div>
    <div className={`text-lg font-semibold  text-purple-600 ${isReceived ? "text-green-600" : "text-red-600"}`}>
     {isReceived ? "+" : "-"} ₹{details.amount/100}
    </div>
  </div>
}