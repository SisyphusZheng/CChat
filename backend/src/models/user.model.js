import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        githubId: {
            type: String,
            unique: true,
            sparse: true // 允许 null 值但保持唯一性
        },
        email: {
            type: String,
            unique: true,
            sparse: true // 允许 null 值但保持唯一性
        },
        fullName: {
            type: String,
            required: true,
        },
        profilePic: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;