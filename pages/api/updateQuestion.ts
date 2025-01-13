import { NextApiRequest, NextApiResponse } from 'next';
import firebaseAdmin from "@/firebase/serverConfig";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const db = firebaseAdmin.firestore();

  try {
    const { userId, unitId, questions } = req.body;

    // Update the entire questions map for the unit
    await db
      .collection('users')
      .doc(userId)
      .collection('questions')
      .doc(unitId)
      .set({ 
        questions  // This will be the map of questionId: questionData
      }, { merge: true });

    res.status(200).json({ message: 'Questions updated successfully' });
  } catch (error) {
    console.error('Error updating questions:', error);
    res.status(500).json({ message: 'Error updating questions' });
  }
} 