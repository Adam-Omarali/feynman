import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { UnitModel } from "../../models/Unit";
import { UserModel } from "../../models/User";
import { CourseModel } from "../../models/Course";

export default async function handler(req, res){
    try {

        if (req.method === "POST"){

            if(!req.body) return res.status(400).send("Missing body")
            await mongoose.connect(process.env.MONGODB_URL)
            const unit = await UnitModel.create({ courseId: req.body.courseId, name: req.body.name, lessons: [], questions: [], tests: [] })

            const course = await CourseModel.findById(req.body.courseId)
            course.units = [...course.units, unit._id]
            await course.save()

            return res.status(200).json(unit)

        }

        // else if (req.method === "PUT"){
        //     if(!req.body) return res.status(400).send("Missing body")
        //     await mongoose.connect(process.env.MONGODB_URL)
        //     const course = await CourseModel.findById(req.body.courseId)

        //     if(!course) return res.status(400).send("Course Id does not exist")

        //     course.name = req.body.name
        //     await course.save()

        //     res.status.send(200)

        // }
        
    } catch (error) {
        return res.status(500).json({message: error})
    }
}