//導入套件
import { useCallback, useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

//導入元件
import { useAuth } from '../contexts/AuthContext';
import Breadcrumb from '../components/Breadcrumb';

//導入圖片
import shieldCheck from '../assets/images/shield-check.svg';

//導入樣式
import '../assets/css/tripDetail.css';

//API URL
const API_URL = import.meta.env.VITE_API_BASE;

function TripDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [trip, setTrip] = useState(null);
    const [otherTrip, setOtherTrip] = useState(null);
    const [owner, setOwner] = useState(null);
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pax, setPax] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [hasApplied, setHasApplied] = useState(false);
    const [applicationStatus, setApplicationStatus] = useState(null);
    const [tripApplicants, setTripApplicants] = useState([]);
    const [favoriteId, setFavoriteId] = useState(null);
    const [applying, setApplying] = useState(false);
    const [applyMessage, setApplyMessage] = useState('');
    const [joinCheck, setJoinCheck] = useState({ open: false, tripId: null, text: '' });
    const { user } = useAuth();


    const getToken = () =>
        document.cookie
            .split('; ')
            .find((row) => row.startsWith('tripToken='))
            ?.split('=')[1];

    const fetchTripData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // 先取得 trip 資料（:id 失敗時 fallback 用 query 查）
            let tripData = null;
            try {
                const tripRes = await axios.get(`${API_URL}/664/trips/${id}`);
                tripData = tripRes.data;
            } catch (err) {
                const fallbackRes = await axios.get(`${API_URL}/664/trips?id=${encodeURIComponent(id)}`);
                tripData = (fallbackRes.data || [])[0] || null;
                if (!tripData) throw err;
            }

            // 同時用解構方式取得 itineraries 和 owner 資料
            const participantReq = user?.id
                ? axios.get(`${API_URL}/664/participants?trip_id=${tripData.id}&user_id=${user.id}`)
                : Promise.resolve({ data: [] });
            const favoriteReq = user?.id
                ? axios.get(`${API_URL}/664/favorites?trip_id=${tripData.id}&user_id=${user.id}`)
                : Promise.resolve({ data: [] });
            const tripParticipantsReq = axios.get(`${API_URL}/664/participants?trip_id=${tripData.id}`);
            const usersReq = axios.get(`${API_URL}/664/users`);

            const [itineraryRes, ownerRes, otherTripRes, participantRes, tripParticipantsRes, usersRes, favoriteRes] = await Promise.all([
                axios.get(`${API_URL}/664/itineraries?trip_id=${tripData.id}`),
                axios.get(`${API_URL}/664/users/${tripData.owner_id}`),
                axios.get(`${API_URL}/664/trips?owner_id=${tripData.owner_id}`),
                participantReq,
                tripParticipantsReq,
                usersReq,
                favoriteReq,
            ]);


            //刪除目前查詢的ID
            const otherTrip = otherTripRes.data.filter(trip => trip.id !== tripData.id);
            const activeParticipant = (participantRes.data || []).find((row) => !row.deleted_at);
            const joined = Boolean(activeParticipant);
            const joinedStatus = activeParticipant
                ? (activeParticipant.application_status || 'approved')
                : null;
            const activeFavorite = (favoriteRes.data || []).find((row) => !row.deleted_at);
            const userMap = new Map((usersRes.data || []).map((item) => [item.id, item]));
            const applicants = (tripParticipantsRes.data || [])
                .filter(
                    (row) =>
                        !row.deleted_at &&
                        row.role === 'member' &&
                        (row.application_status || 'pending') === 'pending'
                )
                .map((row) => ({
                    id: row.id,
                    userId: row.user_id,
                    name: userMap.get(row.user_id)?.name || '會員',
                    avatar: userMap.get(row.user_id)?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.user_id}`,
                    createdAt: row.created_at || row.updated_at || '',
                }))
                .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

            setTrip(tripData);
            setItineraries(itineraryRes.data);
            setOtherTrip(otherTrip);
            setOwner(ownerRes.data);
            setTripApplicants(applicants);
            setHasApplied(joined);
            setApplicationStatus(joinedStatus);
            setFavoriteId(activeFavorite?.id || null);
            setApplyMessage('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [id, user?.id]);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchTripData();

        // 使用者從其他頁面（如 MemberTrips 取消參加）切回來時，重新拉最新人數
        // 用 window focus 而非 visibilitychange，因為 SPA 同一分頁內路由切換不會觸發 visibilitychange
        const handleFocus = () => fetchTripData();
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [fetchTripData]);

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

        const day = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hour = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minute = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `${String(day).padStart(2, '0')} 天 ${String(hour).padStart(2, '0')} 小時 ${String(minute).padStart(2, '0')} 分`;
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
        applicants: Math.max(0, (trip.max_people || 4) - (trip.current_participants || 0)),
        //其他旅程的ID跟第一張圖
        otherTripItems: otherTrip.map(trip => ({
            id: trip.id,
            image: trip.image_url
        }))
    };
    const isOwner = trip.owner_id === user?.id;
    const isFull = t.currentPax >= t.maxPax;
    const isDeadlinePassed = t.countdown === '已截止';
    const isCtaDisabled = isOwner || hasApplied || isFull || isDeadlinePassed;
    const ctaText = isOwner
        ? '你是團主'
        : applicationStatus === 'pending'
            ? '審核中'
            : hasApplied
                ? '已加入'
                : isFull
                    ? '已額滿'
                    : isDeadlinePassed
                        ? '已截止'
                        : '申請加入旅程';

    const handleApplyJoin = async () => {
        if (!user?.id) {
            navigate('/login', { state: { from: location } });
            return;
        }

        if (isCtaDisabled || applying) return;

        const token = getToken();
        if (!token) {
            setApplyMessage('登入狀態失效，請重新登入');
            return;
        }

        const joinCount = Math.max(1, pax);

        setApplying(true);
        setApplyMessage('');

        try {
            const existingRes = await axios.get(
                `${API_URL}/664/participants?trip_id=${trip.id}&user_id=${user.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const existingRows = existingRes.data || [];
            const activeRow = existingRows.find((row) => !row.deleted_at);
            const deletedRow = existingRows.find((row) => row.deleted_at);

            if (activeRow) {
                setHasApplied(true);
                const status = activeRow.application_status || 'approved';
                setApplicationStatus(status);
                setApplyMessage(status === 'pending' ? '你已申請，等待團主審核' : '你已加入此旅程');
                return;
            }

            if (deletedRow) {
                await axios.patch(
                    `${API_URL}/664/participants/${deletedRow.id}`,
                    {
                        role: 'member',
                        application_status: 'pending',
                        deleted_at: null,
                        updated_at: new Date().toISOString(),
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                await axios.post(
                    `${API_URL}/664/participants`,
                    {
                        id: crypto.randomUUID(),
                        trip_id: trip.id,
                        user_id: user.id,
                        role: 'member',
                        comment: joinCheck.text.trim() || null,
                        joinCount: joinCount,
                        application_status: 'pending',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        deleted_at: null,
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            // try {
            //     await axios.patch(
            //         `${API_URL}/trips/${trip.id}`,
            //         {
            //             current_participants: nextParticipants,
            //             updated_at: new Date().toISOString(),
            //         },
            //         { headers: { Authorization: `Bearer ${token}` } }
            //     );
            // } catch {
            //     // trip 人數欄位更新失敗時，不阻斷申請成功流程
            // }

            // setTrip((prev) => ({
            //     ...prev,
            //     current_participants: nextParticipants,
            // }));
            setHasApplied(true);
            setApplicationStatus('pending');
            setApplyMessage('申請成功，審核中');
            closeJoin();
        } catch (err) {
            setApplyMessage(err.response?.data || err.message || '申請失敗，請稍後再試');
        } finally {
            setApplying(false);
        }
    };

    const handleFavorite = async () => {
        if (!user?.id) {
            navigate('/login', { state: { from: location } });
            return;
        }

        const token = getToken();
        if (!token) {
            toast.error('登入狀態失效，請重新登入');
            return;
        }

        try {
            if (favoriteId) {
                await axios.patch(
                    `${API_URL}/664/favorites/${favoriteId}`,
                    {
                        deleted_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setFavoriteId(null);
                toast.success('已從收藏移除');
                return;
            }

            const existingRes = await axios.get(
                `${API_URL}/664/favorites?trip_id=${trip.id}&user_id=${user.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const rows = existingRes.data || [];
            const activeRow = rows.find((row) => !row.deleted_at);
            const deletedRow = rows.find((row) => row.deleted_at);

            if (activeRow) {
                setFavoriteId(activeRow.id);
                toast.error('此旅程已在收藏中');
                return;
            }

            if (deletedRow) {
                await axios.patch(
                    `${API_URL}/664/favorites/${deletedRow.id}`,
                    {
                        deleted_at: null,
                        updated_at: new Date().toISOString(),
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setFavoriteId(deletedRow.id);
            } else {
                const res = await axios.post(
                    `${API_URL}/664/favorites`,
                    {
                        user_id: user.id,
                        trip_id: trip.id,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        deleted_at: null,
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setFavoriteId(res.data.id);
            }

            toast.success('已加入收藏');
        } catch (err) {
            toast.error(err.response?.data || err.message || '加入收藏失敗');
        }
    };


    const openJoin = (trip) => {
        setJoinCheck({
            open: true,
            tripId: trip.id,
            text: '',
        });

    };

    const closeJoin = () => {
        if (applying) return;
        setJoinCheck({ open: false, tripId: null, text: '' });

    };

    return (
        <div className="trip-detail-page">
            <Toaster richColors position="top-center" />
            <div className="container pt-5">

                {/* Breadcrumb */}
                <Breadcrumb items={[
                    { label: '首頁', path: '/' },
                    { label: '探索旅程' },
                    { label: t.title }
                ]} />

                {/* Title & Tags */}
                <div className="trip-header mb-4">
                    <div className="d-flex align-items-start">
                        <div>
                            <h1 className="h2 mb-3 trip-text-gray-800">{t.title}</h1>
                            <div className="trip-tags">
                                {t.tags.map(tag => (
                                    <span key={tag} className="trip-tag-pill">{tag}</span>
                                ))}
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            {trip.owner_id === user?.id && <a href="#" className="link-m trip-text-gray-600 edit-link">編輯旅程</a>}
                            <button
                                type="button"
                                className="trip-favorite-btn"
                                onClick={handleFavorite}
                                title="加入收藏"
                                aria-label="加入收藏"
                            >
                                <span className={`material-symbols-outlined trip-favorite-icon ${favoriteId ? 'is-active' : ''}`}>
                                    favorite
                                </span>
                            </button>
                        </div>

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

                            {
                                user ? (
                                    <>
                                        < div className="section-block mb-4">
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
                                        <div className="sidebar-card booking-card mb-4">

                                            {
                                                !isCtaDisabled && (
                                                    <>
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
                                                                <span className="trip-text-m trip-text-gray-600 fw-bold">已參加</span>
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
                                                    </>
                                                )
                                            }





                                            <button className="trip-btn-primary trip-btn-l cta-button" disabled={isCtaDisabled || applying} onClick={() => openJoin(trip)}>
                                                {applying ? '申請中...' : ctaText}
                                            </button>
                                            {applyMessage && (
                                                <p className="trip-text-s trip-text-gray-400 mt-2 mb-0">{applyMessage}</p>
                                            )}





                                        </div>
                                    </>) : (<div className="sidebar-card booking-card mb-4 text-center py-4">
                                        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔒</div>
                                        <h5 className="trip-text-gray-800 mb-2">登入後才能查看</h5>
                                        <p className="trip-text-s trip-text-gray-400 mb-4">
                                            集合資訊與報名功能僅限會員使用
                                        </p>
                                        <Link to="/login" className="trip-btn-primary trip-btn-m cta-button d-block">
                                            立即登入
                                        </Link>
                                        <p className="trip-text-s trip-text-gray-400 mt-3 mb-0">
                                            還沒有帳號？<Link to="/register" className="trip-text-primary">免費註冊</Link>
                                        </p>
                                    </div>)
                            }




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
                                    {t.otherTripItems && t.otherTripItems.length > 0 ? (
                                        // 有資料時顯示圖片
                                        t.otherTripItems.map(item => (
                                            <div key={item.id} className="memory-item">
                                                <Link to={`/trips/${item.id}`}>
                                                    <img src={item.image} alt={item.title || ''} className="memory-image" />
                                                </Link>
                                            </div>
                                        ))
                                    ) : (
                                        // 沒資料時顯示 placeholder
                                        <>

                                        </>
                                    )}
                                </div>

                                {/* Verified Badge Button */}
                                {t.host.isVerified ? (
                                    <div className="verified-btn">
                                        <span className="verified-icon" ><img src={shieldCheck} alt="shieldCheck" /></span> 已認證 真安心團主
                                    </div>
                                ) : null}
                            </div>

                            {/* Applicants Card */}
                            {trip.owner_id === user?.id && <>
                                <div className="sidebar-card applicants-card">
                                    <h5 className="subsection-title trip-text-gray-600 mb-3">申請加入名單</h5>
                                    <div className="applicants-row">
                                        <div className="applicants-avatars">
                                            {tripApplicants.slice(0, 3).map((applicant) => (
                                                <img
                                                    key={applicant.id}
                                                    src={applicant.avatar}
                                                    alt={applicant.name}
                                                    className="applicant-avatar"
                                                />
                                            ))}
                                            {tripApplicants.length === 0 && <div className="applicant-avatar placeholder-avatar"></div>}
                                        </div>
                                        <span className="applicants-count trip-text-s trip-text-gray-400">
                                            已有 {tripApplicants.length} 位乘客申請加入
                                        </span>
                                        <Link to={`/member/groups?tripId=${trip.id}`} className="manage-btn">管理</Link>
                                    </div>
                                </div>
                            </>}

                        </div>
                    </div>
                </div>
            </div>

            {joinCheck.open && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">

                                {/* Header */}
                                <div className="modal-header border-0 pb-0 px-4 pt-4 align-items-start">
                                    <div>
                                        <p className="trip-text-s trip-text-gray-400 mb-1">你正在申請加入</p>
                                        <h5 className="modal-title fw-bold trip-text-gray-800 mb-0">{trip?.title}</h5>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-close ms-auto flex-shrink-0 mt-1"
                                        onClick={closeJoin}
                                        disabled={applying}
                                    ></button>
                                </div>

                                <div className="modal-body px-4 py-3">
                                    <hr className="mt-2 mb-4 opacity-10" />

                                    {/* 人數選擇 */}
                                    <div className="mb-4">
                                        <label className="trip-text-s fw-bold trip-text-gray-600 mb-3 d-block">
                                            <i className="bi bi-people me-2 trip-text-primary-800"></i>加入人數
                                        </label>
                                        <div className="d-flex align-items-center gap-3">
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center flex-shrink-0"
                                                style={{ width: '38px', height: '38px', fontSize: '1.2rem' }}
                                                onClick={() => setPax(Math.max(1, pax - 1))}
                                                disabled={applying || pax <= 1}
                                            >−</button>

                                            <span
                                                className="fw-bold trip-text-primary-1000 text-center"
                                                style={{ fontSize: '2rem', minWidth: '2.5rem', lineHeight: 1 }}
                                            >{pax}</span>

                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center flex-shrink-0"
                                                style={{ width: '38px', height: '38px', fontSize: '1.2rem' }}
                                                onClick={() => setPax(Math.min((trip?.max_people || 0) - (trip?.current_participants || 0), pax + 1))}
                                                disabled={applying || pax >= (trip?.max_people || 0) - (trip?.current_participants || 0)}
                                            >＋</button>

                                            <span className="trip-text-s trip-text-gray-400">
                                                人&ensp;·&ensp;剩餘 <strong className="trip-text-gray-600">{(trip?.max_people || 0) - (trip?.current_participants || 0)}</strong> 個名額
                                            </span>
                                        </div>
                                    </div>

                                    {/* 加入宣言 */}
                                    <div className="mb-3">
                                        <label className="trip-text-s fw-bold trip-text-gray-600 mb-2 d-block">
                                            <i className="bi bi-chat-left-text me-2 trip-text-primary-800"></i>
                                            加入宣言
                                            <span className="fw-normal trip-text-gray-400 ms-1">（選填）</span>
                                        </label>
                                        <textarea
                                            className="form-control"
                                            rows={3}
                                            placeholder="簡單介紹自己，讓團主更認識你..."
                                            value={joinCheck.text}
                                            onChange={(e) => setJoinCheck((prev) => ({ ...prev, text: e.target.value }))}
                                            disabled={applying}
                                            style={{ resize: 'none' }}
                                        />
                                    </div>

                                    {applyMessage && (
                                        <div className="alert alert-warning py-2 mb-0 trip-text-s">{applyMessage}</div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="modal-footer border-0 px-4 pb-4 pt-1 gap-2">
                                    <button
                                        type="button"
                                        className="btn trip-btn-m trip-btn-outline-primary flex-fill"
                                        onClick={closeJoin}
                                        disabled={applying}
                                    >取消</button>
                                    <button
                                        type="button"
                                        className="btn trip-btn-m trip-btn-primary flex-fill"
                                        onClick={handleApplyJoin}
                                        disabled={applying}
                                    >
                                        {applying
                                            ? <><span className="spinner-border spinner-border-sm me-2" role="status"></span>送出中...</>
                                            : '確認加入'
                                        }
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </div>
    );
}

export default TripDetail;
