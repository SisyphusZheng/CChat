import express from 'express';
import {
    githubLogin,
    githubCallback,
    logout,
    checkAuth,
    updateProfile,
    getCurrentUser
} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// GitHub 认证路由
router.get("/github", githubLogin);
router.get("/callback", githubCallback);

// 获取当前用户信息
router.get("/me", protectRoute, getCurrentUser);

// 更新用户信息
router.put("/update-profile", protectRoute, updateProfile);

// 登出
router.post("/logout", logout);

// 检查认证状态
router.get("/check", protectRoute, checkAuth);

export default router;