import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "@/firebase/serverConfig";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { userId, bytes } = req.body;

    if (!userId || bytes === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const db = firebaseAdmin.firestore();
    const userRef = db.collection("users").doc(userId);
    
    await userRef.update({
      storageUsed: firebaseAdmin.firestore.FieldValue.increment(bytes)
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating storage usage:", error);
    return res.status(500).json({ message: "Error updating storage usage" });
  }
} 