import { getSession, useSession, signIn } from "next-auth/react";

export default function SignIn(){

    // const { data: session, status } = useSession()

    // if(session){
    //     return(
    //         <p>Success {session.user.name}</p>
    //     )
    // }
    // else{
    //     return (
    //         <button onClick={() => signIn("google")}>Sign In</button>
    //     )
    // }
    return(
        <button onClick={() => signIn("google")}>Sign In</button>
    )

}

export async function getServerSideProps(context){

    const session = await getSession(context)

    if (!session) return {props: {}}

    return {redirect: {permanent: false, destination: "/"}}

}