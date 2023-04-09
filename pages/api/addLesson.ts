import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../firebase/serverConfig";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = firebaseAdmin.firestore();

    if (req.method == "POST"){
        const {name, userId, emoji, courseId, unitId} = JSON.parse(req.body)


        if (name && userId){
            // Create a new course document in Firestore
            const lessonRef = db.collection('lessons').doc();
            const newLesson = {
              id: lessonRef.id,
              userId: userId,
              name: name,
              emoji: emoji,
              courseId: courseId,
              unitId: unitId,
              lastQuiz: {},
              content: []
            };
            await lessonRef.set(newLesson);
          
            // Return the new course data
            res.status(200).json(newLesson);
        }
        else{
            res.status(400).send('Incorrect body, should include course name, user id, emoji, and unit id.')
        }
  
    }
}