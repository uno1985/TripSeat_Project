import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import * as bootstrap from "bootstrap";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import '../assets/css/navbar.css';
import logo from '../assets/images/logo.svg';


const test = {
    email: 'rain@test.com',
    password: 'password123'
}


function Navbar() {
    const { isLogin, user, login, logout, loading } = useAuth();
    const loginModalRef = useRef(null);

    const {
        register,
        handleSubmit,
        reset
    } = useForm();

    // 初始化 Modal
    useEffect(() => {
        const modalElement = document.getElementById('loginModal');
        if (modalElement) {
            loginModalRef.current = new bootstrap.Modal(modalElement, {
                keyboard: false,
                backdrop: 'static'
            });
        }

    }, [loading]);





    const onSubmit = async (data) => {
        try {
            const response = await login(data.email, data.password);
            if (response.success) {
                loginModalRef.current.hide();
                reset();
            } else {
                console.log(response.message);
            }
        } catch (error) {
            console.error("登入過程出錯：", error);
        }
    };

    const closeNavbar = () => {
        if (window.innerWidth >= 992) return;

        const nav = document.getElementById('navbarNav');
        if (!nav) return;

        const instance = bootstrap.Collapse.getInstance(nav);
        if (instance) {
            instance.hide();
        }
    };


    const handleShowLogin = () => {
        loginModalRef.current.show();
        closeNavbar();

    };

    if (loading) return null;

    return (
        <div className="trip-navbar">
            <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 border-bottom">
                <div className="container">
                    <Link to='/' className="navbar-brand d-flex align-items-center" onClick={() => closeNavbar()}>
                        <img src={logo} alt="TripSeat" className="me-2" />
                    </Link>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"  >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        {isLogin && (
                            <div className="d-lg-none w-100 ">
                                <div className="mobile-user-info ">
                                    <img src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tony'} className="nav-avatar" alt="avatar" />
                                    <span className="fw-bold ms-2">{user?.name || 'Tony Chang'}</span>
                                </div>
                            </div>
                        )}

                        <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                            <li className="nav-item mx-2">
                                <Link to='/trips' className="nav-link text-dark fw-bold" onClick={() => closeNavbar()}>探索旅程</Link>
                            </li>
                            <li className="nav-item mx-2">
                                <Link to='/thoughts' className="nav-link text-dark fw-bold" onClick={() => closeNavbar()}>回憶旅程</Link>
                            </li>
                            <li className="nav-item mx-2">
                                <Link to='/about' className="nav-link text-dark fw-bold" onClick={() => closeNavbar()}>關於TripSeat</Link>
                            </li>
                            {isLogin && (
                                <>
                                    <li className="d-lg-none">
                                        <Link className="nav-link trip-text-l" to="/me" onClick={() => closeNavbar()}>我的會員中心</Link>
                                    </li>
                                    <li className="d-lg-none">
                                        <Link className="nav-link trip-text-l" to="/inbox" onClick={() => closeNavbar()}>
                                            <span className="link-text">
                                                站內收件匣 <span className="inbox-badge">999</span>
                                            </span>
                                        </Link>
                                    </li >
                                    <li className="d-lg-none"><Link className="nav-link trip-text-l text-center fw-bold" onClick={() => { logout(); }}>登出</Link></li>
                                </>
                            )}
                        </ul>

                        <div className="d-flex">
                            {isLogin ? (<>
                                <button className="navbar-btn btn trip-btn-primary trip-btn-m" onClick={() => closeNavbar()}>我要開團</button>
                                <div className="d-flex align-items-center">

                                    <div className="dropdown trip-nav-user d-none d-lg-block">
                                        <a className="d-flex align-items-center text-decoration-none dropdown-toggle text-dark fw-bold" href="#" role="button" data-bs-toggle="dropdown" style={{ fontSize: '1.2rem' }}>
                                            <img src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tony'} alt="avatar" className="nav-avatar me-2" />
                                            <span className="ms-2">{user?.name || 'Tony Chang'}</span>
                                        </a>
                                        <ul className="dropdown-menu dropdown-menu-end trip-dropdown-menu">
                                            <li><Link className="dropdown-item trip-dropdown-item" to="/me" onClick={() => closeNavbar()}>我的會員中心</Link></li>
                                            <li><Link className="dropdown-item trip-dropdown-item d-flex align-items-center" to="/inbox" onClick={() => closeNavbar()}>站內收件匣 <span className="inbox-badge">999</span></Link></li>
                                            <li><hr className="dropdown-divider mx-3" /></li>
                                            <li><button className="dropdown-item trip-dropdown-item text-center fw-bold" onClick={() => { logout(); }}>登出</button></li>
                                        </ul>
                                    </div>
                                </div>
                            </>
                            ) : (
                                <button className="navbar-btn btn trip-btn-primary trip-btn-m" onClick={() => handleShowLogin()}>註冊 / 登入</button>
                            )}
                        </div>
                    </div>
                </div>
            </nav >

            {/* Login Modal */}
            < div id="loginModal" className="modal fade" tabIndex="-1" >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">登入 / 註冊 提示</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">電子信箱</label>
                                    <input type="email" className="form-control" placeholder="example@mail.com" value={test.email} {...register("email")} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">密碼</label>
                                    <input type="password" className="form-control" value={test.password} {...register("password")} />
                                </div>
                                <button type="submit" className="btn btn-primary">登入</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}
export default Navbar;