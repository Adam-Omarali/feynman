import { storage } from "@/firebase/clientConfig";
import { ref } from "@firebase/storage";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    if (req.method === "POST"){
        const {file, uid} = req.body
    }
    const storageRef = ref(storage)
    const userRef = ref(storage)
}