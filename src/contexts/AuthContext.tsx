import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authApi, setToken, clearToken, ApiError } from '../lib/api';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Auto-login on mount
    useEffect(() => {
        const token = localStorage.getItem('vitrino_token');
        if (!token) {
            setIsLoading(false);
            return;
        }

        authApi.me()
            .then((userData) => setUser(userData))
            .catch(() => clearToken())
            .finally(() => setIsLoading(false));
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const response = await authApi.login(email, password);
        setToken(response.token);
        setUser(response.user);
    }, []);

    const register = useCallback(async (name: string, email: string, password: string) => {
        await authApi.register(name, email, password);
        // After registration, auto-login
        const loginResponse = await authApi.login(email, password);
        setToken(loginResponse.token);
        setUser(loginResponse.user);
    }, []);

    const logout = useCallback(() => {
        clearToken();
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated: !!user,
            login,
            register,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
