import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link2, Mail, Lock, LogIn as LogInIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = () => {
        // Demo account for testing
        const DEMO_EMAIL = "demo@shortify.com";
        const DEMO_PASSWORD = "demo123";

        if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
            alert("✅ Login successful! Welcome back!");
            navigate('/dashboard');
        } else if (email && password) {
            alert("❌ Invalid credentials. Try:\nEmail: demo@shortify.com\nPassword: demo123");
        }
    };

    const handleGoogleLogin = () => {
        // TODO: Implement Google OAuth
        console.log("Google Login clicked");
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                        >
                            <Link2 className="w-7 h-7 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900">Shortify</span>
                        </button>

                        <div className="hidden sm:flex items-center gap-8">
                            <a href="#" className="text-gray-600 hover:text-gray-900">Features</a>
                            <a href="#" className="text-gray-600 hover:text-gray-900">Pricing</a>
                            <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 hidden sm:inline">Don't have an account?</span>
                            <Button
                                onClick={() => navigate('/signup')}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6"
                            >
                                Sign Up
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        {/* Icon */}
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <LogInIcon className="w-6 h-6 text-blue-600" />
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                            Welcome back
                        </h1>
                        <p className="text-gray-600 text-center mb-8 text-sm">
                            Enter your credentials to access your account.
                        </p>

                        {/* Form */}
                        <div className="space-y-4 mb-6">
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email address
                                </label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-12 border-gray-300"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <a href="#" className="text-sm text-blue-600 hover:underline">
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 h-12 border-gray-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center gap-2 mb-6">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="remember" className="text-sm text-gray-600">
                                Remember me for 30 days
                            </label>
                        </div>

                        {/* Login Button */}
                        <Button
                            onClick={handleLogin}
                            disabled={!email || !password}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <LogInIcon className="w-4 h-4" />
                            Log in
                        </Button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        {/* Google Button */}
                        <Button
                            onClick={handleGoogleLogin}
                            variant="outline"
                            className="w-full h-12 border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-3"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            <span className="text-gray-700 font-medium">Google</span>
                        </Button>
                    </div>

                    {/* Mobile Sign Up Link */}
                    <p className="text-center mt-6 sm:hidden text-sm text-gray-600">
                        Don't have an account?{" "}
                        <button onClick={() => navigate('/signup')} className="text-blue-600 font-medium hover:underline">
                            Sign up
                        </button>
                    </p>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-6">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">© 2023 Shortify Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy</a>
                        <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Terms</a>
                        <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
