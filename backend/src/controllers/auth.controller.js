import User from "../models/user.model.js";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { generateToken } from "../lib/utils.js";
import dotenv from "dotenv";

dotenv.config();

// GitHub Strategy 
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ githubId: profile.id });
                if (!user) {
                    user = new User({
                        githubId: profile.id,
                        fullName: profile.displayName || profile.username,
                        email: profile.emails?.[0]?.value,
                        profilePic: profile.photos?.[0]?.value,
                    });
                    await user.save();
                }
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// 序列化和反序列化用户
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// 发起 GitHub 认证
export const githubLogin = passport.authenticate("github", { scope: ["user:email"] });

// GitHub 回调路由
export const githubCallback = (req, res, next) => {
    passport.authenticate("github", { failureRedirect: "/login" }, (err, user, info) => {
        if (err) {
            console.log("Authentication error:", err);
            return res.status(500).json({ message: "Authentication failed" });
        }
        if (!user) {
            console.log("No user found:", info);
            return res.redirect(`${process.env.FRONTEND_URL}/login`);
        }
        try {
            console.log("GitHub callback received, user:", user);
            generateToken(user._id, res);
            res.redirect(`${process.env.FRONTEND_URL}/`);
        } catch (error) {
            console.log("Error in github callback:", error.message);
            res.status(500).json({ message: "Internal Server Error" });
        }
    })(req, res, next);
};

// 获取当前用户信息
export const getCurrentUser = (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        res.status(200).json({
            _id: req.user._id,
            fullName: req.user.fullName,
            email: req.user.email,
            profilePic: req.user.profilePic
        });
    } catch (error) {
        console.log("Error in getCurrentUser:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// 更新用户资料
export const updateProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const { fullName } = req.body;
        const userId = req.user._id;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { fullName },
            { new: true }
        );

        res.status(200).json({
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            profilePic: updatedUser.profilePic
        });
    } catch (error) {
        console.log("Error in update profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 登出
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 0,
        });
        console.log("User logged out, JWT cookie cleared");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// 检查认证状态
export const checkAuth = (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        res.status(200).json({
            _id: req.user._id,
            fullName: req.user.fullName,
            email: req.user.email,
            profilePic: req.user.profilePic
        });
    } catch (error) {
        console.log("Error in checkAuth:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};