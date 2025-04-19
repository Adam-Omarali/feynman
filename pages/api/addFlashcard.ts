import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "../../firebase/serverConfig";
import { question } from "@/redux/questions";
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = firebaseAdmin.firestore();

    if (req.method == "POST"){
        const {userId, question, answer, solution, difficulty, lessonId, unitId} = req.body

        if (userId){
            // Create a new flashcard document in Firestore
            const flashcardRef = db.collection('users').doc(userId).collection("questions").doc(unitId);

            const questionId = uuidv4();
            const newFlashcard: question = {
            id: questionId,
              userId: userId,
              lessonId: lessonId,
              history: [],
              difficulty: difficulty,
              question: question,
              answer: answer.length == 0 ? null : answer,
              solution: solution.length == 0 ? null : solution,
              created: true
            };
            //write flashcard
            await flashcardRef.set({
                questions: {
                    [questionId]: newFlashcard
                }
            }, { merge: true });
            // await lessonRef.update({questions: FieldValue.arrayUnion(flashcardRef.id)})
            
            try {
                let ret: question = {
                    id: questionId,
                    userId: userId,
                    lessonId: lessonId,
                    history: [],
                    difficulty: difficulty,
                question: question,
                answer: answer.length == 0 ? null : answer,
                solution: solution.length == 0 ? null : solution,
                created: true
                }
                // Return the new flashcard
                res.status(200).json(ret);
            } catch (error) {
                console.error('Error adding flashcard:', error);
                res.status(500).send('Error adding flashcard');
            }
        }
        else{
            res.status(400).send('Incorrect body, should include course name and user id.')
        }
  
    }
}