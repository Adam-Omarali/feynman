import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../firebase/serverConfig";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = firebaseAdmin.firestore();

    if (req.method == "POST"){
        const {userId, question, answer, difficulty, lesson} = JSON.parse(req.body)


        if (userId){
            // Create a new course document in Firestore
            const flashcardRef = db.collection('flashcourses').doc();
            const newFlashcard = {
              id: flashcardRef.id,
              userId: userId,
              question: question,
              answer: answer,
              difficulty: difficulty,
              lesson: lesson
            };
            await flashcardRef.set(newFlashcard);
          
            // Return the new course data
            res.status(200).json(newFlashcard);
        }
        else{
            res.status(400).send('Incorrect body, should include course name and user id.')
        }
  
    }
}