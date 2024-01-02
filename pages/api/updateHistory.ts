import { NextApiRequest, NextApiResponse } from "next";
import { FieldValue } from "firebase-admin/firestore";
import firebaseAdmin from "@/firebase/serverConfig";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = firebaseAdmin.firestore();

    if (req.method == "PUT"){
        const {qId, confidence, attempts, correct, date} = req.body

        if (qId){
            // Create a new flashcard document in Firestore
            const flashcardRef = db.collection('questions').doc(qId);

            let obj = {confidence, attempts, correct, date}

            await flashcardRef.update({history: FieldValue.arrayUnion(obj)})
          
            // Return the new flashcard
            res.status(200).json({});
        }
        else{
            res.status(400).send('Incorrect body, should include questionId, confidence, attemps and correct')
        }
  
    }
}