import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "../../firebase/serverConfig";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = firebaseAdmin.firestore();

    if (req.method == "POST"){
        const {name, userId, emoji, description, courseObj} = JSON.parse(req.body)


        if (name && userId){
            // Create a new course document in Firestore
            const courseRef = db.collection('courses').doc();
            const userRef = db.collection('users').doc(userId)
            const newCourse = {
              id: courseRef.id,
              userId: userId,
              name: name,
              emoji: emoji,
              units: {},
              description: description ? description : "",
              unitOrder: []
            };
            courseObj[courseRef.id] = {
                name: name,
                emoji: emoji,
                units: {}
            }
            await userRef.update({courses: courseObj})
            await courseRef.set(newCourse);
          
            // Return the new course data
            res.status(200).json(newCourse);
        }
        else{
            res.status(400).send('Incorrect body, should include course name and user id.')
        }
  
    }
}