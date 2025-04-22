import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "@/firebase/serverConfig";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = firebaseAdmin.firestore();

    if (req.method === "DELETE") {
        const { unitId } = req.query;

        if (!unitId || typeof unitId !== 'string') {
            return res.status(400).json({ error: 'Unit ID is required' });
        }

        try {
            // Get a reference to the unit's questions subcollection
            const questionsRef = db
                .collection('units')
                .doc(unitId)
                .collection('questions');

            // Get all questions in the subcollection
            const questionsSnapshot = await questionsRef.get();

            // Delete each question document
            const deletePromises = questionsSnapshot.docs.map(doc => doc.ref.delete());

            // Wait for all question deletions to complete
            await Promise.all(deletePromises);

            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error deleting unit questions:', error);
            res.status(500).json({ error: 'Failed to delete unit questions' });
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
} 