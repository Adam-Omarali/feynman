import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../firebase/serverConfig";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = firebaseAdmin.firestore();

    if (req.method == "POST"){
        const { id, type } = req.body
        console.log(id)
        let docRef = db.collection(type).doc(id)
        let doc = await docRef.get()
        if (doc.exists){
            docRef.delete()
            res.send(200)
        }
        else{
            res.status(400).send("Course with specified id does not exist")
        }  
    }
}