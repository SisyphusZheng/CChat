import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore"; // 新增主题store引入
import { LogOut, MessageSquare, Settings, User, Moon, Sun } from "lucide-react";

const Navbar = () => {
    const { logout, authUser } = useAuthStore();
    const { theme, setTheme } = useThemeStore(); // 获取主题状态

    // 主题切换逻辑
    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    };

    return (
        <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
            <div className="container mx-auto px-4 h-16">
                <div className="flex items-center justify-between h-full">
                    {/* left side with logo */}
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-primary" />
                            </div>
                            <h1 className="text-lg font-bold">CChat</h1>
                        </Link>
                    </div>

                    {/* Right side function */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 mr-4">
                            <button
                                onClick={toggleTheme}
                                className="btn btn-ghost btn-sm gap-2 hover:bg-base-200/50"
                            >
                                {theme === 'dark' ? (
                                    <Sun className="w-5 h-5" />
                                ) : (
                                    <Moon className="w-5 h-5" />
                                )}
                            </button>
                            <div
                                onClick={toggleTheme}
                                className="cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    className="toggle toggle-sm toggle-primary"
                                    checked={theme === 'dark'}
                                    onChange={() => { }}
                                />
                            </div>
                        </div>

                        {authUser ? (
                            <>
                                <Link to="/settings" className="btn btn-sm gap-2">
                                    <Settings className="w-5 h-5" />
                                    <span className="hidden sm:inline">Settings</span>
                                </Link>
                                <Link to="/profile" className="btn btn-sm gap-2">
                                    <User className="size-5" />
                                    <span className="hidden sm:inline">Profile</span>
                                </Link>
                                <button className="btn btn-sm gap-2" onClick={logout}>
                                    <LogOut className="size-5" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;