import NextAuth from "next-auth/next"
import  CredentialsProvider  from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import db from "@repo/db/client"
import bcrypt from 'bcrypt'


interface CredentialTypes{
    phone:string,
    password:string,

}
interface sessionProps{
    token:any,
    session:any
}

export const authOptions = {
providers:[
    CredentialsProvider({
        name: "Credentials",
        credentials:{
            phone : {label:"Phone", placeholder:"1234567890", type:"text", required : true},
            password : {label:"password", placeholder:"Minimum 8 Characters", type:"password", required :true}
        },
        
        async authorize(credentials:CredentialTypes | any){
             //Database validation goes here
             console.log(credentials);
             const hashedPassword=await bcrypt.hash(credentials.password, 10);
             const exist=await db.user.findFirst({
                where:{
                    number : credentials.phone,
                }
             })
              
            if(exist){
                const verified=await bcrypt.compare(credentials.password, exist.password);
               
                if(verified){
                   return{
                    id : exist.id.toString(),
                    // name: exist.name,
                    number : exist.number
                   }
                }
                //if not verified
                return null;
            }
                try{
                    const created=await db.user.create({
                        data:{
                       number : credentials.phone,
                       password : hashedPassword,
                        }
                    })
                       await db.balance.create({
                        data:{
                            userId : created.id,
                            amount : 0,
                            locked : 0
                        }
                       })



                    return {
                        id : created.id.toString(),
                        // name:created.name,
                        number:created.number,
                    }
    
                }
                catch(e){
                    console.log(e);
                }
                 return null;

        },
    }),
    
],
secret : process.env.JWT_SECRET || "secret",

callbacks:{
    // async jwt({token, exist, created}:any){
    //    if(exist){
    //     token.number=exist.number
    //    }
    //    else{
    //     token.number=created.number
    //    }
    //    return token
    // },
    // async session({session, token}:sessionProps) {
    //     // console.log(token)
    //     session.user.id=token.sub
    //     // session.user.number=token.number
    //     // session.user.token=token
    //     return session;
    // }
    async jwt({ token, user }: any) {
        // console.log(user)
        if (user) {
          token.id = user.id;
          token.number = user.number;
        }
        return token;
      },
      async session({ session, token }: sessionProps) {
        if (token) {
          session.user.id = token.sub;
          session.user.number = token.number;
          session.token = token;
        }
        // console.log(session)
        return session;
      },
},
pages:{
    signIn:'/signin'
}
}