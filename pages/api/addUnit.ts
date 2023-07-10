import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../firebase/serverConfig";
import { FieldValue } from "firebase-admin/firestore";
import { store } from "@/redux/store";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = firebaseAdmin.firestore();

    if (req.method == "POST"){
        const {name, userId, emoji, ref, description} = JSON.parse(req.body)


        if (name && userId){
            // Create a new course document in Firestore
            const unitRef = db.collection('units').doc();
            const newUnit = {
              id: unitRef.id,
              userId: userId,
              name: name,
              emoji: emoji,
              courseId: ref,
              lessons: {},
              description: description ? description : "",
              lessonOrder: []
            };

            await unitRef.set(newUnit);

            const courseRef = db.collection('courses').doc(ref);
            await courseRef.update({unitOrder: FieldValue.arrayUnion(unitRef.id)})
          
            // Return the new course data
            res.status(200).json(newUnit);
        }
        else{
            res.status(400).send('Incorrect body, should include course name and user id.')
        }
  
    }
}