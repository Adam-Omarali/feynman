import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "../../../firebase/serverConfig";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = firebaseAdmin.firestore();

    if (req.method == "GET"){
        let id = req?.query?.userId as string
        if (id){
            let doc = await db.collection("users").doc(id).get()
            if (doc.exists) {
                return res.status(200).send(doc.data())
            }
            else {
                await db.collection("users").doc(id).set({
                    courses: {},
                    subscription: "free",
                    storageUsed: 0,
                    maxStorage: 20 * 1024 * 1024
                })
                return res.status(200).send({
                    courses: {},
                    subscription: "free",
                    storageUsed: 0,
                    maxStorage: 20 * 1024 * 1024
                })
            }
        } else {
            return res.status(400).send("Missing Id in URL requestion /user/{userId}")
        }
    }
}