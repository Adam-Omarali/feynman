import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "@/firebase/serverConfig";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    const db = firebaseAdmin.firestore();
    const userRef = db.collection("users").doc(userId);
    
    // Check if subscription exists
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    if (!userData?.subscription) {
      await userRef.update({
        subscription: "free",
        maxStorage: 20 * 1024 * 1024,
        storageUsed: 0
      });
    }

    return res.status(200).json({ 
      subscription: userData?.subscription || "free"
    });
  } catch (error) {
    console.error("Error setting default subscription:", error);
    return res.status(500).json({ message: "Error setting default subscription" });
  }
} 