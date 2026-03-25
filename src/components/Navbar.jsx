// 導入套件
import * as bootstrap from 'bootstrap';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { Toaster, toast } from 'sonner';
//導入圖片
import logo from '../assets/images/logo.svg';
import LoginModal from '../components/LoginModal';

//導入樣式
import '../assets/css/navbar.css';
import '../assets/css/loginModal.css';

//開發中測試用帳號 完成後刪除
const test = {
  email: 'rain@test.com',
  password: 'password123',
};

const API_URL = import.meta.env.VITE_API_BASE;
const MEMBER_UNREAD_EVENT = 'tripseat:member-unread-changed';

function Navbar() {
  const { isLogin, user, login, logout, loading } = useAuth();
  const loginModalRef = useRef(null);
  const userId = user?.id;
  const [unreadCount, setUnreadCount] = useState(0);
  const { register, handleSubmit, reset } = useForm({ defaultValues: test });

  // 初始化 Modal
  useEffect(() => {
    const modalElement = document.getElementById('loginModal');
    if (modalElement) {
      loginModalRef.current = new bootstrap.Modal(modalElement, {
        keyboard: false,
        backdrop: 'static',
      });
    }
  }, [loading]);

  // [AI修改開始 2026-03-11] Navbar 同步未讀通知/私訊數，讓站內收件匣旁的紅色 badge 不用重整就更新
  useEffect(() => {
    if (!isLogin || !userId) {
      return;
    }

    const fetchUnreadCount = async () => {
      const [notifRes, msgRes] = await Promise.all([
        axios
          .get(`${API_URL}/664/notifications?recipient_id=${userId}`)
          .catch(() => ({ data: [] })),
        axios.get(`${API_URL}/664/messages?receiver_id=${userId}`).catch(() => ({ data: [] })),
      ]);

      const notifUnread = (notifRes.data || []).filter(
        (item) => !item.deleted_at && !item.is_read && item.sender_id
      ).length;
      const msgUnread = (msgRes.data || []).filter(
        (item) => !item.deleted_at && !item.is_read
      ).length;
      setUnreadCount(notifUnread + msgUnread);
    };

    const handleUnreadChange = (event) => {
      const nextCount = event?.detail?.total;
      if (typeof nextCount === 'number') {
        setUnreadCount(nextCount);
        return;
      }
      void fetchUnreadCount();
    };

    void fetchUnreadCount();
    window.addEventListener(MEMBER_UNREAD_EVENT, handleUnreadChange);

    return () => {
      window.removeEventListener(MEMBER_UNREAD_EVENT, handleUnreadChange);
    };
  }, [isLogin, userId]);
  // [AI修改結束 2026-03-11]

  const onSubmit = useCallback(
    async (data) => {
      try {
        const response = await login(data.email, data.password);
        if (response.success) {
          loginModalRef.current.hide();
          reset();
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error('登入出錯：', error);
      }
    },
    [login, reset]
  );

  const closeNavbar = () => {
    if (window.innerWidth >= 992) return;

    const nav = document.getElementById('navbarNav');
    if (!nav) return;

    const instance = bootstrap.Collapse.getInstance(nav, { toggle: false });
    if (instance) {
      instance.hide();
    }
  };

  const handleShowLogin = () => {
    loginModalRef.current.show();
    closeNavbar();
  };

  return (
    <div className="trip-navbar">
      <Toaster richColors position="top-center" />
      <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 border-bottom">
        <div className="container">
          <Link
            to="/"
            className="navbar-brand d-flex align-items-center"
            onClick={() => closeNavbar()}
          >
            <img src={logo} alt="TripSeat" className="me-2" />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            {isLogin && (
              <div className="d-lg-none w-100 ">
                <div className="mobile-user-info ">
                  <img
                    src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tony'}
                    className="nav-avatar"
                    alt="avatar"
                  />
                  <span className="fw-bold ms-2">{user?.name || 'Tony Chang'}</span>
                </div>
              </div>
            )}

            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item mx-2">
                <Link
                  to="/trips"
                  className="nav-link text-dark fw-bold"
                  onClick={() => closeNavbar()}
                >
                  探索旅程
                </Link>
              </li>
              <li className="nav-item mx-2">
                <Link
                  to="/thoughts"
                  className="nav-link text-dark fw-bold"
                  onClick={() => closeNavbar()}
                >
                  回憶旅程
                </Link>
              </li>
              <li className="nav-item mx-2">
                <Link
                  to="/about"
                  className="nav-link text-dark fw-bold"
                  onClick={() => closeNavbar()}
                >
                  關於TripSeat
                </Link>
              </li>
              {isLogin && (
                <>
                  <li className="d-lg-none">
                    <Link
                      className="nav-link trip-text-l"
                      to="/member"
                      onClick={() => closeNavbar()}
                    >
                      我的會員中心
                    </Link>
                  </li>
                  <li className="d-lg-none">
                    <Link
                      className="nav-link trip-text-l "
                      to="/member/notifications"
                      onClick={() => closeNavbar()}
                    >
                      <span className="link-text">站內收件匣</span>
                      {unreadCount > 0 && (
                        <span className="badge rounded-pill bg-danger ms-2">{unreadCount}</span>
                      )}
                    </Link>
                  </li>
                  <li className="d-lg-none">
                    <Link
                      className="nav-link trip-text-l text-center fw-bold"
                      onClick={() => {
                        logout();
                      }}
                    >
                      登出
                    </Link>
                  </li>
                </>
              )}
            </ul>

            <div className="d-flex">
              {isLogin ? (
                <>
                  <Link
                    to="/member/create-group"
                    className="navbar-btn btn trip-btn-primary trip-btn-m"
                    onClick={() => closeNavbar()}
                  >
                    我要開團
                  </Link>
                  <div className="d-flex align-items-center">
                    <div className="dropdown trip-nav-user d-none d-lg-block">
                      <a
                        className="d-flex align-items-center text-decoration-none dropdown-toggle text-dark fw-bold"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        style={{ fontSize: '1.2rem' }}
                      >
                        <img
                          src={
                            user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tony'
                          }
                          alt="avatar"
                          className="nav-avatar me-2"
                        />
                        <span className="ms-2">{user?.name || 'Tony Chang'}</span>
                      </a>
                      <ul className="dropdown-menu dropdown-menu-end trip-dropdown-menu">
                        {user?.role === 'admin' && (
                          <>
                            <a
                              href={`${import.meta.env.BASE_URL}docs/api-docs.html`}
                              className="dropdown-item trip-dropdown-item"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              API 文件
                            </a>
                            <a
                              href={`${import.meta.env.BASE_URL}docs/readme-docs.html`}
                              className="dropdown-item trip-dropdown-item"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              ReadMe 文件
                            </a>
                          </>
                        )}

                        <li>
                          <Link
                            className="dropdown-item trip-dropdown-item"
                            to="/member"
                            onClick={() => closeNavbar()}
                          >
                            我的會員中心
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item trip-dropdown-item "
                            to="/member/notifications"
                            onClick={() => closeNavbar()}
                          >
                            <span>站內收件匣</span>
                            {unreadCount > 0 && (
                              <span className="badge rounded-pill bg-danger ms-2">
                                {unreadCount}
                              </span>
                            )}
                          </Link>
                        </li>
                        <li>
                          <hr className="dropdown-divider mx-3" />
                        </li>
                        <li>
                          <button
                            className="dropdown-item trip-dropdown-item text-center fw-bold"
                            onClick={() => {
                              logout();
                            }}
                          >
                            登出
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {loading ? (
                    <div>
                      <p>伺服器準備中...</p>
                    </div>
                  ) : (
                    <button
                      className="navbar-btn btn trip-btn-primary trip-btn-m"
                      onClick={() => handleShowLogin()}
                    >
                      註冊 / 登入
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <>
        {' '}
        {/*登入Modal*/}
        <LoginModal
          handleSubmit={handleSubmit}
          ref={loginModalRef}
          register={register}
          onSubmit={onSubmit}
        />
      </>
    </div>
  );
}
export default Navbar;
