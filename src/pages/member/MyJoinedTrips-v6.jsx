/**
 * 📍 目標位置：src/pages/member/MyJoinedTrips.jsx
 * 📝 我參加的旅程 v6 - 時間軸沉浸式設計
 *
 * 🌟 v6 革新概念：
 *   - 垂直時間軸佈局（過去 → 現在 → 未來）
 *   - Hero 大卡片突出即將出發的旅程
 *   - 左側時間點標記 + 右側卡片內容
 *   - 動態倒數計時器（即將出發）
 *   - 旅伴頭像群組顯示
 *   - 可展開/收合的心得內容
 *   - 視覺化狀態連接線
 *   - 照片輪播預覽
 *   - 成就徽章系統
 *   - 極致沉浸式視覺體驗
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/myJoinedTrips-v6.css';

const MyJoinedTrips = () => {
    const [expandedReview, setExpandedReview] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    // 每分鐘更新一次時間（用於倒數計時）
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const joinedTrips = [
        {
            id: 1,
            status: '即將出發',
            statusType: 'upcoming',
            title: '綠島石朗潛水團',
            date: '2026/01/15 - 01/17',
            startDate: '2026-01-15T08:00:00',
            location: '台東縣 綠島鄉',
            images: [
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&fit=crop',
                'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&fit=crop',
                'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=800&fit=crop',
            ],
            host: '潛水員阿強',
            hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
            participants: 4,
            maxPeople: 4,
            companions: [
                { name: '小美', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
                { name: '大明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike' },
                { name: '阿華', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' },
            ],
            review: null,
            rating: null,
            tags: ['潛水', '海島', '攝影'],
            achievement: null,
        },
        {
            id: 2,
            status: '招募中',
            statusType: 'open',
            title: '台南美食散步 | 古蹟巡禮一日遊',
            date: '2026/02/20',
            startDate: '2026-02-20T09:00:00',
            location: '台南市 中西區',
            images: [
                'https://images.unsplash.com/photo-1555992336-fb0d29498b13?q=80&w=800&fit=crop',
            ],
            host: '露營女孩艾琳',
            hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=irene',
            participants: 3,
            maxPeople: 8,
            companions: [
                { name: '小雲', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cloud' },
                { name: '阿傑', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jack' },
            ],
            review: null,
            rating: null,
            tags: ['美食', '文化', '輕旅行'],
            achievement: null,
        },
        {
            id: 3,
            status: '已結束',
            statusType: 'ended',
            title: '2026 跨年 101 煙火團',
            date: '2025/12/31',
            startDate: '2025-12-31T22:00:00',
            location: '台北市 信義區',
            images: [
                'https://images.unsplash.com/photo-1505935428862-770b6f24f629?q=80&w=800&fit=crop',
            ],
            host: '小明愛旅行',
            hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ming',
            participants: 10,
            maxPeople: 10,
            companions: Array(9).fill(null).map((_, i) => ({
                name: `旅伴${i + 1}`,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`,
            })),
            review: '超棒的跨年體驗！101 煙火真的太壯觀了，大家一起倒數的感覺超級嗨～團主安排得很好，集合地點很方便，推薦！整個活動從晚上10點開始，大家先在附近餐廳聚餐認識彼此，然後一起走到最佳觀賞點。煙火施放時全場歡呼，那種氛圍真的難以忘懷。',
            rating: 5,
            tags: ['跨年', '煙火', '城市'],
            achievement: '🎉 跨年達人',
        },
        {
            id: 4,
            status: '已結束',
            statusType: 'ended',
            title: '合歡山北峰攻頂團',
            date: '2025/12/20 - 12/21',
            startDate: '2025-12-20T05:00:00',
            location: '南投縣 仁愛鄉',
            images: [
                'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&fit=crop',
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&fit=crop',
            ],
            host: '老司機大龍',
            hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dragon',
            participants: 6,
            maxPeople: 6,
            companions: Array(5).fill(null).map((_, i) => ({
                name: `登山客${i + 1}`,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=hiker${i}`,
            })),
            review: null,
            rating: null,
            tags: ['登山', '百岳', '挑戰'],
            achievement: '⛰️ 百岳新手',
        },
    ];

    // 計算倒數時間
    const getCountdown = (startDateStr) => {
        const start = new Date(startDateStr);
        const diff = start - currentTime;

        if (diff <= 0) return null;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) return `${days} 天 ${hours} 小時`;
        return `${hours} 小時`;
    };

    // 按時間排序（最近的在前）
    const sortedTrips = [...joinedTrips].sort((a, b) =>
        new Date(b.startDate) - new Date(a.startDate)
    );

    // 找出下一個即將出發的旅程
    const upcomingTrip = sortedTrips.find(trip => trip.statusType === 'upcoming');

    return (
        <div className="my-joined-v6 my-5">
            {/* 標題區 */}
            <div className="v6-header">
                <div className="v6-header-content">
                    <div className="v6-icon-badge">
                        <i className="bi bi-compass-fill"></i>
                    </div>
                    <div>
                        <h3 className="h3 mb-1">我的旅程時光</h3>
                        <p className="trip-text-s trip-text-gray-400 mb-0">
                            每一段旅程，都是一個故事
                        </p>
                    </div>
                </div>
                <Link to="/member/trips" className="v6-header-link">
                    <span>查看全部</span>
                    <i className="bi bi-arrow-right"></i>
                </Link>
            </div>

            {/* Hero 卡片 - 即將出發的旅程 */}
            {upcomingTrip && (
                <div className="v6-hero-card">
                    <div className="v6-hero-images">
                        {upcomingTrip.images.slice(0, 3).map((img, idx) => (
                            <div
                                key={idx}
                                className="v6-hero-img"
                                style={{
                                    backgroundImage: `url(${img})`,
                                    zIndex: 3 - idx,
                                    transform: `translateX(${idx * 8}px) rotate(${idx * 2}deg)`,
                                }}
                            ></div>
                        ))}
                    </div>
                    <div className="v6-hero-content">
                        <div className="v6-hero-label">
                            <i className="bi bi-rocket-takeoff-fill"></i>
                            <span>即將出發</span>
                        </div>
                        <h4 className="v6-hero-title">{upcomingTrip.title}</h4>
                        <div className="v6-hero-meta">
                            <span><i className="bi bi-calendar-event"></i> {upcomingTrip.date}</span>
                            <span><i className="bi bi-geo-alt-fill"></i> {upcomingTrip.location}</span>
                        </div>
                        {getCountdown(upcomingTrip.startDate) && (
                            <div className="v6-hero-countdown">
                                <i className="bi bi-hourglass-split"></i>
                                <span>還有 {getCountdown(upcomingTrip.startDate)}</span>
                            </div>
                        )}
                        <div className="v6-hero-actions">
                            <Link to={`/trips/${upcomingTrip.id}`} className="v6-hero-btn primary">
                                <i className="bi bi-eye-fill"></i>
                                查看詳情
                            </Link>
                            <button className="v6-hero-btn secondary">
                                <i className="bi bi-chat-dots-fill"></i>
                                聯絡團主
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 時間軸 */}
            <div className="v6-timeline">
                <div className="v6-timeline-label">
                    <i className="bi bi-clock-history"></i>
                    <span>旅程時間軸</span>
                </div>

                {sortedTrips.map((trip, index) => (
                    <div key={trip.id} className={`v6-timeline-item ${trip.statusType}`}>
                        {/* 時間點 */}
                        <div className="v6-timeline-marker">
                            <div className="v6-timeline-dot">
                                {trip.statusType === 'upcoming' && <i className="bi bi-star-fill"></i>}
                                {trip.statusType === 'open' && <i className="bi bi-circle-fill"></i>}
                                {trip.statusType === 'ended' && <i className="bi bi-check-circle-fill"></i>}
                            </div>
                            {index < sortedTrips.length - 1 && <div className="v6-timeline-line"></div>}
                        </div>

                        {/* 卡片內容 */}
                        <div className="v6-timeline-card">
                            {/* 圖片區 */}
                            <div className="v6-card-images">
                                <img src={trip.images[0]} alt={trip.title} className="v6-card-main-img" />
                                {trip.images.length > 1 && (
                                    <div className="v6-card-img-count">
                                        <i className="bi bi-images"></i>
                                        <span>{trip.images.length}</span>
                                    </div>
                                )}
                                <div className={`v6-card-status-badge ${trip.statusType}`}>
                                    {trip.status}
                                </div>
                                {trip.achievement && (
                                    <div className="v6-card-achievement">
                                        {trip.achievement}
                                    </div>
                                )}
                            </div>

                            {/* 資訊區 */}
                            <div className="v6-card-body">
                                <div className="v6-card-header">
                                    <h5 className="v6-card-title">{trip.title}</h5>
                                    <div className="v6-card-tags">
                                        {trip.tags.map(tag => (
                                            <span key={tag} className="v6-tag">#{tag}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="v6-card-meta">
                                    <span><i className="bi bi-calendar3"></i> {trip.date}</span>
                                    <span><i className="bi bi-geo-alt"></i> {trip.location}</span>
                                </div>

                                {/* 團主與旅伴 */}
                                <div className="v6-card-people">
                                    <div className="v6-card-host">
                                        <img src={trip.hostAvatar} alt={trip.host} />
                                        <div>
                                            <span className="v6-host-label">團主</span>
                                            <span className="v6-host-name">{trip.host}</span>
                                        </div>
                                    </div>
                                    <div className="v6-card-companions">
                                        <span className="v6-companions-label">同行旅伴</span>
                                        <div className="v6-companions-avatars">
                                            {trip.companions.slice(0, 5).map((companion, idx) => (
                                                <img
                                                    key={idx}
                                                    src={companion.avatar}
                                                    alt={companion.name}
                                                    title={companion.name}
                                                />
                                            ))}
                                            {trip.companions.length > 5 && (
                                                <span className="v6-companions-more">
                                                    +{trip.companions.length - 5}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 人數進度 */}
                                <div className="v6-card-progress">
                                    <div className="v6-progress-info">
                                        <span className="v6-progress-label">成團進度</span>
                                        <span className="v6-progress-number">
                                            {trip.participants}/{trip.maxPeople} 人
                                        </span>
                                    </div>
                                    <div className="v6-progress-bar">
                                        <div
                                            className="v6-progress-fill"
                                            style={{ width: `${(trip.participants / trip.maxPeople) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* 心得區（已結束） */}
                                {trip.statusType === 'ended' && (
                                    <div className="v6-card-review">
                                        <div className="v6-review-header">
                                            <div className="v6-review-title">
                                                <i className="bi bi-chat-quote-fill"></i>
                                                <span>旅行心得</span>
                                            </div>
                                            {trip.rating && (
                                                <div className="v6-review-rating">
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
                                            <>
                                                <p className={`v6-review-text ${expandedReview === trip.id ? 'expanded' : ''}`}>
                                                    {trip.review}
                                                </p>
                                                {trip.review.length > 100 && (
                                                    <button
                                                        className="v6-review-toggle"
                                                        onClick={() => setExpandedReview(
                                                            expandedReview === trip.id ? null : trip.id
                                                        )}
                                                    >
                                                        {expandedReview === trip.id ? '收合' : '展開全文'}
                                                        <i className={`bi bi-chevron-${expandedReview === trip.id ? 'up' : 'down'}`}></i>
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <p className="v6-review-empty">
                                                <i className="bi bi-pencil-square"></i>
                                                還沒有撰寫心得，分享你的精彩回憶吧！
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* 操作按鈕 */}
                                <div className="v6-card-actions">
                                    <Link to={`/trips/${trip.id}`} className="v6-action-btn primary">
                                        <i className="bi bi-box-arrow-up-right"></i>
                                        查看詳情
                                    </Link>
                                    {trip.statusType === 'ended' && !trip.review && (
                                        <button className="v6-action-btn accent">
                                            <i className="bi bi-plus-circle"></i>
                                            新增心得
                                        </button>
                                    )}
                                    {trip.statusType === 'ended' && trip.review && (
                                        <button className="v6-action-btn ghost">
                                            <i className="bi bi-pencil"></i>
                                            編輯心得
                                        </button>
                                    )}
                                    {(trip.statusType === 'upcoming' || trip.statusType === 'open') && (
                                        <button className="v6-action-btn ghost">
                                            <i className="bi bi-share"></i>
                                            分享旅程
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 底部統計 */}
            <div className="v6-footer-stats">
                <div className="v6-stat-item">
                    <div className="v6-stat-number">{joinedTrips.length}</div>
                    <div className="v6-stat-label">總旅程數</div>
                </div>
                <div className="v6-stat-item">
                    <div className="v6-stat-number">
                        {joinedTrips.filter(t => t.statusType === 'ended').length}
                    </div>
                    <div className="v6-stat-label">已完成</div>
                </div>
                <div className="v6-stat-item">
                    <div className="v6-stat-number">
                        {joinedTrips.filter(t => t.review).length}
                    </div>
                    <div className="v6-stat-label">已分享心得</div>
                </div>
            </div>
        </div>
    );
};

export default MyJoinedTrips;
