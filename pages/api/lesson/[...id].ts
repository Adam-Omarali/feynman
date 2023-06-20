import { NextApiRequest, NextApiResponse } from "next";
import { getMaterial } from "../../../firebase/getMaterial";
import { firebaseAdmin } from "../../../firebase/serverConfig";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const db = firebaseAdmin.firestore();

    if (req.method == "GET"){
        let id = req?.query?.id
        if (id){
            id = id[0]
            await getMaterial("lessons", id, res, db)     
        }
    }
}