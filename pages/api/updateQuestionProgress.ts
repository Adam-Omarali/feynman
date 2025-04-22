import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "@/firebase/serverConfig";

const MAX_HISTORY_LENGTH = 10;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const db = firebaseAdmin.firestore();

  try {
    const { userId, unitId, questionId, attempt } = req.body;

    const questionRef = db
      .collection('units')
      .doc(unitId)
      .collection('questions')
      .doc(questionId);

    // Get current question to update its history
    const doc = await questionRef.get();
    const question = doc.data();
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Get current history array or initialize if it doesn't exist
    const currentHistory = question.history || [];
    
    // If we're at max history, remove oldest attempt
    if (currentHistory.length >= MAX_HISTORY_LENGTH) {
      currentHistory.shift();
    }

    // Add new attempt
    currentHistory.push(attempt);

    // Update the question with new history
    await questionRef.update({
      history: currentHistory
    });

    res.status(200).json({ message: 'Question history updated successfully' });
  } catch (error) {
    console.error('Error updating question history:', error);
    res.status(500).json({ message: 'Error updating question history' });
  }
} 