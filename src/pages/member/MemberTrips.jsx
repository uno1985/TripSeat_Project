

import { Link } from 'react-router-dom';
import '../../assets/css/memberTrips.css';

const MemberTrips = () => {
    const trips = [
        {
            id: 1,
            status: '招募中',
            statusType: 'open',
            title: '台南美食散步 | 古蹟巡禮一日遊',
            date: '2026/02/20',
            location: '台南市 中西區',
            image: 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=400&h=300&fit=crop&q=80',
            host: '露營女孩艾琳',
            hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=irene',
            participants: 3,
            maxPeople: 8,
            review: null,
        },
        {
            id: 2,
            status: '已成團',
            statusType: 'confirmed',
            title: '綠島石朗潛水團',
            date: '2026/01/15 - 01/17',
            location: '台東縣 綠島鄉',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&q=80',
            host: '潛水員阿強',
            hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
            participants: 4,
            maxPeople: 4,
            review: null,
        },
        {
            id: 3,
            status: '已結束',
            statusType: 'ended',
            title: '2026 跨年 101 煙火團',
            date: '2025/12/31',
            location: '台北市 信義區',
            image: 'https://images.unsplash.com/photo-1505935428862-770b6f24f629?w=400&h=300&fit=crop&q=80',
            host: '小明愛旅行',
            hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ming',
            participants: 10,
            maxPeople: 10,
            review: '超棒的跨年體驗！101 煙火真的太壯觀了，大家一起倒數的感覺超級嗨～團主安排得很好，集合地點很方便，推薦！',
        },
        {
            id: 4,
            status: '已結束',
            statusType: 'ended',
            title: '合歡山北峰攻頂團',
            date: '2025/12/20 - 12/21',
            location: '南投縣 仁愛鄉',
            image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop&q=80',
            host: '老司機大龍',
            hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dragon',
            participants: 6,
            maxPeople: 6,
            review: null,
        },
        {
            id: 5,
            status: '已成團',
            statusType: 'confirmed',
            title: '2026 春季花蓮慢旅行',
            date: '2026/03/15 - 03/17',
            location: '花蓮縣 秀林鄉',
            image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=400&h=300&fit=crop&q=80',
            host: '小明愛旅行',
            hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ming',
            participants: 5,
            maxPeople: 6,
            review: null,
        },
    ];

    return (
        <div className="member-trips-page">

            {/* ===== 頁面標題 ===== */}
            <div className="member-trips-header mb-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <h2 className="h3 trip-text-gray-800">
                            <i className="bi bi-compass me-2 trip-text-primary-800"></i>
                            我的旅程
                        </h2>
                        <p className="trip-text-m trip-text-gray-400 mt-1 mb-0">
                            查看所有你參加的旅程及心得紀錄
                        </p>
                    </div>
                </div>
            </div>

            {/* ===== 統計摘要 ===== */}
            <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                    <div className="member-trips-stat-card">
                        <div className="member-trips-stat-number">5</div>
                        <div className="member-trips-stat-label">全部旅程</div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="member-trips-stat-card">
                        <div className="member-trips-stat-number trip-text-primary-1000">1</div>
                        <div className="member-trips-stat-label">招募中</div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="member-trips-stat-card">
                        <div className="member-trips-stat-number" style={{ color: 'var(--trip-color-status-success)' }}>2</div>
                        <div className="member-trips-stat-label">已成團</div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="member-trips-stat-card">
                        <div className="member-trips-stat-number trip-text-gray-400">2</div>
                        <div className="member-trips-stat-label">已結束</div>
                    </div>
                </div>
            </div>

            {/* ===== 篩選列 ===== */}
            <div className="member-trips-filter-bar mb-4">
                <button className="member-trips-filter-btn active">全部</button>
                <button className="member-trips-filter-btn">招募中</button>
                <button className="member-trips-filter-btn">已成團</button>
                <button className="member-trips-filter-btn">已結束</button>
            </div>

            {/* ===== 旅程卡片列表 ===== */}
            <div className="member-trips-list">
                {trips.map((trip) => (
                    <div
                        key={trip.id}
                        className={`member-trips-card ${trip.statusType === 'ended' ? 'member-trips-card-ended' : ''}`}
                    >
                        <div className="row g-0">
                            {/* 左側封面圖 */}
                            <div className="col-md-3">
                                <div className="member-trips-card-img-wrapper">
                                    <img src={trip.image} alt={trip.title} className="member-trips-card-img" />
                                    <span className={`member-trips-status-badge member-trips-status-${trip.statusType}`}>
                                        {trip.status}
                                    </span>
                                </div>
                            </div>

                            {/* 右側資訊區 */}
                            <div className="col-md-9">
                                <div className="member-trips-card-body">
                                    {/* 標題列 */}
                                    <div className="d-flex justify-content-between align-items-start mb-1">
                                        <h5 className="member-trips-card-title">{trip.title}</h5>
                                        <span className={`member-trips-status-pill member-trips-pill-${trip.statusType}`}>
                                            {trip.status}
                                        </span>
                                    </div>

                                    {/* 資訊列 */}
                                    <div className="member-trips-card-info">
                                        <span><i className="bi bi-calendar3 me-1"></i>{trip.date}</span>
                                        <span><i className="bi bi-geo-alt me-1"></i>{trip.location}</span>
                                        <span><i className="bi bi-people me-1"></i>{trip.participants} / {trip.maxPeople} 人</span>
                                    </div>

                                    {/* 團主資訊 */}
                                    <div className="member-trips-host">
                                        <img src={trip.hostAvatar} alt={trip.host} className="member-trips-host-avatar" />
                                        <span>團主：{trip.host}</span>
                                    </div>

                                    {/* 心得區塊 */}
                                    <div className="member-trips-review-section">
                                        <div className="member-trips-review-header">
                                            <i className="bi bi-chat-left-text me-1"></i>
                                            <span>旅行心得</span>
                                        </div>
                                        {trip.review ? (
                                            <div className="member-trips-review-content">
                                                <p className="member-trips-review-text">{trip.review}</p>
                                                <button className="btn btn-sm member-trips-btn-edit-review">
                                                    <i className="bi bi-pencil me-1"></i>編輯心得
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="member-trips-review-empty">
                                                {trip.statusType === 'ended' ? (
                                                    <span className="member-trips-review-placeholder">
                                                        <i className="bi bi-journal-text me-1"></i>尚無心得，分享你的旅行回憶吧！
                                                    </span>
                                                ) : (
                                                    <span className="member-trips-review-placeholder">
                                                        <i className="bi bi-hourglass-split me-1"></i>旅程結束後即可撰寫心得
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* 底部操作按鈕 */}
                                    <div className="member-trips-card-footer">
                                        <Link to={`/trips/${trip.id}`} className="btn btn-sm member-trips-btn-detail">
                                            <i className="bi bi-eye me-1"></i>查看細節
                                        </Link>
                                        {trip.statusType === 'ended' && !trip.review && (
                                            <button className="btn btn-sm member-trips-btn-add-review">
                                                <i className="bi bi-plus-lg me-1"></i>新增心得
                                            </button>
                                        )}
                                        {trip.statusType === 'open' && (
                                            <button className="btn btn-sm member-trips-btn-cancel-join">
                                                <i className="bi bi-x-circle me-1"></i>取消參加
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ===== 空狀態（當沒有旅程時顯示） ===== */}
            {/*
            <div className="member-trips-empty">
                <i className="bi bi-compass"></i>
                <h5>還沒有參加的旅程</h5>
                <p>去探索有趣的揪團，開始你的旅程吧！</p>
                <Link to="/trips" className="btn trip-btn-m trip-btn-primary">
                    <i className="bi bi-search me-2"></i>探索旅程
                </Link>
            </div>
            */}

        </div>
    );
};

export default MemberTrips;
