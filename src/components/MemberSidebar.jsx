import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import '../assets/css/memberSidebar.css';
import avatarImg from '../assets/images/avator09.png';



const MemberSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // 用於手機版下拉選單狀態


  const menuItems = [
    { name: '我的檔案', path: '/member/profile' },
    { name: '我的旅程', path: '/member/trips' },
    { name: '我的揪團', path: '/member/groups' },
    { name: '我要開團', path: '/member/create-group' },
    { name: '我的收藏', path: '/member/favorites' },
    { name: '訊息通知', path: '/member/notifications' },
  ];

  // 根據目前路徑取得選單名稱，若無匹配則顯示「會員中心」
  const currentItem = menuItems.find(item => item.path === location.pathname);
  const currentTitle = currentItem ? currentItem.name : '會員中心';



  // 直接用 user，不需要 profile
  const displayName = user?.name || '會員';
  const displayIntro = user?.intro || '歡迎來到會員中心';
  const displayAvatar = user?.avatar || avatarImg;
  const displayRating = user?.rating_average ?? '-';
  const displayTrips = user?.trips_completed ?? 0;


  return (
    <div className="member-sidebar-container">
      {/* --- 手機版：下拉選單 (d-md-none) --- */}
      <div className="d-block d-md-none mb-4">
        <div className="dropdown w-100">
          <button
            className="btn btn-white border shadow-sm w-100 d-flex justify-content-between align-items-center py-2 px-3"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="fs-5 fw-medium text-dark">{currentTitle}</span>
            <span className={`dropdown-toggle ${isOpen ? 'show' : ''}`}></span>
          </button>

          <ul className={`dropdown-menu w-100 shadow-sm border-0 mt-1 ${isOpen ? 'show' : ''}`}
            style={{ display: isOpen ? 'block' : 'none' }}>
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`dropdown-item py-2 fs-6 ${location.pathname === item.path ? 'active bg-primary text-white' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* --- 桌面版：側邊欄 (d-none d-md-block) --- */}
      <div className="member-sidebar bg-white shadow-sm rounded-4 p-4 text-center d-none d-md-block">
        <div className="profile-info mb-4">
          <div className="avatar-wrapper mb-3">
            <img
              src={displayAvatar}
              alt="User Avatar"
              className="rounded-circle border"
              style={{ width: '120px', height: '120px', objectFit: 'cover' }}
            />
          </div>
          <h3 className="h3 fw-bold mb-1">{displayName}</h3>
          <p className="trip-text-m trip-text-gray-400 mb-2">{displayIntro}</p>
          <div className="rating d-flex align-items-center justify-content-center">
            <span className="trip-btn-m p-0 me-1">★</span>
            <span className="trip-btn-m p-0 fw-bold">{displayRating}</span>
            <span className="trip-text-s ms-1">({displayTrips} 趟旅程)</span>
          </div>
        </div>

        <hr className="my-4 text-secondary opacity-25" />

        <nav className="member-nav">
          <ul className="list-unstyled mb-0">
            {menuItems.map((item, index) => (
              <li key={index} className="mb-3">
                <Link
                  to={item.path}
                  className={`nav-link py-2 fs-5 fw-medium transition-all ${location.pathname === item.path ? 'trip-text-primary-1000 trip-bg-primary-200' : 'text-dark'
                    }`}
                  style={{ textDecoration: 'none' }}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MemberSidebar;
