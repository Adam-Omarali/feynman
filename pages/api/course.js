import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { CourseModel } from "../../models/Course";
import { UserModel } from "../../models/User";

export default async function handler(req, res){
    try {

        console.log(req.method)
        if (req.method === "POST"){

            if(!req.body) return res.status(400).send("Missing body")
            await mongoose.connect(process.env.MONGODB_URL)
            const course = await CourseModel.create({ userId: req.body.userId, name: req.body.name, units: req.body.units })

            const user = await UserModel.findById(req.body.userId)
            user.courses = [...user.courses, course._id]
            await user.save()

            return res.status(200).json(course)

        }

        else if (req.method === "PUT"){
            if(!req.body) return res.status(400).send("Missing body")
            await mongoose.connect(process.env.MONGODB_URL)
            const course = await CourseModel.findById(req.body.courseId)

            if(!course) return res.status(400).send("Course Id does not exist")

            course.name = req.body.name
            await course.save()

            res.status.send(200)

        }
        
    } catch (error) {
        return res.status(500).json({message: error})
    }
}