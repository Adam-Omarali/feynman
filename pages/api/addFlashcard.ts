import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "../../firebase/serverConfig";
import { FieldValue } from "firebase-admin/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = firebaseAdmin.firestore();

    if (req.method == "POST"){
        const {userId, question, answer, solution, difficulty, lessonId, unitId} = req.body

        if (userId){
            // Create a new flashcard document in Firestore
            const flashcardRef = db.collection('users').doc(userId).collection("questions").doc(unitId);

            // const lessonRef = db.collection('lessons').doc(lessonId);
            const newFlashcard = {
              userId: userId,
              lesson: lessonId,
              history: [],
              difficulty: difficulty,
              question: question,
              answer: answer.length == 0 ? null : answer,
              solution: solution.length == 0 ? null : solution,
            };
            //write flashcard
            await flashcardRef.update({questions: FieldValue.arrayUnion(newFlashcard)})
            // await lessonRef.update({questions: FieldValue.arrayUnion(flashcardRef.id)})
          
            let ret = {
                userId: userId,
                lesson: lessonId,
                history: [],
                difficulty: difficulty,
                question: question,
                answer: answer.length == 0 ? null : answer,
                solution: solution.length == 0 ? null : solution,
            }
            // Return the new flashcard
            res.status(200).json(ret);
        }
        else{
            res.status(400).send('Incorrect body, should include course name and user id.')
        }
  
    }
}