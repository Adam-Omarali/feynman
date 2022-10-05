import mongoose from "mongoose";

const UnitSchema = new mongoose.Schema({
    courseId: mongoose.SchemaTypes.ObjectId,
    name: String,
    lessons: [{
        id: mongoose.SchemaTypes.ObjectId,
        title: String,
        link: String,
    }],
    questions: [{
        id: mongoose.SchemaTypes.ObjectId,
        body: String,
        img: String,
        ans: String,
        lessonIds: [mongoose.SchemaTypes.ObjectId],
        difficulty: Number,
    }],
    tests: [{
        name: String,
        questions: [mongoose.SchemaTypes.ObjectId],
        scores: [Number]
    }]
}, {timestamps: true})

export const UnitModel = mongoose.models.unit || mongoose.model("unit", UnitSchema)