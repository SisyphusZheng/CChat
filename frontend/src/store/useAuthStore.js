import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check", { withCredentials: true });
            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    loginWithGithub: () => {
        set({ isLoggingIn: true });
        try {
            const url = new URL("/api/auth/github", import.meta.env.VITE_SOCKET_BASE_URL).href;
            console.log("Redirecting to:", url);
            window.location.href = url;
        } catch (error) {
            console.error("Error in loginWithGithub:", error.message);
            toast.error("Failed to initiate GitHub login");
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data, { withCredentials: true });
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("Error in update profile:", error);
            toast.error(error.response?.data?.message || "Profile update failed");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socketUrl = import.meta.env.VITE_SOCKET_BASE_URL;

        const socket = io(socketUrl.replace(/^http:\/\//, 'wss://'), {
            query: {
                userId: authUser._id,
            },
            withCredentials: true,
            transports: ['websocket', 'polling']
        });
        socket.connect();

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },


    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}));