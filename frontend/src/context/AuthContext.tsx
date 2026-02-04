"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * ✅ CORRECT backend base URL
 * FastAPI is running on 8000
 */
const API_URL = "http://127.0.0.1:8000/api/v1";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem("access_token");
            if (storedToken) {
                setToken(storedToken);
                try {
                    const res = await fetch(`${API_URL}/users/me`, {
                        headers: {
                            Authorization: `Bearer ${storedToken}`,
                        },
                    });

                    if (res.ok) {
                        const userData = await res.json();
                        setUser(userData);
                    } else {
                        logout();
                    }
                } catch (err) {
                    console.error("Auth check failed", err);
                    logout();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);

        const formData = new URLSearchParams();
        formData.append("username", email); // OAuth2PasswordRequestForm
        formData.append("password", password);

        try {
            const res = await fetch(`${API_URL}/auth/login/access-token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData,
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Login failed");
            }

            const data = await res.json();
            const accessToken = data.access_token;

            localStorage.setItem("access_token", accessToken);
            setToken(accessToken);

            const userRes = await fetch(`${API_URL}/users/me`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!userRes.ok) {
                throw new Error("Failed to fetch user profile");
            }

            const userData = await userRes.json();
            setUser(userData);
            router.push("/dashboard");
        } finally {
            setLoading(false);
        }
    };

    const signup = async (name: string, email: string, password: string) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Signup failed");
            }

            // Auto-login after successful signup
            await login(email, password);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("access_token");
        router.push("/login");
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, login, signup, logout, token }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
