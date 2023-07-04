import { NextApiRequest, NextApiResponse } from "next";
import { getMaterial } from "../../../firebase/getMaterial";
import { firebaseAdmin } from "../../../firebase/serverConfig";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = firebaseAdmin.firestore();

    if (req.method == "GET"){
        let id = req?.query?.id as string
        if (id){
            await getMaterial("lessons", id, res, db)     
        }
    }
    if(req.method == "PUT"){
        let id = req?.query?.id as string
        if (id){
            let doc = db.collection("lessons").doc(id)
            await doc.update({content: req.body.content})
            res.status(200).send("updated!")
        } else{
            res.status(400).send("Lesson with specified id does not exist")
        }
    }
}