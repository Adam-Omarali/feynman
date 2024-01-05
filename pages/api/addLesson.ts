import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "../../firebase/serverConfig";
import { FieldValue } from "firebase-admin/firestore";
import { courseObj } from "@/redux/user";

interface addLesson {
    name: string,
    userId: string,
    emoji: string,
    courseId: string,
    unitId: string,
    courseObj: courseObj
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = firebaseAdmin.firestore();

    if (req.method == "POST"){
        const {name, userId, emoji, courseId, unitId, courseObj} : addLesson = JSON.parse(req.body)


        if (name && userId){
            // Create a new course document in Firestore
            const lessonRef = db.collection('lessons').doc();
            const userRef = db.collection('users').doc(userId)
            const newLesson = {
              id: lessonRef.id,
              userId: userId,
              name: name,
              emoji: emoji,
              courseId: courseId,
              unitId: unitId,
              questions: [],
              content: ""
            };
            courseObj[courseId].units[unitId].lessons[lessonRef.id] = {
                name,
                emoji
            }
            await userRef.update({courses: courseObj})
            await lessonRef.set(newLesson);

            const unitRef = db.collection('units').doc(unitId);
            await unitRef.update({lessonOrder: FieldValue.arrayUnion(lessonRef.id)})
          
            // Return the new course data
            res.status(200).json(newLesson);
        }
        else{
            res.status(400).send('Incorrect body, should include course name, user id, emoji, and unit id.')
        }
  
    }
}