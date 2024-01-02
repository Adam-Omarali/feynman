import { NextApiResponse } from "next"
import firebaseAdmin from "./serverConfig"

/**
Retrieves material data of a specified type and ID from a Firestore database and sends it as a response
to the client through the provided NextApiResponse object.
@async
@param {string} type - The type of material to retrieve (e.g. "course", "unit", "lesson").
@param {string} id - The unique ID of the material to retrieve.
@param {NextApiResponse} res - The Next.js API response object used to send the material data to the client.
@param {firebaseAdmin.firestore.Firestore} db - The Firestore database instance to retrieve the material data from.
@returns {Promise<void>} A promise that resolves when the material data has been sent to the client or rejects with an error if there was a problem retrieving the data.
*/

export async function getMaterial(type:string, id:string, res: NextApiResponse, db:firebaseAdmin.firestore.Firestore){
    let doc = await db.collection(type).doc(id).get()
    if (doc.exists){
        res.status(200).send(doc.data())
    }
    else{
        res.status(400).send("Course with specified id does not exist")
    }
}