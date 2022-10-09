import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { CourseModel } from "../../models/Course";
import { UserModel } from "../../models/User";
import { getSession } from "next-auth/react";
import { UnitModel } from "../../models/Unit";

export default async function handler(req, res){
    try {

        const session = await getSession({req})

        if (req.method === "POST"){

            console.log(1)

            if(!req.body) return res.status(400).send("Missing body")
            await mongoose.connect(process.env.MONGODB_URL)
            const course = await CourseModel.create({ userId: req.body.userId, name: req.body.name, units: [], examScores: [] })

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

        else if (req.method === "GET"){
            await mongoose.connect(process.env.MONGODB_URL)
            const courses = await CourseModel.find({userId: req.body.userId})

            if(courses.length < 0) return res.status(400).send("No courses tied to the user")

            res.status.send(200).json({courses: courses})
        }

        else if (req.method === "DELETE"){
            if(!req.body) return res.status(400).send("Missing body")

            await mongoose.connect(process.env.MONGODB_URL)
            const courses = await CourseModel.deleteOne({_id: req.body.courseId})
            const units = await UnitModel.deleteMany({courseId: req.body.courseId})

            // if(courses.length < 0) return res.status(400).send("No courses under that id")

            res.status.send(200)
        }
        
    } catch (error) {
        return res.status(500).json({message: error})
    }
}