//導入套件
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";

//導入元件
import { useAuth } from "../contexts/AuthContext";

function LoginForm({ onSuccess }) {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await login(data.email, data.password);
            if (response.success) {
                if (onSuccess) onSuccess();
                // 登入後導回原本想去的頁面，若無則去探索旅程
                const origin = location.state?.from?.pathname || "/trips";
                navigate(origin);
            } else {
                console.log(response.message);
            }
        } catch (error) {
            console.error("登入出錯：", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-100">
            <div className="mb-4">
                <label className="form-label fw-bold text-secondary">電子信箱</label>
                <input
                    type="email"
                    className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="name@example.com"
                    {...register("email", { required: "請輸入信箱" })}
                />
            </div>
            <div className="mb-4">
                <div className="d-flex justify-content-between">
                    <label className="form-label fw-bold text-secondary">密碼</label>
                    <a href="#" className="text-decoration-none small text-muted">忘記密碼？</a>
                </div>
                <input
                    type="password"
                    className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                    {...register("password", { required: "請輸入密碼" })}
                />
            </div>
            <button type="submit" className="btn trip-btn-primary trip-btn-l w-100">
                立即登入
            </button>
        </form>
    );
}
export default LoginForm;