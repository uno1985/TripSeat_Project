import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import '../../assets/css/memberGroups.css';

const API_URL = import.meta.env.VITE_API_BASE;


const MemberGroups = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const focusTripId = searchParams.get('tripId');

    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getStatusType = (trip) => {
        const now = new Date();
        const end = trip.end_date ? new Date(trip.end_date) : null;
        const isEnded = end && end < now;
        const isFull = (trip.current_participants || 0) >= (trip.max_people || 0);

        if (trip.status === 'ended' || isEnded) return 'ended';
        if (trip.status === 'confirmed' || isFull) return 'confirmed';
        return 'open';
    };

    const statusTextMap = {
        open: '招募中',
        confirmed: '已成團',
        ended: '已結束',
    };

    const formatDateRange = (startDate, endDate) => {
        if (!startDate) return '';
        const s = new Date(startDate);
        const e = endDate ? new Date(endDate) : null;
        const fmt = (d) => `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
        return e && s.toDateString() !== e.toDateString() ? `${fmt(s)} - ${fmt(e)}` : fmt(s);
    };

    const daysUntil = (deadline) => {
        if (!deadline) return null;
        const now = new Date();
        const end = new Date(deadline);
        const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 0;
    };
      useEffect(() => {
        const fetchMyTrips = async () => {
        if (!user?.id) {
            setTrips([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${API_URL}/664/trips?owner_id=${user.id}&_sort=created_at&_order=desc`);
            const rows = (res.data || [])
            .filter((t) => !t.deleted_at)
            .map((t) => ({
                ...t,
                statusType: getStatusType(t),
                statusText: statusTextMap[getStatusType(t)],
            }));
            setTrips(rows);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

        fetchMyTrips();
    }, [user?.id]);

      const stats = useMemo(() => ({
        all: trips.length,
        open: trips.filter((t) => t.statusType === 'open').length,
        confirmed: trips.filter((t) => t.statusType === 'confirmed').length,
        ended: trips.filter((t) => t.statusType === 'ended').length,
    }), [trips]);

    const focusedTrip = useMemo(() => {
        if (!focusTripId) return null;
        return trips.find((t) => t.id === focusTripId) || null;
    }, [trips, focusTripId]);

    const openTrip = useMemo(() => {
        if (focusedTrip?.statusType === 'open') return focusedTrip;
        return trips.find((t) => t.statusType === 'open') || null;
    }, [focusedTrip, trips]);

    const otherTrips = useMemo(
        () => trips.filter((t) => t.id !== openTrip?.id),
        [trips, openTrip]
    );
    if (loading) return <div className="py-4">載入中...</div>;
    if (error) return <div className="alert alert-warning">載入失敗：{error}</div>;


    return (
        <div className="my-groups-page">

            {/* ===== 頁面標題 ===== */}
            <div className="my-groups-header mb-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <h2 className="h3 trip-text-gray-800">
                            <i className="bi bi-flag me-2 trip-text-primary-800"></i>
                            我的揪團
                        </h2>
                        <p className="trip-text-m trip-text-gray-400 mt-1 mb-0">
                            管理你建立的所有旅程揪團
                        </p>
                    </div>
                    <Link to="/member/create-group" className="btn trip-btn-m trip-btn-primary">
                        <i className="bi bi-plus-lg me-2"></i>建立新揪團
                    </Link>
                </div>
            </div>

            {/* ===== 統計摘要 ===== */}
            <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                    <div className="my-groups-stat-card">
                        <div className="my-groups-stat-number">{stats.all}</div>
                        <div className="my-groups-stat-label">全部揪團</div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="my-groups-stat-card">
                        <div className="my-groups-stat-number trip-text-primary-1000">{stats.open}</div>
                        <div className="my-groups-stat-label">招募中</div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="my-groups-stat-card">
                        <div className="my-groups-stat-number" style={{ color: 'var(--trip-color-status-success)' }}>{stats.confirmed}</div>
                        <div className="my-groups-stat-label">已成團</div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="my-groups-stat-card">
                        <div className="my-groups-stat-number trip-text-gray-400">{stats.ended}</div>
                        <div className="my-groups-stat-label">已結束</div>
                    </div>
                </div>
            </div>

            {/* ===== 篩選列 ===== */}
            <div className="my-groups-filter-bar mb-4">
                <button className="my-groups-filter-btn active">全部</button>
                <button className="my-groups-filter-btn">招募中</button>
                <button className="my-groups-filter-btn">已成團</button>
                <button className="my-groups-filter-btn">已結束</button>
            </div>

            {/* ===== 揪團卡片列表 ===== */}
            

            {/* --- 卡片 1：招募中 (有待審核) --- */}
            {openTrip && <div className="my-groups-card mb-3">
                <div className="row g-0">
                    {/* 封面圖 */}
                    <div className="col-md-3">
                        <div className="my-groups-card-img-wrapper">
                            <img
                                src={openTrip.image_url || "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=400&h=300&fit=crop&q=80"}
                                alt={openTrip.title}
                                className="my-groups-card-img"
                            />
                            <span className="my-groups-status-badge my-groups-status-open">
                                {openTrip.statusText}
                            </span>
                        </div>
                    </div>

                    {/* 資訊區 */}
                    <div className="col-md-9">
                        <div className="my-groups-card-body">
                            {/* 標題 & 操作 */}
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <h5 className="my-groups-card-title">
                                        {openTrip.title}
                                    </h5>
                                    <div className="my-groups-card-tags">
                                        {(openTrip.tags || []).slice(0, 3).map((tag) => (
                                            <span key={tag} className="my-groups-tag">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="my-groups-card-actions">
                                    <Link to="/member/create-group" className="btn btn-sm my-groups-btn-edit" title="編輯">
                                        <i className="bi bi-pencil-square"></i>
                                    </Link>
                                    <button className="btn btn-sm my-groups-btn-more" title="更多">
                                        <i className="bi bi-three-dots-vertical"></i>
                                    </button>
                                </div>
                            </div>

                            {/* 資訊列 */}
                            <div className="my-groups-card-info">
                                <span><i className="bi bi-calendar3 me-1"></i>{formatDateRange(openTrip.start_date, openTrip.end_date)}</span>
                                <span><i className="bi bi-geo-alt me-1"></i>{openTrip.location}</span>
                                <span><i className="bi bi-people me-1"></i>{openTrip.current_participants || 0} / {openTrip.max_people || 0} 人</span>
                                <span><i className="bi bi-clock me-1"></i>剩餘 {daysUntil(openTrip.deadline) ?? '--'} 天截止</span>
                            </div>

                            {/* 待審核提醒 */}
                            <div className="my-groups-pending-alert">
                                <i className="bi bi-bell-fill me-2"></i>
                                有 <strong>2</strong> 位旅伴等待審核
                                <button className="btn btn-sm my-groups-btn-expand ms-auto">
                                    <i className="bi bi-chevron-down"></i>
                                    展開審核
                                </button>
                            </div>

                            {/* 待審核區（開發者用 state 控制展開/收合） */}
                            <div className="my-groups-pending-list">
                                {/* 申請者 1 */}
                                <div className="my-groups-applicant">
                                    <img
                                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=kelly"
                                        alt="申請者頭像"
                                        className="my-groups-applicant-avatar"
                                    />
                                    <div className="my-groups-applicant-info">
                                        <span className="my-groups-applicant-name">背包客Kelly</span>
                                        <span className="my-groups-applicant-detail">28歲・已完成 8 趟旅程・評分 4.7</span>
                                    </div>
                                    <div className="my-groups-applicant-actions">
                                        <button className="btn btn-sm my-groups-btn-approve">
                                            <i className="bi bi-check-lg me-1"></i>通過
                                        </button>
                                        <button className="btn btn-sm my-groups-btn-reject">
                                            <i className="bi bi-x-lg me-1"></i>拒絕
                                        </button>
                                    </div>
                                </div>

                                {/* 申請者 2 */}
                                <div className="my-groups-applicant">
                                    <img
                                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=john"
                                        alt="申請者頭像"
                                        className="my-groups-applicant-avatar"
                                    />
                                    <div className="my-groups-applicant-info">
                                        <span className="my-groups-applicant-name">潛水員阿強</span>
                                        <span className="my-groups-applicant-detail">35歲・已完成 12 趟旅程・評分 4.9</span>
                                    </div>
                                    <div className="my-groups-applicant-actions">
                                        <button className="btn btn-sm my-groups-btn-approve">
                                            <i className="bi bi-check-lg me-1"></i>通過
                                        </button>
                                        <button className="btn btn-sm my-groups-btn-reject">
                                            <i className="bi bi-x-lg me-1"></i>拒絕
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* 已通過團員列表（開發者用 state 控制展開/收合） */}
                            <div className="my-groups-members-section">
                                <button className="btn btn-sm my-groups-btn-toggle-members">
                                    <i className="bi bi-people-fill me-1"></i>
                                    查看目前團員 (3)
                                    <i className="bi bi-chevron-down ms-1"></i>
                                </button>

                                <div className="my-groups-members-list">
                                    <div className="my-groups-member">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=ming" alt="" className="my-groups-member-avatar" />
                                        <span>小明愛旅行</span>
                                        <span className="my-groups-member-badge">團主</span>
                                    </div>
                                    <div className="my-groups-member">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=irene" alt="" className="my-groups-member-avatar" />
                                        <span>露營女孩艾琳</span>
                                    </div>
                                    <div className="my-groups-member">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=dragon" alt="" className="my-groups-member-avatar" />
                                        <span>老司機大龍</span>
                                    </div>
                                </div>
                            </div>

                            {/* 底部操作 */}
                            <div className="my-groups-card-footer">
                                <Link to={`/trips/${openTrip.id}`} className="btn btn-sm my-groups-btn-view">
                                    <i className="bi bi-eye me-1"></i>查看旅程頁面
                                </Link>
                                <div className="my-groups-card-footer-right">
                                    <button className="btn btn-sm my-groups-btn-confirm">
                                        <i className="bi bi-check-circle me-1"></i>確認成團
                                    </button>
                                    <button className="btn btn-sm my-groups-btn-cancel">
                                        <i className="bi bi-x-circle me-1"></i>取消揪團
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}

            {/* --- 卡片 2：已成團 --- */}
            {/* <div className="my-groups-card mb-3">
                <div className="row g-0">
                    <div className="col-md-3">
                        <div className="my-groups-card-img-wrapper">
                            <img
                                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&q=80"
                                alt="旅程封面"
                                className="my-groups-card-img"
                            />
                            <span className="my-groups-status-badge my-groups-status-confirmed">
                                已成團
                            </span>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="my-groups-card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <h5 className="my-groups-card-title">綠島石朗潛水團</h5>
                                    <div className="my-groups-card-tags">
                                        <span className="my-groups-tag">潛水</span>
                                        <span className="my-groups-tag">綠島</span>
                                        <span className="my-groups-tag">海洋</span>
                                    </div>
                                </div>
                                <div className="my-groups-card-actions">
                                    <Link to="/member/create-group" className="btn btn-sm my-groups-btn-edit" title="編輯">
                                        <i className="bi bi-pencil-square"></i>
                                    </Link>
                                </div>
                            </div>

                            <div className="my-groups-card-info">
                                <span><i className="bi bi-calendar3 me-1"></i>2026/01/15 - 01/17</span>
                                <span><i className="bi bi-geo-alt me-1"></i>台東縣 綠島鄉</span>
                                <span><i className="bi bi-people me-1"></i>4 / 4 人（已滿）</span>
                            </div>

                            <div className="my-groups-members-section">
                                <button className="btn btn-sm my-groups-btn-toggle-members">
                                    <i className="bi bi-people-fill me-1"></i>
                                    查看目前團員 (4)
                                    <i className="bi bi-chevron-down ms-1"></i>
                                </button>
                            </div>

                            <div className="my-groups-card-footer">
                                <Link to="/trips/2" className="btn btn-sm my-groups-btn-view">
                                    <i className="bi bi-eye me-1"></i>查看旅程頁面
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* --- 卡片 3：已結束 --- */}
            {otherTrips.map((trip) => (
                <div
                    key={trip.id}
                    className={`my-groups-card mb-3 ${trip.statusType === 'ended' ? 'my-groups-card-ended' : ''}`}
                >
                    <div className="row g-0">
                        <div className="col-md-3">
                            <div className="my-groups-card-img-wrapper">
                                <img
                                    src={trip.image_url || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop&q=80'}
                                    alt={trip.title}
                                    className="my-groups-card-img"
                                />
                                <span className={`my-groups-status-badge my-groups-status-${trip.statusType}`}>
                                    {trip.statusText}
                                </span>
                            </div>
                        </div>
                        <div className="col-md-9">
                            <div className="my-groups-card-body">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div>
                                        <h5 className="my-groups-card-title trip-text-gray-400">{trip.title}</h5>
                                        <div className="my-groups-card-tags">
                                            {(trip.tags || []).slice(0, 3).map((tag) => (
                                                <span key={tag} className="my-groups-tag">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="my-groups-card-info">
                                    <span><i className="bi bi-calendar3 me-1"></i>{formatDateRange(trip.start_date, trip.end_date)}</span>
                                    <span><i className="bi bi-geo-alt me-1"></i>{trip.location}</span>
                                    <span><i className="bi bi-people me-1"></i>{trip.max_people || 0} 人</span>
                                </div>

                                <div className="my-groups-card-footer">
                                    <Link to={`/trips/${trip.id}`} className="btn btn-sm my-groups-btn-view">
                                        <i className="bi bi-eye me-1"></i>查看旅程頁面
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* ===== 空狀態（當沒有揪團時顯示） ===== */}
            {/*
            <div className="my-groups-empty">
                <i className="bi bi-flag"></i>
                <h5>還沒有揪團</h5>
                <p>建立你的第一個旅程，邀請旅伴一起出發吧！</p>
                <Link to="/member/create-group" className="btn trip-btn-m trip-btn-primary">
                    <i className="bi bi-plus-lg me-2"></i>建立揪團
                </Link>
            </div>
            */}

        </div>
    );
};

export default MemberGroups;
