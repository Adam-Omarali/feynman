import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "../../../firebase/serverConfig";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = firebaseAdmin.firestore();

    if (req.method == "GET"){
        let contentId = req?.query?.contentId as string
        if (contentId){
            let doc = await db.collection("question_content").doc(contentId).get()
            if (doc.exists) {
                return res.status(200).send(doc.data())
            }
            else {
                return res.status(400).send("Question Content with specefied Id DNE")
            }
        } else {
            return res.status(400).send("Missing Id in URL requestion /question/{contentId}")
        }
    }
}