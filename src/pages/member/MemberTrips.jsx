import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import '../../assets/css/memberTrips.css';

const API_URL = import.meta.env.VITE_API_BASE;

const FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'open', label: '招募中' },
  { key: 'confirmed', label: '已成團' },
  { key: 'ended', label: '已結束' },
];

const STATUS_TEXT = {
  open: '招募中',
  confirmed: '已成團',
  ended: '已結束',
};

const getStatusType = (trip) => {
  const now = new Date();
  const end = trip.end_date ? new Date(trip.end_date) : null;
  const isEnded = end && end < now;
  const isFull = (trip.current_participants || 0) >= (trip.max_people || 0);

  if (trip.status === 'ended' || isEnded) return 'ended';
  if (trip.status === 'confirmed' || isFull) return 'confirmed';
  return 'open';
};

const formatDateRange = (startDate, endDate) => {
  if (!startDate) return '';
  const s = new Date(startDate);
  const e = endDate ? new Date(endDate) : null;
  const fmt = (d) => `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
  return e && s.toDateString() !== e.toDateString() ? `${fmt(s)} - ${fmt(e)}` : fmt(s);
};

const MemberTrips = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchMemberTrips = async () => {
      if (!user?.id) {
        setTrips([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [reviewsRes, tripsRes] = await Promise.all([
          axios.get(`${API_URL}/664/reviews?user_id=${user.id}&_sort=created_at&_order=desc`),
          axios.get(`${API_URL}/664/trips`),
        ]);

        const reviewMap = new Map();
        (reviewsRes.data || [])
          .filter((review) => !review.deleted_at)
          .forEach((review) => {
            if (!reviewMap.has(review.trip_id)) {
              reviewMap.set(review.trip_id, review);
            }
          });

        const rows = (tripsRes.data || [])
          .filter((trip) => !trip.deleted_at && reviewMap.has(trip.id))
          .map((trip) => {
            const statusType = getStatusType(trip);
            const review = reviewMap.get(trip.id);

            return {
              id: trip.id,
              status: STATUS_TEXT[statusType],
              statusType,
              title: trip.title,
              date: formatDateRange(trip.start_date, trip.end_date),
              location: trip.location || '未提供',
              image: trip.image_url || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop&q=80',
              host: trip.owner_name || '團主',
              hostAvatar: trip.owner_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
              participants: trip.current_participants || 0,
              maxPeople: trip.max_people || 0,
              review: review?.content || null,
            };
          })
          .sort((a, b) => b.date.localeCompare(a.date));

        setTrips(rows);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberTrips();
  }, [user?.id]);

  const counts = useMemo(
    () => ({
      all: trips.length,
      open: trips.filter((trip) => trip.statusType === 'open').length,
      confirmed: trips.filter((trip) => trip.statusType === 'confirmed').length,
      ended: trips.filter((trip) => trip.statusType === 'ended').length,
    }),
    [trips]
  );

  const displayTrips = useMemo(() => {
    if (activeFilter === 'all') return trips;
    return trips.filter((trip) => trip.statusType === activeFilter);
  }, [activeFilter, trips]);

  if (loading) return <div className="py-4">載入中...</div>;
  if (error) return <div className="alert alert-warning">載入失敗：{error}</div>;

  return (
    <div className="member-trips-page">
      <div className="member-trips-header mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h2 className="h3 trip-text-gray-800">
              <i className="bi bi-compass me-2 trip-text-primary-800"></i>
              我的旅程
            </h2>
            <p className="trip-text-m trip-text-gray-400 mt-1 mb-0">查看所有你參加的旅程及心得紀錄</p>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="member-trips-stat-card">
            <div className="member-trips-stat-number">{counts.all}</div>
            <div className="member-trips-stat-label">全部旅程</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="member-trips-stat-card">
            <div className="member-trips-stat-number trip-text-primary-1000">{counts.open}</div>
            <div className="member-trips-stat-label">招募中</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="member-trips-stat-card">
            <div className="member-trips-stat-number" style={{ color: 'var(--trip-color-status-success)' }}>{counts.confirmed}</div>
            <div className="member-trips-stat-label">已成團</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="member-trips-stat-card">
            <div className="member-trips-stat-number trip-text-gray-400">{counts.ended}</div>
            <div className="member-trips-stat-label">已結束</div>
          </div>
        </div>
      </div>

      <div className="member-trips-filter-bar mb-4">
        {FILTERS.map((filter) => (
          <button
            key={filter.key}
            type="button"
            className={`member-trips-filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter.key)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {displayTrips.length === 0 ? (
        <div className="member-trips-empty">
          <i className="bi bi-compass"></i>
          <h5>目前沒有符合條件的旅程</h5>
          <p>可以切換篩選或前往探索頁面看看新旅程</p>
          <Link to="/trips" className="btn trip-btn-m trip-btn-primary">
            <i className="bi bi-search me-2"></i>探索旅程
          </Link>
        </div>
      ) : (
        <div className="member-trips-list">
          {displayTrips.map((trip) => (
            <div key={trip.id} className={`member-trips-card ${trip.statusType === 'ended' ? 'member-trips-card-ended' : ''}`}>
              <div className="row g-0">
                <div className="col-md-3">
                  <div className="member-trips-card-img-wrapper">
                    <img src={trip.image} alt={trip.title} className="member-trips-card-img" />
                    <span className={`member-trips-status-badge member-trips-status-${trip.statusType}`}>{trip.status}</span>
                  </div>
                </div>

                <div className="col-md-9">
                  <div className="member-trips-card-body">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h5 className="member-trips-card-title">{trip.title}</h5>
                      <span className={`member-trips-status-pill member-trips-pill-${trip.statusType}`}>{trip.status}</span>
                    </div>

                    <div className="member-trips-card-info">
                      <span><i className="bi bi-calendar3 me-1"></i>{trip.date}</span>
                      <span><i className="bi bi-geo-alt me-1"></i>{trip.location}</span>
                      <span><i className="bi bi-people me-1"></i>{trip.participants} / {trip.maxPeople} 人</span>
                    </div>

                    <div className="member-trips-host">
                      <img src={trip.hostAvatar} alt={trip.host} className="member-trips-host-avatar" />
                      <span>團主：{trip.host}</span>
                    </div>

                    <div className="member-trips-review-section">
                      <div className="member-trips-review-header">
                        <i className="bi bi-chat-left-text me-1"></i>
                        <span>旅行心得</span>
                      </div>
                      {trip.review ? (
                        <div className="member-trips-review-content">
                          <p className="member-trips-review-text">{trip.review}</p>
                          <button type="button" className="btn btn-sm member-trips-btn-edit-review">
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

                    <div className="member-trips-card-footer">
                      <Link to={`/trips/${trip.id}`} className="btn btn-sm member-trips-btn-detail">
                        <i className="bi bi-eye me-1"></i>查看細節
                      </Link>
                      {trip.statusType === 'ended' && !trip.review && (
                        <button type="button" className="btn btn-sm member-trips-btn-add-review">
                          <i className="bi bi-plus-lg me-1"></i>新增心得
                        </button>
                      )}
                      {trip.statusType === 'open' && (
                        <button type="button" className="btn btn-sm member-trips-btn-cancel-join">
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
      )}
    </div>
  );
};

export default MemberTrips;
