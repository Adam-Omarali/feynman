import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "../../firebase/serverConfig";
import { FieldValue } from "firebase-admin/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = firebaseAdmin.firestore();

    if (req.method == "POST"){
        const {userId, question, answer, solution, difficulty, lessonId} = req.body

        if (userId){
            // Create a new flashcard document in Firestore
            const flashcardRef = db.collection('questions').doc();
            const lessonRef = db.collection('lessons').doc(lessonId);
            const newFlashcard = {
              id: flashcardRef.id,
              userId: userId,
              question: question,
              answer: answer.length == 0 ? null : answer,
              solution: solution.length == 0 ? null : solution,
              difficulty: difficulty,
              lesson: lessonId,
              history: []
            };
            await flashcardRef.set(newFlashcard);
            await lessonRef.update({questions: FieldValue.arrayUnion(flashcardRef.id)})
          
            // Return the new flashcard
            res.status(200).json(newFlashcard);
        }
        else{
            res.status(400).send('Incorrect body, should include course name and user id.')
        }
  
    }
}