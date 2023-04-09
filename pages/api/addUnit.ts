import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../firebase/serverConfig";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = firebaseAdmin.firestore();

    if (req.method == "POST"){
        const {name, userId, emoji, ref} = JSON.parse(req.body)


        if (name && userId){
            // Create a new course document in Firestore
            const unitRef = db.collection('units').doc();
            const newUnit = {
              id: unitRef.id,
              userId: userId,
              name: name,
              emoji: emoji,
              courseId: ref,
              questions: {},
              lastTest: {}
            };

            console.log(newUnit)
            await unitRef.set(newUnit);
          
            // Return the new course data
            res.status(200).json(newUnit);
        }
        else{
            res.status(400).send('Incorrect body, should include course name and user id.')
        }
  
    }
}