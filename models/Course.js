import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    userId: mongoose.SchemaTypes.ObjectId,
    name: String,
    units: [mongoose.SchemaTypes.ObjectId]
}, {timestamps: true})

export const CourseModel = mongoose.models.course || mongoose.model("course", CourseSchema)