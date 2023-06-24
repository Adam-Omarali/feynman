import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../firebase/serverConfig";

interface DeleteRequestBody {
    id: string;
    type: string;
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = firebaseAdmin.firestore();

    if (req.method == "DELETE"){
        console.log(JSON.parse(req.body))
        res.send(200)
        // const { id, type }: DeleteRequestBody = req.body
        // let docRef = db.collection(type).doc(id)
        // let doc = await docRef.get()
        // if (doc.exists){
        //     docRef.delete()
        //     res.send(200)
        // }
        // else{
        //     res.status(400).send("Course with specified id does not exist")
        // }  
    }
}