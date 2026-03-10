/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const getTokenFromCookie = () =>
    document.cookie
        .split('; ')
        .find((row) => row.startsWith('tripToken='))
        ?.split('=')[1];

const getStoredUser = () => {
    try {
        const raw = localStorage.getItem('tripUser');
        return raw ? JSON.parse(raw) : null;
    } catch {
        localStorage.removeItem('tripUser');
        return null;
    }
};

const saveTokenToCookie = (token) => {
    const expired = new Date();
    expired.setTime(expired.getTime() + 24 * 60 * 60 * 1000);
    document.cookie = `tripToken=${token}; expires=${expired.toUTCString()}; path=/;`;
};

const clearTokenCookie = () => {
    document.cookie = 'tripToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

export const AuthProvider = ({ children }) => {
    const API_URL = import.meta.env.VITE_API_BASE; // 確保 .env 裡是 http://localhost:3001
    const initialUser = getStoredUser();
    const hasSession = Boolean(getTokenFromCookie() && initialUser?.id);

    const [isLogin, setIsLogin] = useState(hasSession);
    const [user, setUser] = useState(initialUser);
    const [loading, setLoading] = useState(hasSession);

    // 1. 登出
    const logout = useCallback((options = { redirect: true }) => {
        clearTokenCookie();
        localStorage.removeItem('tripUser');
        setIsLogin(false);
        setUser(null);
        setLoading(false);

        if (options.redirect) {
            window.location.hash = '#/';
        }
    }, []);

    // 2. 登入
    const login = useCallback(async (email, password) => {
        try {
            // json-server-auth 自動生成的路由
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const { accessToken, user: userData } = response.data;

            // 存入 Cookie
            saveTokenToCookie(accessToken);

            // 存入 localStorage 方便重新整理時快速讀取
            localStorage.setItem('tripUser', JSON.stringify(userData));

            setIsLogin(true);
            setUser(userData);
            setLoading(false);
            return { success: true };
        } catch (error) {
            let message = '登入失敗';
            if (error.response?.data === 'Incorrect password') {
                message = '密碼輸入錯誤，請再試一次';
            } else if (error.response?.data === 'Cannot find user') {
                message = '找不到此帳號，請先註冊';
            }
            return { success: false, message };
        }
    }, [API_URL]);

    // 3. 全站判定邏輯 (重新整理時恢復狀態)
    useEffect(() => {
        if (!hasSession || !user?.id) {
            return;
        }

        let cancelled = false;
        const checkLogin = async () => {
            const token = getTokenFromCookie();
            if (!token) {
                if (!cancelled) {
                    logout({ redirect: false });
                }
                return;
            }

            try {
                // 只要這個請求沒噴 401，就代表 Token 還沒過期
                await axios.get(`${API_URL}/600/users/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!cancelled) {
                    setIsLogin(true);
                }
            } catch {
                if (!cancelled) {
                    logout({ redirect: false }); // 過期就清空
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        checkLogin();
        return () => {
            cancelled = true;
        };
    }, [API_URL, hasSession, logout, user?.id]);

    // 4. 更新使用者
    const updateUser = useCallback((updatedData) => {
        setUser((prev) => {
            const merged = { ...(prev || {}), ...updatedData };
            localStorage.setItem('tripUser', JSON.stringify(merged));
            return merged;
        });
    }, []);

    // 6. 這是最重要的！沒有 return，網頁就會變白的
    return (
        <AuthContext.Provider value={{ isLogin, user, login, logout, loading, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
