import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "@/firebase/serverConfig";
import { Question } from "@/redux/questions";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = firebaseAdmin.firestore();

    if (req.method == "POST"){
        const {userId, question: questionText, answer, solution, difficulty, lessonId, unitId} = req.body

        if (userId){
            try {
                // Create a new question document in the units collection
                const questionRef = db
                    .collection('units')
                    .doc(unitId)
                    .collection('questions')
                    .doc();
                
                const questionId = questionRef.id;

                const newQuestion: Question = {
                    id: questionId,
                    userId: userId,
                    unitId: unitId,
                    lessonId: lessonId,
                    difficulty: difficulty,
                    question: questionText,
                    answer: answer.length == 0 ? null : answer,
                    solution: solution.length == 0 ? null : solution,
                    history: []
                };

                await questionRef.set(newQuestion);

                res.status(200).json(newQuestion);
            } catch (error) {
                console.error('Error adding flashcard:', error);
                res.status(500).send('Error adding flashcard');
            }
        }
        else{
            res.status(400).send('Incorrect body, should include user id.')
        }
    }
}