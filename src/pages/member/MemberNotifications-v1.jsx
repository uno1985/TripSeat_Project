/**
 * 📍 目標位置：src/pages/member/MemberNotifications.jsx
 * 📝 會員通知頁面 v1 - 簡潔實用版
 *
 * ✨ v1 特色：
 *   - 清晰的通知列表
 *   - 已讀/未讀狀態
 *   - 多種通知類型（申請、成團、取消、系統、訊息）
 *   - 時間顯示
 *   - 點擊標記已讀
 *   - 全部標為已讀功能
 *   - 空狀態設計
 *   - 響應式設計
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/memberNotifications-v1.css';

const MemberNotifications = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'apply',
            typeText: '入團申請',
            icon: 'bi-person-plus-fill',
            user: { name: '小白貓', id: 'user123', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cat' },
            content: '提出入團申請',
            trip: { name: '綠島潛水團', id: 'trip101' },
            action: '請審核',
            actionLink: '/member/manage/trip101/applicants',
            time: '2026-02-18T10:30:00',
            isRead: false,
        },
        {
            id: 2,
            type: 'success',
            typeText: '成團通知',
            icon: 'bi-check-circle-fill',
            content: '你參加的',
            trip: { name: '2026跨年101煙火團', id: 'trip456' },
            endContent: '已成團！',
            time: '2026-02-18T09:15:00',
            isRead: false,
        },
        {
            id: 3,
            type: 'message',
            typeText: '私訊',
            icon: 'bi-chat-dots-fill',
            user: { name: '露營女孩艾琳', id: 'user456', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=irene' },
            content: '傳送訊息給你',
            message: '你好！想詢問一下關於裝備的問題...',
            actionLink: '/messages/user456',
            time: '2026-02-18T08:45:00',
            isRead: false,
        },
        {
            id: 4,
            type: 'cancel',
            typeText: '棄團通知',
            icon: 'bi-x-circle-fill',
            content: '你參加的',
            trip: { name: '農場體驗一日遊', id: 'trip789' },
            endContent: '因人數不足已取消',
            time: '2026-02-17T18:20:00',
            isRead: true,
        },
        {
            id: 5,
            type: 'system',
            typeText: '系統通知',
            icon: 'bi-megaphone-fill',
            content: '你的帳號已完成實名認證',
            time: '2026-02-17T14:00:00',
            isRead: true,
        },
        {
            id: 6,
            type: 'reminder',
            typeText: '行程提醒',
            icon: 'bi-clock-fill',
            content: '你參加的',
            trip: { name: '台南美食散步', id: 'trip234' },
            endContent: '將於明天出發，請準時集合',
            time: '2026-02-16T20:00:00',
            isRead: true,
        },
        {
            id: 7,
            type: 'join',
            typeText: '入團通過',
            icon: 'bi-hand-thumbs-up-fill',
            content: '你的入團申請',
            trip: { name: '合歡山北峰攻頂', id: 'trip567' },
            endContent: '已通過審核',
            time: '2026-02-16T11:30:00',
            isRead: true,
        },
    ]);

    // 標記單一通知為已讀
    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, isRead: true } : notif
            )
        );
    };

    // 全部標為已讀
    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, isRead: true }))
        );
    };

    // 格式化時間
    const formatTime = (timeStr) => {
        const time = new Date(timeStr);
        const now = new Date();
        const diff = now - time;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return '剛剛';
        if (minutes < 60) return `${minutes} 分鐘前`;
        if (hours < 24) return `${hours} 小時前`;
        if (days < 7) return `${days} 天前`;

        return time.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' });
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="member-notifications-page">
            {/* 頁面標題 */}
            <div className="notif-header">
                <div className="notif-header-main">
                    <h2 className="h3 trip-text-gray-800">
                        <i className="bi bi-bell-fill me-2 trip-text-primary-800"></i>
                        訊息通知
                    </h2>
                    {unreadCount > 0 && (
                        <span className="notif-unread-badge">{unreadCount} 則未讀</span>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button className="notif-mark-all-btn" onClick={markAllAsRead}>
                        <i className="bi bi-check-all me-1"></i>
                        全部標為已讀
                    </button>
                )}
            </div>

            {/* 通知列表 */}
            <div className="notif-list">
                {notifications.length === 0 ? (
                    <div className="notif-empty">
                        <i className="bi bi-inbox"></i>
                        <h5>沒有任何通知</h5>
                        <p>目前沒有新的訊息</p>
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`notif-item ${!notif.isRead ? 'unread' : ''}`}
                            onClick={() => !notif.isRead && markAsRead(notif.id)}
                        >
                            {/* 未讀標記點 */}
                            {!notif.isRead && <div className="notif-unread-dot"></div>}

                            {/* 圖示 */}
                            <div className={`notif-icon notif-icon-${notif.type}`}>
                                <i className={notif.icon}></i>
                            </div>

                            {/* 內容 */}
                            <div className="notif-content">
                                {/* 類型標籤 */}
                                <span className={`notif-type-tag notif-tag-${notif.type}`}>
                                    {notif.typeText}
                                </span>

                                {/* 主要內容 */}
                                <div className="notif-text">
                                    {/* 使用者名稱 + 頭像 */}
                                    {notif.user && (
                                        <span className="notif-user">
                                            <img src={notif.user.avatar} alt={notif.user.name} />
                                            <Link to={`/member/${notif.user.id}`}>
                                                {notif.user.name}
                                            </Link>
                                        </span>
                                    )}

                                    {/* 前段文字 */}
                                    <span>{notif.content}</span>

                                    {/* 旅程名稱 */}
                                    {notif.trip && (
                                        <Link to={`/trips/${notif.trip.id}`} className="notif-trip-link">
                                            「{notif.trip.name}」
                                        </Link>
                                    )}

                                    {/* 後段文字 */}
                                    {notif.endContent && <span>{notif.endContent}</span>}
                                </div>

                                {/* 私訊預覽 */}
                                {notif.message && (
                                    <div className="notif-message-preview">
                                        <i className="bi bi-chat-quote"></i>
                                        <span>{notif.message}</span>
                                    </div>
                                )}

                                {/* 操作按鈕 */}
                                {notif.action && notif.actionLink && (
                                    <Link to={notif.actionLink} className="notif-action-btn">
                                        <i className="bi bi-arrow-right-circle"></i>
                                        {notif.action}
                                    </Link>
                                )}

                                {/* 時間 */}
                                <div className="notif-time">
                                    <i className="bi bi-clock"></i>
                                    {formatTime(notif.time)}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MemberNotifications;
