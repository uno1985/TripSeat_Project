import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import '../assets/css/tripDetail.css';
import { useAuth } from '../contexts/AuthContext';

// API Base URL - 可依環境調整
const API_BASE = 'http://localhost:3001';

function TripDetail() {
    const { id } = useParams();
    const [trip, setTrip] = useState(null);
    const [owner, setOwner] = useState(null);
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pax, setPax] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const { user } = useAuth();
    console.log(user?.name)

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchTripData();
    }, [id]);

    const fetchTripData = async () => {
        setLoading(true);
        setError(null);

        try {
            // 先取得 trip 資料
            const tripRes = await fetch(`${API_BASE}/trips/${id}`);

            if (!tripRes.ok) {
                throw new Error('找不到此旅程');
            }

            const tripData = await tripRes.json();

            // 同時取得 itineraries 和 owner 資料
            const [itineraryRes, ownerRes] = await Promise.all([
                fetch(`${API_BASE}/itineraries?trip_id=${id}`),
                fetch(`${API_BASE}/users/${tripData.owner_id}`)
            ]);

            const itineraryData = await itineraryRes.json();
            const ownerData = ownerRes.ok ? await ownerRes.json() : null;

            setTrip(tripData);
            setItineraries(itineraryData);
            setOwner(ownerData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 格式化日期顯示
    const formatDateRange = (startDate, endDate) => {
        if (!startDate) return '';
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : null;

        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        const formatSingle = (d) => {
            return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}(${weekdays[d.getDay()]})`;
        };

        if (end && start.toDateString() !== end.toDateString()) {
            return `${formatSingle(start)} - ${formatSingle(end)}`;
        }
        return formatSingle(start);
    };

    // 格式化集合時間
    const formatMeetingTime = (startDate, meetingTime) => {
        if (!startDate) return '';
        const d = new Date(startDate);
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        const time = meetingTime || '07:00';
        return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}(${weekdays[d.getDay()]}) ${time}`;
    };

    // 計算倒數時間
    const calculateCountdown = (deadline) => {
        if (!deadline) return '--:--:--';
        const now = new Date();
        const end = new Date(deadline);
        const diff = end - now;

        if (diff <= 0) return '已截止';

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // 根據 day 和 time 排序並格式化行程
    const formatItineraries = (items, startDate) => {
        if (!items || items.length === 0) return [];

        const start = startDate ? new Date(startDate) : new Date();

        return items
            .filter(item => !item.deleted_at)
            .sort((a, b) => {
                if (a.day !== b.day) return a.day - b.day;
                return a.time.localeCompare(b.time);
            })
            .map(item => {
                const itemDate = new Date(start);
                itemDate.setDate(itemDate.getDate() + item.day - 1);
                const month = itemDate.getMonth() + 1;
                const day = itemDate.getDate();

                return {
                    time: `${month}/${day} ${item.time}`,
                    title: item.title,
                    desc: item.note || '',
                    icon: item.icon || null
                };
            });
    };

    // Loading 狀態
    if (loading) {
        return (
            <div className="trip-detail-page">
                <div className="container py-5 text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">載入中...</span>
                    </div>
                    <p className="mt-3 trip-text-gray-600">正在載入旅程資訊...</p>
                </div>
            </div>
        );
    }

    // Error 狀態
    if (error) {
        return (
            <div className="trip-detail-page">
                <div className="container py-5 text-center">
                    <div className="alert alert-warning" role="alert">
                        <h4 className="alert-heading">找不到旅程</h4>
                        <p>{error}</p>
                        <hr />
                        <Link to="/trips" className="btn btn-primary">返回旅程列表</Link>
                    </div>
                </div>
            </div>
        );
    }

    // 資料不存在
    if (!trip) {
        return (
            <div className="trip-detail-page">
                <div className="container py-5 text-center">
                    <p className="trip-text-gray-600">無法載入旅程資料</p>
                </div>
            </div>
        );
    }

    // 準備圖片列表 (主圖 + related_images，最多 5 張)
    const allImages = [
        trip.image_url,
        ...(trip.related_images || [])
    ].filter(Boolean).slice(0, 5);

    // 準備顯示資料
    const t = {
        id: trip.id,
        title: trip.title,
        tags: trip.tags || [],
        info: {
            dates: formatDateRange(trip.start_date, trip.end_date),
            location: trip.location || '未指定',
            transport: trip.transport || '團主開車',
            accommodation: trip.accommodation || '詳見行程說明'
        },
        meeting: {
            location: trip.meeting_point || '詳見說明',
            time: formatMeetingTime(trip.start_date, trip.meeting_time)
        },
        price: trip.price || 0,
        maxPax: trip.max_people || 4,
        currentPax: trip.current_participants || 0,
        countdown: calculateCountdown(trip.deadline),
        host: {
            name: owner?.name || trip.owner_name || '團主',
            badge: (owner?.is_verified_host || trip.owner_is_verified_host) ? '已認證團主' : '小背包客',
            avatar: owner?.avatar || trip.owner_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
            rating: owner?.rating_average || trip.host_rating || 0,
            reviews: owner?.trips_completed || 0,
            bio: owner?.intro || '這位團主尚未填寫自我介紹。',
            isVerified: owner?.is_verified_host || trip.owner_is_verified_host
        },
        description: trip.description || '',
        vibeText: trip.vibe_text || '',
        vibeTags: trip.vibe_tags || [],
        itinerary: formatItineraries(itineraries, trip.start_date),
        images: allImages,
        applicants: Math.max(0, (trip.max_people || 4) - (trip.current_participants || 0))
    };

    return (
        <div className="trip-detail-page">
            <div className="container py-4">

                {/* Breadcrumb */}
                <nav className="breadcrumb-nav mb-3">
                    <span className="trip-text-s trip-text-gray-400">
                        <Link to="/" className="text-decoration-none trip-text-gray-400">首頁</Link>
                        {' / '}
                        <Link to="/trips" className="text-decoration-none trip-text-gray-400">探索旅程</Link>
                        {' / '}
                        <span className="trip-text-gray-800">{t.title}</span>
                    </span>
                </nav>

                {/* Title & Tags */}
                <div className="trip-header mb-4">
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            <h1 className="h2 mb-3 trip-text-gray-800">{t.title}</h1>
                            <div className="trip-tags">
                                {t.tags.map(tag => (
                                    <span key={tag} className="trip-tag-pill">{tag}</span>
                                ))}
                            </div>
                        </div>
                        {trip.owner_id === user?.id && <a href="#" className="link-m trip-text-gray-600 edit-link">編輯旅程</a>}

                    </div>
                </div>

                {/* Main Layout - Two Columns */}
                <div className="row g-4">

                    {/* LEFT COLUMN */}
                    <div className="col-lg-8">

                        {/* 旅程資訊 Section */}
                        <div className="section-block mb-4">
                            <h3 className="section-title trip-text-gray-800 mb-3">旅程資訊</h3>
                            <div className="info-card">
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">出發日期</span>
                                        <span className="info-value trip-text-s trip-text-gray-800">{t.info.dates}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">出發地區</span>
                                        <span className="info-value trip-text-s trip-text-gray-800">{t.info.location}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">交通方式</span>
                                        <span className="info-value trip-text-s trip-text-gray-800">{t.info.transport}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">住宿地點</span>
                                        <span className="info-value trip-text-s trip-text-gray-800">{t.info.accommodation}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gallery - 可點擊切換主圖 */}
                        {t.images.length > 0 && (
                            <div className="gallery-section mb-4">
                                {/* 主圖 */}
                                <div className="hero-image-wrapper">
                                    <img
                                        src={t.images[selectedImageIndex]}
                                        alt="主圖"
                                        className="hero-image"
                                    />
                                </div>
                                {/* 縮圖列表 (最多 5 張，包含主圖) */}
                                {t.images.length > 1 && (
                                    <div className="thumbnail-strip">
                                        {t.images.map((img, idx) => (
                                            <div
                                                key={idx}
                                                className={`thumbnail-item ${idx === selectedImageIndex ? 'active' : ''}`}
                                                onClick={() => setSelectedImageIndex(idx)}
                                            >
                                                <img src={img} alt={`縮圖 ${idx + 1}`} className="thumbnail-image" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 關於這趟旅行 */}
                        <div className="section-block about-section mb-4">
                            <h3 className="section-title trip-text-gray-800 mb-3">關於這趟旅行</h3>
                            <p className="trip-text-m trip-text-gray-600 mb-4" style={{ whiteSpace: 'pre-line' }}>{t.description}</p>

                            {/* Quote Box - 氛圍 Vibe */}
                            {t.vibeText && (
                                <div className="quote-box mb-4">
                                    <span className="quote-mark quote-left">❝</span>
                                    <div className="quote-content">
                                        <span className="trip-text-m trip-text-gray-800 fw-bold">氛圍Vibe</span>
                                        <span className="trip-text-m trip-text-gray-600"> - {t.vibeText}</span>
                                    </div>
                                    <span className="quote-mark quote-right">❞</span>
                                </div>
                            )}

                            {/* Feature Pills - vibe_tags */}
                            {t.vibeTags.length > 0 && (
                                <div className="feature-pills">
                                    {t.vibeTags.map((tag, idx) => (
                                        <span key={idx} className="feature-pill">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 行程規劃 */}
                        {t.itinerary.length > 0 && (
                            <div className="section-block itinerary-section">
                                <h3 className="section-title trip-text-gray-800 mb-4">行程規劃</h3>
                                <div className="timeline-container">
                                    {t.itinerary.map((item, idx) => (
                                        <div key={idx} className={`timeline-item ${idx === t.itinerary.length - 1 ? 'last' : ''}`}>
                                            <div className="timeline-marker">
                                                <div className="timeline-dot">
                                                    {item.icon && <span className="timeline-icon">{item.icon}</span>}
                                                </div>
                                                {idx !== t.itinerary.length - 1 && <div className="timeline-line"></div>}
                                            </div>
                                            <div className="timeline-content">
                                                <span className="time-badge">{item.time}</span>
                                                <h4 className="timeline-title trip-text-gray-800">{item.title}</h4>
                                                {item.desc && (
                                                    <p className="timeline-desc trip-text-s trip-text-gray-600">{item.desc}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* RIGHT COLUMN (SIDEBAR) */}
                    <div className="col-lg-4">
                        <div className="sticky-sidebar">

                            {/* 集合資訊 */}
                            <div className="section-block mb-4">
                                <h3 className="section-title trip-text-gray-800 mb-3">集合資訊</h3>
                                <div className="sidebar-card meeting-card">
                                    <div className="meeting-info">
                                        <div className="meeting-item">
                                            <span className="info-label">集合地點</span>
                                            <span className="info-value trip-text-s trip-text-gray-800">{t.meeting.location}</span>
                                        </div>
                                        <div className="meeting-item">
                                            <span className="info-label">集合時間</span>
                                            <span className="info-value trip-text-s trip-text-gray-800">{t.meeting.time}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Card */}
                            <div className="sidebar-card booking-card mb-4">
                                {/* Price & Countdown */}
                                <div className="booking-boxes mb-3">
                                    <div className="booking-box">
                                        <div className="box-label">預估平攤費用：</div>
                                        <div className="box-value">
                                            <span className="price-symbol">$</span>
                                            <span className="price-amount">{t.price.toLocaleString()}</span>
                                            <span className="price-unit">/人</span>
                                        </div>
                                    </div>
                                    <div className="booking-box">
                                        <div className="box-label">剩餘時間：</div>
                                        <div className="box-value countdown">{t.countdown}</div>
                                    </div>
                                </div>

                                <p className="booking-note trip-text-s trip-text-gray-400 mb-4">
                                    以上為預估費用，實際費用以團主公告為準。
                                </p>

                                {/* Seats Info */}
                                <div className="booking-row mb-3">
                                    <div className="booking-row-label">
                                        <span className="row-icon">👥</span>
                                        <span className="trip-text-m trip-text-gray-600 fw-bold">剩餘座位</span>
                                    </div>
                                    <div className="booking-row-value">
                                        <span className="seats-current">{t.currentPax}</span>
                                        <span className="seats-separator">/</span>
                                        <span className="seats-max">{t.maxPax}個</span>
                                    </div>
                                </div>

                                {/* Pax Selector */}
                                <div className="booking-row mb-4">
                                    <div className="booking-row-label">
                                        <span className="row-icon">👤</span>
                                        <span className="trip-text-m trip-text-gray-600 fw-bold">我有</span>
                                    </div>
                                    <div className="booking-row-value">
                                        <div className="pax-stepper">
                                            <button
                                                className="stepper-btn"
                                                type="button"
                                                onClick={() => setPax(Math.max(1, pax - 1))}
                                            >−</button>
                                            <span className="stepper-value">{pax}</span>
                                            <button
                                                className="stepper-btn"
                                                type="button"
                                                onClick={() => setPax(Math.min(t.maxPax - t.currentPax, pax + 1))}
                                            >+</button>
                                        </div>
                                        <span className="trip-text-m trip-text-gray-600">人</span>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <button className="trip-btn-primary trip-btn-l cta-button">
                                    申請加入旅程
                                </button>
                            </div>

                            {/* Host Card */}
                            <div className="sidebar-card host-card mb-4">
                                <div className="host-header mb-3">
                                    <img src={t.host.avatar} alt={t.host.name} className="host-avatar" />
                                    <div className="host-info">
                                        <div className="host-name-row">
                                            <span className="host-name">{t.host.name}</span>
                                            <span className="host-badge">{t.host.badge}</span>
                                        </div>
                                        <div className="host-rating trip-text-s trip-text-gray-400">
                                            <span className="star">★</span> {t.host.rating} ({t.host.reviews} 趟旅程)
                                        </div>
                                    </div>
                                </div>
                                <p className="host-bio trip-text-s trip-text-gray-600 mb-4">{t.host.bio}</p>

                                {/* 過往旅程記憶 */}
                                <h6 className="subsection-title trip-text-gray-400 mb-3">過往旅程記憶</h6>
                                <div className="memory-gallery mb-4">
                                    <div className="memory-item placeholder">
                                        <div className="placeholder-icon">
                                            <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                                                <path d="M28 0H4C1.79 0 0 1.79 0 4V20C0 22.21 1.79 24 4 24H28C30.21 24 32 22.21 32 20V4C32 1.79 30.21 0 28 0ZM4 20V4H28L28.01 20H4Z" fill="#D4D4D4" />
                                                <circle cx="8" cy="8" r="2" fill="#D4D4D4" />
                                                <path d="M24 16H8L12 10L15 14L18 10L24 16Z" fill="#D4D4D4" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="memory-item placeholder">
                                        <div className="placeholder-icon">
                                            <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                                                <path d="M28 0H4C1.79 0 0 1.79 0 4V20C0 22.21 1.79 24 4 24H28C30.21 24 32 22.21 32 20V4C32 1.79 30.21 0 28 0ZM4 20V4H28L28.01 20H4Z" fill="#D4D4D4" />
                                                <circle cx="8" cy="8" r="2" fill="#D4D4D4" />
                                                <path d="M24 16H8L12 10L15 14L18 10L24 16Z" fill="#D4D4D4" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="memory-item placeholder">
                                        <div className="placeholder-icon">
                                            <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                                                <path d="M28 0H4C1.79 0 0 1.79 0 4V20C0 22.21 1.79 24 4 24H28C30.21 24 32 22.21 32 20V4C32 1.79 30.21 0 28 0ZM4 20V4H28L28.01 20H4Z" fill="#D4D4D4" />
                                                <circle cx="8" cy="8" r="2" fill="#D4D4D4" />
                                                <path d="M24 16H8L12 10L15 14L18 10L24 16Z" fill="#D4D4D4" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Verified Badge Button */}
                                {t.host.isVerified ? (
                                    <button className="verified-btn">
                                        <span className="verified-icon">🛡️</span> 已認證 真安心團主
                                    </button>
                                ) : null}
                            </div>

                            {/* Applicants Card */}
                            {trip.owner_id === user?.id && <>
                                <div className="sidebar-card applicants-card">
                                    <h5 className="subsection-title trip-text-gray-600 mb-3">申請加入名單</h5>
                                    <div className="applicants-row">
                                        <div className="applicants-avatars">
                                            <div className="applicant-avatar placeholder-avatar"></div>
                                            <div className="applicant-avatar placeholder-avatar"></div>
                                        </div>
                                        <span className="applicants-count trip-text-s trip-text-gray-400">
                                            已有 {t.applicants} 位乘客申請加入
                                        </span>
                                        <button className="manage-btn">管理</button>
                                    </div>
                                </div>
                            </>}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TripDetail;
