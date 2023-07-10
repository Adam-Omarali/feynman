import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../firebase/serverConfig";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = firebaseAdmin.firestore();

    if (req.method == "POST"){
        const {name, userId, emoji, description} = JSON.parse(req.body)


        if (name && userId){
            // Create a new course document in Firestore
            const courseRef = db.collection('courses').doc();
            const newCourse = {
              id: courseRef.id,
              userId: userId,
              name: name,
              emoji: emoji,
              units: {},
              description: description ? description : "",
              unitOrder: []
            };
            await courseRef.set(newCourse);
          
            // Return the new course data
            res.status(200).json(newCourse);
        }
        else{
            res.status(400).send('Incorrect body, should include course name and user id.')
        }
  
    }
}