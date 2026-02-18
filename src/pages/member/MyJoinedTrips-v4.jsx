/**
 * 📍 目標位置：src/pages/member/MyJoinedTrips.jsx
 * 📝 我參加的旅程 v4 - 全新設計版本
 *
 * ✨ v4 重點升級：
 *   - 採用網格卡片佈局（桌面 2 列 / 手機 1 列）
 *   - 新增狀態快速篩選標籤
 *   - 優化視覺層次與配色
 *   - 圖片區加入漸層遮罩提升質感
 *   - 心得卡片獨立區塊，更突出
 *   - 加入旅程評分顯示（已結束）
 *   - 操作按鈕更直觀、分組清晰
 *   - 響應式優化，手機體驗更好
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/myJoinedTrips-v4.css';

const MyJoinedTrips = () => {
    const [activeFilter, setActiveFilter] = useState('all');

    const joinedTrips = [
        {
            id: 1,
            status: '即將出發',
            statusType: 'upcoming',
            title: '綠島石朗潛水團',
            date: '2026/01/15 - 01/17',
            location: '台東縣 綠島鄉',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&fit=crop',
            host: '潛水員阿強',
            hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
            participants: 4,
            maxPeople: 4,
            review: null,
            rating: null,
            daysLeft: 12,
        },
        {
            id: 2,
            status: '招募中',
            statusType: 'open',
            title: '台南美食散步 | 古蹟巡禮一日遊',
            date: '2026/02/20',
            location: '台南市 中西區',
            image: 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?q=80&w=800&fit=crop',
            host: '露營女孩艾琳',
            hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=irene',
            participants: 3,
            maxPeople: 8,
            review: null,
            rating: null,
            daysLeft: 45,
        },
        {
            id: 3,
            status: '已結束',
            statusType: 'ended',
            title: '2026 跨年 101 煙火團',
            date: '2025/12/31',
            location: '台北市 信義區',
            image: 'https://images.unsplash.com/photo-1505935428862-770b6f24f629?q=80&w=800&fit=crop',
            host: '小明愛旅行',
            hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ming',
            participants: 10,
            maxPeople: 10,
            review: '超棒的跨年體驗！101 煙火真的太壯觀了，大家一起倒數的感覺超級嗨～團主安排得很好，推薦！',
            rating: 5,
            daysLeft: null,
        },
        {
            id: 4,
            status: '已結束',
            statusType: 'ended',
            title: '合歡山北峰攻頂團',
            date: '2025/12/20 - 12/21',
            location: '南投縣 仁愛鄉',
            image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&fit=crop',
            host: '老司機大龍',
            hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dragon',
            participants: 6,
            maxPeople: 6,
            review: null,
            rating: null,
            daysLeft: null,
        },
    ];

    const statusFilters = [
        { key: 'all', label: '全部', count: joinedTrips.length },
        { key: 'upcoming', label: '即將出發', count: joinedTrips.filter(t => t.statusType === 'upcoming').length },
        { key: 'open', label: '招募中', count: joinedTrips.filter(t => t.statusType === 'open').length },
        { key: 'ended', label: '已結束', count: joinedTrips.filter(t => t.statusType === 'ended').length },
    ];

    const filteredTrips = activeFilter === 'all'
        ? joinedTrips
        : joinedTrips.filter(trip => trip.statusType === activeFilter);

    return (
        <div className="my-joined-v4 my-5">
            {/* 標題列 */}
            <div className="joined-v4-header">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h3 className="h3 mb-1">我參加的旅程</h3>
                        <p className="trip-text-s trip-text-gray-400 mb-0">
                            {joinedTrips.length} 個旅程 · {joinedTrips.filter(t => t.statusType === 'ended').length} 個已完成
                        </p>
                    </div>
                    <Link to="/member/trips" className="trip-text-m link-m link-underline-gray-600">
                        查看全部
                    </Link>
                </div>

                {/* 狀態篩選標籤 */}
                <div className="joined-v4-filters">
                    {statusFilters.map(filter => (
                        <button
                            key={filter.key}
                            className={`joined-v4-filter-tag ${activeFilter === filter.key ? 'active' : ''}`}
                            onClick={() => setActiveFilter(filter.key)}
                        >
                            {filter.label}
                            <span className="joined-v4-filter-count">{filter.count}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 卡片網格 */}
            <div className="joined-v4-grid">
                {filteredTrips.map((trip) => (
                    <div key={trip.id} className={`joined-v4-card ${trip.statusType}`}>
                        {/* 圖片區 */}
                        <div className="joined-v4-image-section">
                            <img src={trip.image} alt={trip.title} className="joined-v4-img" />
                            <div className="joined-v4-image-overlay">
                                <span className={`joined-v4-badge badge-${trip.statusType}`}>
                                    {trip.status}
                                </span>
                                {trip.daysLeft && (
                                    <span className="joined-v4-countdown">
                                        <i className="bi bi-clock"></i> 還有 {trip.daysLeft} 天
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* 資訊區 */}
                        <div className="joined-v4-body">
                            {/* 標題 */}
                            <h5 className="joined-v4-title">{trip.title}</h5>

                            {/* 基本資訊 */}
                            <div className="joined-v4-meta">
                                <span>
                                    <i className="bi bi-calendar3"></i>
                                    {trip.date}
                                </span>
                                <span>
                                    <i className="bi bi-geo-alt"></i>
                                    {trip.location}
                                </span>
                            </div>

                            {/* 團主與人數 */}
                            <div className="joined-v4-info-row">
                                <div className="joined-v4-host">
                                    <img src={trip.hostAvatar} alt={trip.host} />
                                    <span>{trip.host}</span>
                                </div>
                                <div className="joined-v4-participants">
                                    <i className="bi bi-people-fill"></i>
                                    <span>{trip.participants}/{trip.maxPeople}</span>
                                </div>
                            </div>

                            {/* 人數進度條 */}
                            <div className="joined-v4-progress">
                                <div
                                    className="joined-v4-progress-fill"
                                    style={{ width: `${(trip.participants / trip.maxPeople) * 100}%` }}
                                ></div>
                            </div>

                            {/* 心得區塊（已結束旅程） */}
                            {trip.statusType === 'ended' && (
                                <div className="joined-v4-review-card">
                                    <div className="joined-v4-review-header">
                                        <i className="bi bi-chat-quote-fill"></i>
                                        <span>旅行心得</span>
                                        {trip.rating && (
                                            <div className="joined-v4-rating">
                                                {[...Array(5)].map((_, i) => (
                                                    <i
                                                        key={i}
                                                        className={`bi bi-star${i < trip.rating ? '-fill' : ''}`}
                                                    ></i>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {trip.review ? (
                                        <p className="joined-v4-review-text">{trip.review}</p>
                                    ) : (
                                        <p className="joined-v4-review-empty">
                                            <i className="bi bi-pencil"></i>
                                            分享你的旅行回憶吧！
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* 操作按鈕 */}
                            <div className="joined-v4-actions">
                                <Link
                                    to={`/trips/${trip.id}`}
                                    className="joined-v4-btn joined-v4-btn-primary"
                                >
                                    <i className="bi bi-eye-fill"></i>
                                    查看詳情
                                </Link>

                                {trip.statusType === 'ended' && !trip.review && (
                                    <button className="joined-v4-btn joined-v4-btn-review">
                                        <i className="bi bi-plus-circle-fill"></i>
                                        新增心得
                                    </button>
                                )}

                                {trip.statusType === 'ended' && trip.review && (
                                    <button className="joined-v4-btn joined-v4-btn-edit">
                                        <i className="bi bi-pencil-fill"></i>
                                        編輯心得
                                    </button>
                                )}

                                {(trip.statusType === 'upcoming' || trip.statusType === 'open') && (
                                    <button className="joined-v4-btn joined-v4-btn-outline">
                                        <i className="bi bi-chat-dots-fill"></i>
                                        聯絡團主
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 空狀態 */}
            {filteredTrips.length === 0 && (
                <div className="joined-v4-empty">
                    <i className="bi bi-compass"></i>
                    <h5>沒有符合的旅程</h5>
                    <p>試試切換其他篩選條件</p>
                </div>
            )}
        </div>
    );
};

export default MyJoinedTrips;
