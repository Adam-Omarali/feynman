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
            let courses = await CourseModel.find({userId: user._id})
            let units = {}
            for (const index in courses) {
                let id = courses[index]._id
                units[id] = await UnitModel.find({courseId: courses[index]._id})
            }

            const data = {user, courses, units}

            // const data = {user, courses, units, lessons, tests}

            return res.status(200).json(data)

        }
        
    } catch (error) {
        return res.status(500).json({message: error})
    }
}