/**
 * 📍 目標位置：src/pages/member/MemberNotifications.jsx
 * 📝 會員通知頁面 v2 - 進階功能版
 *
 * ✨ v2 進階特色：
 *   - 多重篩選（全部/未讀/已讀/類型篩選）
 *   - 時間分組（今天、昨天、本週、更早）
 *   - 批次操作（選擇、刪除、標記已讀）
 *   - 下拉展開詳情
 *   - 通知統計卡片
 *   - 更豐富的通知類型
 *   - 響應式優化
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/memberNotifications-v2.css';

const MemberNotifications = () => {
    const [filter, setFilter] = useState('all'); // all, unread, read
    const [typeFilter, setTypeFilter] = useState('all'); // all, apply, success, cancel, message, system
    const [selectedIds, setSelectedIds] = useState([]);
    const [expandedId, setExpandedId] = useState(null);

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
            details: '申請者已參加過 5 次旅程，評分 4.8 ⭐',
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
            details: '目前已有 10/10 人報名，團主已確認出團。集合時間：12/31 晚上 10:00',
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
            message: '你好！想詢問一下關於裝備的問題，請問睡袋需要自己準備嗎？',
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
            details: '由於報名人數未達最低成團人數，團主決定取消此次行程。報名費用將於 3-5 個工作天退回。',
            time: '2026-02-17T18:20:00',
            isRead: true,
        },
        {
            id: 5,
            type: 'system',
            typeText: '系統通知',
            icon: 'bi-megaphone-fill',
            content: '你的帳號已完成實名認證',
            details: '恭喜！你現在可以建立自己的旅程揪團了。',
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
            endContent: '將於明天出發',
            details: '集合地點：台南火車站前站。集合時間：09:00。請準時集合，建議提早 10 分鐘到達。',
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
            details: '團主已同意你的申請。記得查看旅程詳情準備裝備。',
            time: '2026-02-16T11:30:00',
            isRead: true,
        },
        {
            id: 8,
            type: 'review',
            typeText: '心得提醒',
            icon: 'bi-star-fill',
            content: '你參加的',
            trip: { name: '綠島浮潛體驗', id: 'trip890' },
            endContent: '已結束，快來分享心得吧',
            actionLink: '/trips/trip890/review',
            action: '撰寫心得',
            time: '2026-02-15T16:00:00',
            isRead: false,
        },
    ]);

    // 篩選通知
    const filteredNotifications = useMemo(() => {
        let result = notifications;

        // 已讀/未讀篩選
        if (filter === 'unread') {
            result = result.filter(n => !n.isRead);
        } else if (filter === 'read') {
            result = result.filter(n => n.isRead);
        }

        // 類型篩選
        if (typeFilter !== 'all') {
            result = result.filter(n => n.type === typeFilter);
        }

        return result;
    }, [notifications, filter, typeFilter]);

    // 時間分組
    const groupedNotifications = useMemo(() => {
        const groups = {
            today: [],
            yesterday: [],
            thisWeek: [],
            older: [],
        };

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        filteredNotifications.forEach(notif => {
            const notifDate = new Date(notif.time);
            const notifDay = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate());

            if (notifDay.getTime() === today.getTime()) {
                groups.today.push(notif);
            } else if (notifDay.getTime() === yesterday.getTime()) {
                groups.yesterday.push(notif);
            } else if (notifDate >= weekAgo) {
                groups.thisWeek.push(notif);
            } else {
                groups.older.push(notif);
            }
        });

        return groups;
    }, [filteredNotifications]);

    // 統計數據
    const stats = useMemo(() => ({
        total: notifications.length,
        unread: notifications.filter(n => !n.isRead).length,
        apply: notifications.filter(n => n.type === 'apply').length,
        message: notifications.filter(n => n.type === 'message' && !n.isRead).length,
    }), [notifications]);

    // 標記為已讀
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

    // 刪除通知
    const deleteNotifications = (ids) => {
        setNotifications(prev => prev.filter(notif => !ids.includes(notif.id)));
        setSelectedIds([]);
    };

    // 切換選擇
    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    // 全選/取消全選
    const toggleSelectAll = () => {
        if (selectedIds.length === filteredNotifications.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredNotifications.map(n => n.id));
        }
    };

    // 格式化時間
    const formatTime = (timeStr) => {
        const time = new Date(timeStr);
        return time.toLocaleString('zh-TW', {
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const renderNotificationItem = (notif) => (
        <div
            key={notif.id}
            className={`notif-v2-item ${!notif.isRead ? 'unread' : ''} ${
                selectedIds.includes(notif.id) ? 'selected' : ''
            }`}
        >
            {/* 選擇框 */}
            <div className="notif-v2-checkbox">
                <input
                    type="checkbox"
                    checked={selectedIds.includes(notif.id)}
                    onChange={() => toggleSelect(notif.id)}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>

            {/* 圖示 */}
            <div className={`notif-v2-icon notif-v2-icon-${notif.type}`}>
                <i className={notif.icon}></i>
            </div>

            {/* 內容 */}
            <div
                className="notif-v2-content"
                onClick={() => !notif.isRead && markAsRead(notif.id)}
            >
                <div className="notif-v2-main">
                    <span className={`notif-v2-type-tag notif-v2-tag-${notif.type}`}>
                        {notif.typeText}
                    </span>

                    <div className="notif-v2-text">
                        {notif.user && (
                            <span className="notif-v2-user">
                                <img src={notif.user.avatar} alt={notif.user.name} />
                                <Link to={`/member/${notif.user.id}`}>{notif.user.name}</Link>
                            </span>
                        )}
                        <span>{notif.content}</span>
                        {notif.trip && (
                            <Link to={`/trips/${notif.trip.id}`} className="notif-v2-trip-link">
                                「{notif.trip.name}」
                            </Link>
                        )}
                        {notif.endContent && <span>{notif.endContent}</span>}
                    </div>

                    <div className="notif-v2-meta">
                        <span className="notif-v2-time">
                            <i className="bi bi-clock"></i>
                            {formatTime(notif.time)}
                        </span>
                        {notif.details && (
                            <button
                                className="notif-v2-expand-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedId(expandedId === notif.id ? null : notif.id);
                                }}
                            >
                                {expandedId === notif.id ? '收合' : '查看詳情'}
                                <i className={`bi bi-chevron-${expandedId === notif.id ? 'up' : 'down'}`}></i>
                            </button>
                        )}
                    </div>
                </div>

                {notif.message && (
                    <div className="notif-v2-message-preview">
                        <i className="bi bi-chat-quote"></i>
                        <span>{notif.message}</span>
                    </div>
                )}

                {notif.action && notif.actionLink && (
                    <Link
                        to={notif.actionLink}
                        className="notif-v2-action-btn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <i className="bi bi-arrow-right-circle"></i>
                        {notif.action}
                    </Link>
                )}

                {expandedId === notif.id && notif.details && (
                    <div className="notif-v2-details">
                        <i className="bi bi-info-circle"></i>
                        <p>{notif.details}</p>
                    </div>
                )}
            </div>

            {!notif.isRead && <div className="notif-v2-unread-dot"></div>}
        </div>
    );

    return (
        <div className="member-notifications-v2">
            {/* 頁面標題 */}
            <div className="notif-v2-header">
                <div>
                    <h2 className="h3 trip-text-gray-800">
                        <i className="bi bi-bell-fill me-2 trip-text-primary-800"></i>
                        訊息通知
                    </h2>
                    <p className="trip-text-s trip-text-gray-400 mt-1 mb-0">
                        管理你的所有通知訊息
                    </p>
                </div>
            </div>

            {/* 統計卡片 */}
            <div className="notif-v2-stats">
                <div className="notif-v2-stat-card">
                    <div className="notif-v2-stat-icon" style={{ backgroundColor: '#e3f2fd' }}>
                        <i className="bi bi-bell-fill" style={{ color: '#1976d2' }}></i>
                    </div>
                    <div>
                        <div className="notif-v2-stat-number">{stats.total}</div>
                        <div className="notif-v2-stat-label">全部通知</div>
                    </div>
                </div>
                <div className="notif-v2-stat-card">
                    <div className="notif-v2-stat-icon" style={{ backgroundColor: '#fff3e0' }}>
                        <i className="bi bi-exclamation-circle-fill" style={{ color: '#f57c00' }}></i>
                    </div>
                    <div>
                        <div className="notif-v2-stat-number">{stats.unread}</div>
                        <div className="notif-v2-stat-label">未讀訊息</div>
                    </div>
                </div>
                <div className="notif-v2-stat-card">
                    <div className="notif-v2-stat-icon" style={{ backgroundColor: '#fce4ec' }}>
                        <i className="bi bi-person-plus-fill" style={{ color: '#c2185b' }}></i>
                    </div>
                    <div>
                        <div className="notif-v2-stat-number">{stats.apply}</div>
                        <div className="notif-v2-stat-label">待審核申請</div>
                    </div>
                </div>
                <div className="notif-v2-stat-card">
                    <div className="notif-v2-stat-icon" style={{ backgroundColor: '#e8f5e9' }}>
                        <i className="bi bi-chat-dots-fill" style={{ color: '#388e3c' }}></i>
                    </div>
                    <div>
                        <div className="notif-v2-stat-number">{stats.message}</div>
                        <div className="notif-v2-stat-label">未讀私訊</div>
                    </div>
                </div>
            </div>

            {/* 篩選工具列 */}
            <div className="notif-v2-toolbar">
                <div className="notif-v2-filters">
                    <button
                        className={`notif-v2-filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        全部
                    </button>
                    <button
                        className={`notif-v2-filter-btn ${filter === 'unread' ? 'active' : ''}`}
                        onClick={() => setFilter('unread')}
                    >
                        未讀 ({stats.unread})
                    </button>
                    <button
                        className={`notif-v2-filter-btn ${filter === 'read' ? 'active' : ''}`}
                        onClick={() => setFilter('read')}
                    >
                        已讀
                    </button>
                </div>

                <div className="notif-v2-actions">
                    {selectedIds.length > 0 && (
                        <>
                            <button
                                className="notif-v2-action-btn danger"
                                onClick={() => deleteNotifications(selectedIds)}
                            >
                                <i className="bi bi-trash"></i>
                                刪除 ({selectedIds.length})
                            </button>
                            <button
                                className="notif-v2-action-btn"
                                onClick={toggleSelectAll}
                            >
                                取消選擇
                            </button>
                        </>
                    )}
                    {selectedIds.length === 0 && (
                        <button
                            className="notif-v2-action-btn"
                            onClick={toggleSelectAll}
                        >
                            <i className="bi bi-check-square"></i>
                            全選
                        </button>
                    )}
                    {stats.unread > 0 && (
                        <button
                            className="notif-v2-action-btn primary"
                            onClick={markAllAsRead}
                        >
                            <i className="bi bi-check-all"></i>
                            全部標為已讀
                        </button>
                    )}
                </div>
            </div>

            {/* 通知列表 */}
            <div className="notif-v2-list">
                {filteredNotifications.length === 0 ? (
                    <div className="notif-v2-empty">
                        <i className="bi bi-inbox"></i>
                        <h5>沒有符合的通知</h5>
                        <p>試試切換其他篩選條件</p>
                    </div>
                ) : (
                    <>
                        {groupedNotifications.today.length > 0 && (
                            <div className="notif-v2-group">
                                <div className="notif-v2-group-title">
                                    <i className="bi bi-calendar-day"></i>
                                    今天
                                </div>
                                {groupedNotifications.today.map(renderNotificationItem)}
                            </div>
                        )}

                        {groupedNotifications.yesterday.length > 0 && (
                            <div className="notif-v2-group">
                                <div className="notif-v2-group-title">
                                    <i className="bi bi-calendar-minus"></i>
                                    昨天
                                </div>
                                {groupedNotifications.yesterday.map(renderNotificationItem)}
                            </div>
                        )}

                        {groupedNotifications.thisWeek.length > 0 && (
                            <div className="notif-v2-group">
                                <div className="notif-v2-group-title">
                                    <i className="bi bi-calendar-week"></i>
                                    本週
                                </div>
                                {groupedNotifications.thisWeek.map(renderNotificationItem)}
                            </div>
                        )}

                        {groupedNotifications.older.length > 0 && (
                            <div className="notif-v2-group">
                                <div className="notif-v2-group-title">
                                    <i className="bi bi-archive"></i>
                                    更早
                                </div>
                                {groupedNotifications.older.map(renderNotificationItem)}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MemberNotifications;
