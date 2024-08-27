import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "../../firebase/serverConfig";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = firebaseAdmin.firestore();

    if (req.method == "POST"){
        const { userId, unitId } = req.body
        let docRef = db.collection("users").doc(userId).collection("questions").doc(unitId)
        let doc = await docRef.get()
        if (doc.exists){
            let question = doc.data()
            //delete question_content if the user created it
            if (question && question.created){
                let questionContentRef = db.collection("question_content").doc(question.content)
                await questionContentRef.delete()
            }
            await docRef.delete()
            res.send(200)
        }
        else{
            res.status(400).send(`user doesn't contain question collection with specified unitId`)
        }  
    }
    else{
        res.status(400).send("HTTP method is not applicable, must be POST")
    }
}