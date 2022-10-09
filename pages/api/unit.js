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

            return res.status(200).json(unit)

        }

        else if (req.method === "PUT"){
            if(!req.body) return res.status(400).send("Missing body")
            await mongoose.connect(process.env.MONGODB_URL)
            const unit = await UnitModel.findById(req.body.unitId)

            if(!unit) return res.status(400).send("Unit Id does not exist")

            unit.name = req.body.name
            await unit.save()

            res.status.send(200)

        }

        else if (req.method === "DELETE"){
            if(!req.body) return res.status(400).send("Missing body")

            await mongoose.connect(process.env.MONGODB_URL)
            const units = await UnitModel.deleteOne({_id: req.body.unitId})
            //delete lessons


            if(courses.length < 0) return res.status(400).send("No units under that id")

            res.status.send(200)
        }
        
    } catch (error) {
        return res.status(500).json({message: error})
    }
}