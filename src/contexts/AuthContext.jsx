import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    const API_URL = import.meta.env.VITE_API_BASE; // 確保 .env 裡是 http://localhost:3001

    // 1. 全站判定邏輯 (重新整理時恢復狀態)
    const checkLogin = async () => {
        const token = document.cookie.split("; ").find(row => row.startsWith("tripToken="))?.split("=")[1];

        const localUser = JSON.parse(localStorage.getItem('tripUser'));
        if (token && localUser?.id) {
            try {
                // 只要這個請求沒噴 401，就代表 Token 還沒過期
                await axios.get(`${API_URL}/600/users/${localUser.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsLogin(true);
                setUser(localUser);


            } catch (error) {
                console.log(error)
                logout(); // 過期就清空
            }
        }
        setLoading(false); // 確保最後一定會關閉 loading
    };

    // 2. 登入
    const login = async (email, password) => {
        try {
            // json-server-auth 自動生成的路由
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const { accessToken, user: userData } = response.data;

            // 存入 Cookie
            const expired = new Date();
            expired.setTime(expired.getTime() + (24 * 60 * 60 * 1000));
            document.cookie = `tripToken=${accessToken}; expires=${expired.toUTCString()}; path=/;`;

            // 存入 localStorage 方便重新整理時快速讀取
            localStorage.setItem('tripUser', JSON.stringify(userData));

            setIsLogin(true);
            setUser(userData);
            console.log(response)
            return { success: true };
        } catch (error) {
            console.log(error)
            let message = "登入失敗";
            if (error.response?.data === "Incorrect password") {
                message = "密碼輸入錯誤，請再試一次";
            } else if (error.response?.data === "Cannot find user") {
                message = "找不到此帳號，請先註冊";
            }
            return { success: false, message };;
        }
    };

    // 3. 登出
    const logout = () => {

        document.cookie = "tripToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem('tripUser');
        setIsLogin(false);
        setUser(null);
        window.location.hash = '#/';
    };



    // 4.
    const updateUser = (updatedData) => {
        const merged = { ...user, ...updatedData };
        localStorage.setItem('tripUser', JSON.stringify(merged));
        setUser(merged);
    };


    // 5. 初次載入時執行檢查
    useEffect(() => {
        checkLogin();
    }, []);





    // 6. 這是最重要的！沒有 return，網頁就會變白的
    return (
        <AuthContext.Provider value={{ isLogin, user, login, logout, loading, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);