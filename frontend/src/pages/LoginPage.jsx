import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Github } from "lucide-react";

const LoginPage = () => {
    const { isLoggingIn, loginWithGithub } = useAuthStore(); // 假设添加了新的 GitHub 登录方法
    const navigate = useNavigate();

    const handleGithubLogin = () => {
        // 触发 GitHub 登录流程
        loginWithGithub();
    };

    return (
        <div className="h-screen grid lg:grid-cols-2">
            {/* Left Side - Login Options */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div
                                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
                            >
                                <Github className="w-6 h-6 text-primary" /> {/* 改为 GitHub 图标 */}
                            </div>
                            <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
                            <p className="text-base-content/60">Sign in with your GitHub account</p>
                        </div>
                    </div>

                    {/* GitHub Login Button */}
                    <div className="space-y-6">
                        <button
                            onClick={handleGithubLogin}
                            className="btn btn-primary w-full flex items-center justify-center gap-2"
                            disabled={isLoggingIn}
                        >
                            {isLoggingIn ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <Github className="h-5 w-5" />
                                    Sign in with GitHub
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Side - Image/Pattern */}
            <AuthImagePattern
                title={"Welcome back!"}
                subtitle={"Sign in with GitHub to continue your conversations and catch up with your messages."}
            />
        </div>
    );
};

export default LoginPage;