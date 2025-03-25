// components/AuthCallback.jsx
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

const AuthCallback = () => {
    const { checkAuth } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            await checkAuth();
            const { authUser } = useAuthStore.getState();
            if (authUser) {
                navigate("/"); // 认证成功后导航到首页
            } else {
                navigate("/login"); // 如果认证失败，返回登录页
            }
        };
        handleCallback();
    }, [checkAuth, navigate]);

    return (
        <div className="flex justify-center items-center h-screen">
            <Loader className="size-8 animate-spin" />
            <span className="ml-2">Authenticating...</span>
        </div>
    );
};

export default AuthCallback;