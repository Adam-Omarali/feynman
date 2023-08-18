import { storage } from "@/firebase/clientConfig";
import { ref, uploadBytes } from "@firebase/storage";
import { format } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '20mb' // Set desired value here
        }
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    if (req.method === "POST"){
        const uid = req?.query?.id as string
        const file = req.body as File

        const formattedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'");
        const imgRef = ref(storage, `${uid}/${file.name + formattedDate}.jpg`)

        uploadBytes(imgRef, file).then((snapshot) => {
            console.log(snapshot)
        })
        res.status(200).send({})
    }
}