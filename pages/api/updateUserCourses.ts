import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "@/firebase/serverConfig";
import { courseObj } from "@/redux/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = firebaseAdmin.firestore();

    if (req.method == "POST"){
        console.log("running")
        const { courseObj, userId }: {courseObj: courseObj, userId: string} = req.body
        let docRef = db.collection("users").doc(userId)
        await docRef.update({courses: courseObj})
        res.status(200).send({})
    }
    else{
        res.status(400).send("HTTP method is not applicable")
    }
}