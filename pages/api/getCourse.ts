import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../firebase/serverConfig";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = firebaseAdmin.firestore();

    if (req.method == "POST"){
        let { id } = JSON.parse(req.body)
        id = id[0]

        let doc = await db.collection("questions").doc(id).get()
        if (doc.exists){
            res.status(200).send(doc.data())
        }
        else{
            res.status(400).send("Course with specified id does not exist")
        }  
    }
}