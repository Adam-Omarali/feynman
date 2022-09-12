import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true},
    name: {type: String, required: true},
    courses: {type: [mongoose.SchemaTypes.ObjectId], required: true}
}, {timestamps: true})

export const UserModel = mongoose.models.user || mongoose.model("user", UserSchema)