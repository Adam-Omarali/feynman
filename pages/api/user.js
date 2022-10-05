import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { UserModel } from "../../models/User";
import { getSession } from "next-auth/react";
import { CourseModel } from "../../models/Course";
import { UnitModel } from "../../models/Unit";

export default async function handler(req, res){
    try {

        const session = await getSession({req})

        if (!session) return res.status(403).send("Not logged in")

        if (req.method === "GET"){

            await mongoose.connect(process.env.MONGODB_URL)
            const user = await UserModel.findOne({email: session.user.email})
            if (!user) return res.status(405).send("No account")
            const courses = await CourseModel.find({userId: user._id})
            // let units = []
            // for (const course in courses) {
            //     for (const unitId in course.units) {
            //         units = getMaterials(units, UnitModel)
            //     }
            // }
            const data = {user, courses}

            // const data = {user, courses, units, lessons, tests}

            return res.status(200).json(data)

        }
        
    } catch (error) {
        return res.status(500).json({message: error})
    }
}

async function getMaterials(arr, model){
    let newArr = []
    for (let index = 0; index < arr.length; index++) {
        let id = arr[index]
        let material = await model.findById(id)
        if(material != null) newArr.push(material)
    }
    return newArr
}