import { app, auth } from "@/firebase/clientConfig";
import { getAuth } from "firebase/auth";
import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "../../firebase/serverConfig";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const auth = getAuth(app);

    // Check if user is authenticated
    const user = auth.currentUser;
    res.send(app)
}