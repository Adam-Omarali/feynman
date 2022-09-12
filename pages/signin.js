import { getSession, useSession, signIn } from "next-auth/react";

export default function SignIn(){

    // const { data: session, status } = useSession()
    
    return(
        <button onClick={() => signIn("google")}>Sign In</button>
    )

}

export async function getServerSideProps(context){

    const session = await getSession(context)

    if (!session) return {props: {}}

    return {redirect: {permanent: false, destination: "/"}}

}