import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "../../firebase/serverConfig";
import { FieldValue } from "firebase-admin/firestore";
import { store } from "@/redux/store";
import { courseObj } from "@/redux/user";
import { unit } from "@/redux/unit";

interface addUnit {
    name: string,
    userId: string,
    emoji: string,
    ref: string,
    description: string,
    courseObj: courseObj
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = firebaseAdmin.firestore();

    if (req.method == "POST"){
        const {name, userId, emoji, ref, description, courseObj}: addUnit = JSON.parse(req.body)


        if (name && userId){
            // Create a new course document in Firestore
            const unitRef = db.collection('units').doc();
            const userRef = db.collection('users').doc(userId)
            const questionRef = userRef.collection("questions").doc(unitRef.id)
            const newUnit: unit = {
              id: unitRef.id,
              userId: userId,
              name: name,
              emoji: emoji,
              courseId: ref,
              description: description ? description : "",
              lessonOrder: []
            };

            courseObj[ref].units[unitRef.id] = {
                name,
                emoji,
                lessons: {}
            }

            await userRef.update({courses: courseObj})
            await questionRef.set({questions: []})
            await unitRef.set(newUnit);

            // const courseRef = db.collection('courses').doc(ref);
            // await courseRef.update({unitOrder: FieldValue.arrayUnion(unitRef.id)})
          
            // Return the new course data
            res.status(200).json(newUnit);
        }
        else{
            res.status(400).send('Incorrect body, should include course name and user id.')
        }
  
    }
}