import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "@/firebase/serverConfig";
import { courseObj } from "@/redux/user";
import { Unit } from "@/redux/unit";

interface AddUnit {
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
        const {name, userId, emoji, ref, description, courseObj}: AddUnit = JSON.parse(req.body)

        if (name && userId){
            // Create a new course document in Firestore
            const unitRef = db.collection('units').doc();
            const userRef = db.collection('users').doc(userId)
            const newUnit: Unit = {
              id: unitRef.id,
              userId: userId,
              name: name,
              emoji: emoji,
              courseId: ref,
              description: description || "",
              lessonOrder: []
            };

            courseObj[ref].units[unitRef.id] = {
                name,
                emoji,
                lessons: {}
            }

            await userRef.update({courses: courseObj})
            await unitRef.set(newUnit);

            res.status(200).json(newUnit);
        }
        else{
            res.status(400).send('Incorrect body, should include course name and user id.')
        }
    }
}