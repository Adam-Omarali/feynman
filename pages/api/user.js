import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { UserModel } from "../../models/User";
import { getSession } from "next-auth/react";
import { CourseModel } from "../../models/Course";

export default async function handler(req, res){
    try {

        const session = await getSession({req})

        if (!session) return res.status(403).send("Not logged in")

        if (req.method === "GET"){

            await mongoose.connect(process.env.MONGODB_URL)
            const user = await UserModel.findOne({email: session.user.email})
            if (!user) return res.status(405).send("No account")

            const courses = []
            for (let index = 0; index < user.courses.length; index++) {
                let id = user.courses[index]
                let course = await CourseModel.findById(id)
                courses.push(course)
            }

            const data = {user, courses}

            // const data = {user, courses, units, lessons}

            return res.status(200).json(data)

        }
        
    } catch (error) {
        return res.status(500).json({message: error})
    }
}