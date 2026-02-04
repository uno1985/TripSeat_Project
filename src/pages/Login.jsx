import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from "../contexts/AuthContext";

import LoginForm from "../components/LoginForm";
import logo from '../assets/images/logo.svg';

import '../assets/css/login.css';

function Login() {
    const { isLogin, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        // 確保不是在載入中，且已經是登入狀態
        if (!loading && isLogin) {
            // 優先跳轉到「嘗試進入但被攔截」的頁面 (from)，否則回探索頁 (/trips)
            const origin = location.state?.from?.pathname || "/";

            // 使用 replace: true 可以防止使用者按瀏覽器回退鍵又回到登入頁
            navigate(origin, { replace: true });
        }
    }, [isLogin, loading, navigate, location]);

    if (loading) return null;


    return (
        <div className="login-page-container d-flex align-items-center justify-content-center">
            <div className="login-card d-flex overflow-hidden bg-white shadow-lg">
                {/* 左側：品牌視覺區 (桌機顯示) */}
                <div className="login-visual d-none d-lg-flex flex-column justify-content-end p-5 text-white">
                    <h2 className="display-5 fw-bold mb-3">開啟你的<br />下一次冒險</h2>
                    <p className="lead opacity-75">加入 TripSeat，與志同道合的旅伴一起探索世界每個角落。</p>
                </div>

                {/* 右側：登入區 */}
                <div className="login-form-section p-4 p-md-5 d-flex flex-column">
                    <div className="mb-5">
                        <Link to="/">
                            <img src={logo} alt="TripSeat" height="40" className="mb-4" />
                        </Link>
                        <h3 className="fw-bold text-dark">歡迎回來！</h3>
                        <p className="text-muted">請登入您的帳號以繼續</p>
                    </div>

                    <LoginForm />

                    <div className="mt-auto pt-5 text-center">
                        <span className="text-muted">還沒有帳號嗎？</span>
                        <Link to="/register" className="ms-2 fw-bold text-primary text-decoration-none">立即註冊</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Login;