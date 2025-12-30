import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, User } from '../services/api';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('auth_token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));

                // Verify token is still valid
                try {
                    const response = await api.auth.getCurrentUser();
                    setUser(response.data);
                } catch (error) {
                    // Token invalid, clear auth
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                    setToken(null);
                    setUser(null);
                }
            }

            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await api.auth.login({ email, password });

            if (response.success && response.data) {
                const { user: userData, token: authToken } = response.data;

                // Save to state
                setUser(userData);
                setToken(authToken);

                // Save to localStorage
                localStorage.setItem('auth_token', authToken);
                localStorage.setItem('user', JSON.stringify(userData));
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Login failed';
            throw new Error(errorMessage);
        }
    };

    const register = async (email: string, password: string, name: string) => {
        try {
            const response = await api.auth.register({ email, password, name });

            if (response.success && response.data) {
                const { user: userData, token: authToken } = response.data;

                // Save to state
                setUser(userData);
                setToken(authToken);

                // Save to localStorage
                localStorage.setItem('auth_token', authToken);
                localStorage.setItem('user', JSON.stringify(userData));
            } else {
                throw new Error(response.message || 'Registration failed');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
            throw new Error(errorMessage);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
    };

    const value: AuthContextType = {
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
        isLoading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
