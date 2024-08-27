import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "../../../../firebase/serverConfig";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = firebaseAdmin.firestore();

    if (req.method == "GET"){
        let userId = req?.query?.userId as string
        let unitId = req?.query?.unitId as string

        if (userId && unitId){
            let doc = await db.collection("users").doc(userId).collection("questions").doc(unitId).get()
            if (doc.exists){
                res.status(200).send(doc.data())
            }
            else{
                res.status(400).send("User with id doesn't exist or unitId doesn't exist under user")
            }  
        } else{
            res.status(400).send("requires {userId}/{unitId}")
        }

    }
}