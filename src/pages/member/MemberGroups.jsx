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
    const [applicantsByTrip, setApplicantsByTrip] = useState({});
    const [membersByTrip, setMembersByTrip] = useState({});
    const [expandedPending, setExpandedPending] = useState(true);
    const [expandedMembers, setExpandedMembers] = useState(true);
    const [expandedMembersByTrip, setExpandedMembersByTrip] = useState({});
    const [approvedIds, setApprovedIds] = useState([]);
    const [processingIds, setProcessingIds] = useState([]);
    const [actionError, setActionError] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getToken = () =>
        document.cookie
            .split('; ')
            .find((row) => row.startsWith('tripToken='))
            ?.split('=')[1];

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
            const [tripsRes, participantsRes, usersRes] = await Promise.all([
                axios.get(`${API_URL}/664/trips?owner_id=${user.id}&_sort=created_at&_order=desc`),
                axios.get(`${API_URL}/664/participants`),
                axios.get(`${API_URL}/664/users`),
            ]);

            const rows = (tripsRes.data || [])
            .filter((t) => !t.deleted_at)
            .map((t) => ({
                ...t,
                statusType: getStatusType(t),
                statusText: statusTextMap[getStatusType(t)],
            }));

            const tripIdSet = new Set(rows.map((t) => t.id));
            const userMap = new Map((usersRes.data || []).map((u) => [u.id, u]));
            const nextApplicantsByTrip = {};
            const nextMembersByTrip = {};

            (participantsRes.data || [])
                .filter((p) => !p.deleted_at && tripIdSet.has(p.trip_id))
                .forEach((p) => {
                    const profile = userMap.get(p.user_id) || {};
                    const item = {
                        participantId: p.id,
                        userId: p.user_id,
                        role: p.role,
                        name: profile.name || '未命名會員',
                        avatar: profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.user_id}`,
                        detail: `${profile.birthday ? `${new Date().getFullYear() - new Date(profile.birthday).getFullYear()}歲・` : ''}已完成 ${profile.trips_completed || 0} 趟旅程・評分 ${profile.rating_average || 0}`,
                    };

                    if (!nextMembersByTrip[p.trip_id]) nextMembersByTrip[p.trip_id] = [];
                    nextMembersByTrip[p.trip_id].push(item);

                    if (p.role !== 'owner' && (p.application_status || 'pending') === 'pending') {
                        if (!nextApplicantsByTrip[p.trip_id]) nextApplicantsByTrip[p.trip_id] = [];
                        nextApplicantsByTrip[p.trip_id].push(item);
                    }
                });

            setTrips(rows);
            setApplicantsByTrip(nextApplicantsByTrip);
            setMembersByTrip(nextMembersByTrip);
            setApprovedIds([]);
            setActionError('');
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
    const pendingApplicants = useMemo(() => {
        if (!openTrip) return [];
        return (applicantsByTrip[openTrip.id] || []).filter((a) => !approvedIds.includes(a.participantId));
    }, [applicantsByTrip, approvedIds, openTrip]);

    const members = useMemo(() => {
        if (!openTrip) return [];
        return membersByTrip[openTrip.id] || [];
    }, [membersByTrip, openTrip]);

    const toggleMembersByTrip = (tripId) => {
        setExpandedMembersByTrip((prev) => ({
            ...prev,
            [tripId]: !prev[tripId],
        }));
    };

    const handleApproveApplicant = async (applicant) => {
        if (!applicant?.participantId || processingIds.includes(applicant.participantId)) return;
        const token = getToken();
        if (!token) {
            setActionError('登入狀態失效，請重新登入');
            return;
        }

        setProcessingIds((prev) => [...prev, applicant.participantId]);
        setActionError('');
        try {
            const now = new Date().toISOString();
            await Promise.all([
                axios.patch(
                    `${API_URL}/664/participants/${applicant.participantId}`,
                    {
                        role: 'member',
                        application_status: 'approved',
                        updated_at: now
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                ),
                axios.post(
                    `${API_URL}/664/notifications`,
                    {
                        user_id: applicant.userId,
                        type: 'approval',
                        actor_id: user.id,
                        actor_name: user.name || '團主',
                        trip_id: openTrip?.id || null,
                        trip_title: openTrip?.title || '',
                        content: ' 你的入團申請已核准：',
                        action_text: '查看行程',
                        action_link: '/member/trips',
                        is_read: false,
                        created_at: now,
                        updated_at: now,
                        deleted_at: null
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                )
            ]);
            setApprovedIds((prev) => [...prev, applicant.participantId]);
        } catch (err) {
            setActionError(err.response?.data || err.message || '通過申請失敗');
        } finally {
            setProcessingIds((prev) => prev.filter((id) => id !== applicant.participantId));
        }
    };

    const handleRejectApplicant = async (applicant) => {
        if (!openTrip?.id || !applicant?.participantId || processingIds.includes(applicant.participantId)) return;
        const token = getToken();
        if (!token) {
            setActionError('登入狀態失效，請重新登入');
            return;
        }

        setProcessingIds((prev) => [...prev, applicant.participantId]);
        setActionError('');
        try {
            const now = new Date().toISOString();
            await Promise.all([
                axios.patch(
                    `${API_URL}/664/participants/${applicant.participantId}`,
                    {
                        application_status: 'rejected',
                        deleted_at: now,
                        updated_at: now
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                ),
                axios.patch(
                    `${API_URL}/664/trips/${openTrip.id}`,
                    {
                        current_participants: Math.max((openTrip.current_participants || 1) - 1, 0),
                        updated_at: now,
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                ),
                axios.post(
                    `${API_URL}/664/notifications`,
                    {
                        user_id: applicant.userId,
                        type: 'rejected',
                        actor_id: user.id,
                        actor_name: user.name || '團主',
                        trip_id: openTrip?.id || null,
                        trip_title: openTrip?.title || '',
                        content: ' 你的入團申請未通過：',
                        action_text: '查看其他行程',
                        action_link: '/trips',
                        is_read: false,
                        created_at: now,
                        updated_at: now,
                        deleted_at: null
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                )
            ]);

            setApplicantsByTrip((prev) => ({
                ...prev,
                [openTrip.id]: (prev[openTrip.id] || []).filter((a) => a.participantId !== applicant.participantId),
            }));
            setMembersByTrip((prev) => ({
                ...prev,
                [openTrip.id]: (prev[openTrip.id] || []).filter((a) => a.participantId !== applicant.participantId),
            }));
            setTrips((prev) =>
                prev.map((trip) =>
                    trip.id === openTrip.id
                        ? { ...trip, current_participants: Math.max((trip.current_participants || 1) - 1, 0) }
                        : trip
                )
            );
        } catch (err) {
            setActionError(err.response?.data || err.message || '拒絕申請失敗');
        } finally {
            setProcessingIds((prev) => prev.filter((id) => id !== applicant.participantId));
        }
    };

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
                                有 <strong>{pendingApplicants.length}</strong> 位旅伴等待審核
                                <button className="btn btn-sm my-groups-btn-expand ms-auto" type="button" onClick={() => setExpandedPending((prev) => !prev)}>
                                    <i className={`bi ${expandedPending ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                                    {expandedPending ? '收合審核' : '展開審核'}
                                </button>
                            </div>

                            {/* 待審核區（開發者用 state 控制展開/收合） */}
                            {expandedPending && (
                                <div className="my-groups-pending-list">
                                    {pendingApplicants.length === 0 && (
                                        <div className="trip-text-s trip-text-gray-400 py-2">目前沒有待審核申請</div>
                                    )}
                                    {pendingApplicants.map((applicant) => (
                                        <div key={applicant.participantId} className="my-groups-applicant">
                                            <img
                                                src={applicant.avatar}
                                                alt={`${applicant.name} 頭像`}
                                                className="my-groups-applicant-avatar"
                                            />
                                            <div className="my-groups-applicant-info">
                                                <span className="my-groups-applicant-name">{applicant.name}</span>
                                                <span className="my-groups-applicant-detail">{applicant.detail}</span>
                                            </div>
                                            <div className="my-groups-applicant-actions">
                                                <button
                                                    className="btn btn-sm my-groups-btn-approve"
                                                    type="button"
                                                    onClick={() => handleApproveApplicant(applicant)}
                                                    disabled={processingIds.includes(applicant.participantId)}
                                                >
                                                    <i className="bi bi-check-lg me-1"></i>通過
                                                </button>
                                                <button
                                                    className="btn btn-sm my-groups-btn-reject"
                                                    type="button"
                                                    onClick={() => handleRejectApplicant(applicant)}
                                                    disabled={processingIds.includes(applicant.participantId)}
                                                >
                                                    <i className="bi bi-x-lg me-1"></i>拒絕
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* 已通過團員列表（開發者用 state 控制展開/收合） */}
                            <div className="my-groups-members-section">
                                <button className="btn btn-sm my-groups-btn-toggle-members" type="button" onClick={() => setExpandedMembers((prev) => !prev)}>
                                    <i className="bi bi-people-fill me-1"></i>
                                    查看目前團員 ({members.length})
                                    <i className={`bi ms-1 ${expandedMembers ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                                </button>

                                {expandedMembers && (
                                    <div className="my-groups-members-list">
                                        {members.map((member) => (
                                            <div key={member.participantId} className="my-groups-member">
                                                <img src={member.avatar} alt={`${member.name} 頭像`} className="my-groups-member-avatar" />
                                                <span>{member.name}</span>
                                                {member.role === 'owner' && <span className="my-groups-member-badge">團主</span>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {actionError && <div className="alert alert-warning py-2 mt-3 mb-0">{actionError}</div>}

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
                (() => {
                    const tripMembers = membersByTrip[trip.id] || [];
                    const isExpanded = Boolean(expandedMembersByTrip[trip.id]);

                    return (
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
                                            <span><i className="bi bi-people me-1"></i>{trip.current_participants || 0} / {trip.max_people || 0} 人</span>
                                        </div>

                                        <div className="my-groups-members-section">
                                            <button
                                                className="btn btn-sm my-groups-btn-toggle-members"
                                                type="button"
                                                onClick={() => toggleMembersByTrip(trip.id)}
                                            >
                                                <i className="bi bi-people-fill me-1"></i>
                                                查看目前團員 ({tripMembers.length})
                                                <i className={`bi ms-1 ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                                            </button>

                                            {isExpanded && (
                                                <div className="my-groups-members-list">
                                                    {tripMembers.map((member) => (
                                                        <div key={member.participantId} className="my-groups-member">
                                                            <img src={member.avatar} alt={`${member.name} 頭像`} className="my-groups-member-avatar" />
                                                            <span>{member.name}</span>
                                                            {member.role === 'owner' && <span className="my-groups-member-badge">團主</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
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
                    );
                })()
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
