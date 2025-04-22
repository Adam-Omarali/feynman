import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "@/firebase/serverConfig";
import { Question } from "@/redux/questions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const db = firebaseAdmin.firestore();
  const { userId, unitId } = req.query;

  if (!userId || !unitId) {
    return res.status(400).json({ message: 'Missing userId or unitId' });
  }

  try {
    const questionsSnapshot = await db
      .collection('units')
      .doc(unitId as string)
      .collection('questions')
      .get();

    const questions: { [key: string]: Question } = {};
    
    questionsSnapshot.forEach(doc => {
      const data = doc.data();
      questions[doc.id] = {
        id: doc.id,
        userId: data.userId,
        unitId: data.unitId,
        lessonId: data.lessonId,
        difficulty: data.difficulty,
        question: data.question,
        answer: data.answer,
        solution: data.solution,
        history: data.history
      };
    });

    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
} 