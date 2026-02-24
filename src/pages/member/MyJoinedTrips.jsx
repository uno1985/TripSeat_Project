import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import '../../assets/css/myJoinedTrips.css';

const API_URL = import.meta.env.VITE_API_BASE;

const STATUS_META = {
  all: '全部',
  upcoming: '待出發',
  open: '招募中',
  ended: '已結束',
};

const statusOrder = ['all', 'upcoming', 'open', 'ended'];

function ratio(current, total) {
  if (!total) return 0;
  return Math.round((current / total) * 100);
}

function getTripStatus(trip) {
  const now = new Date();
  const start = trip.start_date ? new Date(trip.start_date) : null;
  const end = trip.end_date ? new Date(trip.end_date) : null;
  const isFull = (trip.current_participants || 0) >= (trip.max_people || 0);

  if (trip.status === 'ended' || (end && end < now)) return 'ended';
  if ((trip.status === 'confirmed' || isFull) && start && start >= now) return 'upcoming';
  if (trip.status === 'open') return 'open';
  if (start && start >= now) return 'upcoming';
  return 'ended';
}

function formatDateTime(startDate, meetingTime) {
  if (!startDate) return '';
  const d = new Date(startDate);
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const dateText = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}(${weekdays[d.getDay()]})`;
  return `${dateText} ${meetingTime || ''}`.trim();
}

export default function MyJoinedTripsV7() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('all');
  const [focusId, setFocusId] = useState(null);

  const filtered = useMemo(() => {
    if (status === 'all') return trips;
    return trips.filter((trip) => trip.status === status);
  }, [status, trips]);

  const counts = useMemo(() => {
    return {
      all: trips.length,
      upcoming: trips.filter((trip) => trip.status === 'upcoming').length,
      open: trips.filter((trip) => trip.status === 'open').length,
      ended: trips.filter((trip) => trip.status === 'ended').length,
    };
  }, [trips]);

  const focusTrip = useMemo(() => {
    const candidate = filtered.find((trip) => trip.id === focusId);
    return candidate || filtered[0] || null;
  }, [filtered, focusId]);

  const stories = trips.filter((trip) => trip.status === 'ended');

  useEffect(() => {
    const fetchJoinedTrips = async () => {
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
            const review = reviewMap.get(trip.id);
            const statusType = getTripStatus(trip);
            const story = review?.content || null;
            const hook = trip.vibe_text || (trip.description ? trip.description.split('\n')[0] : '期待你的旅程故事。');

            return {
              id: trip.id,
              title: trip.title,
              status: statusType,
              date: formatDateTime(trip.start_date, trip.meeting_time),
              location: trip.location || '未提供',
              host: trip.owner_name || '團主',
              participants: trip.current_participants || 0,
              maxPeople: trip.max_people || 0,
              image: trip.image_url || 'https://images.unsplash.com/photo-1464822759844-d150ad6d1b2f?q=80&w=1200&fit=crop',
              hook,
              tags: trip.tags || [],
              story,
            };
          });

        setTrips(rows);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedTrips();
  }, [user?.id]);

  useEffect(() => {
    if (!focusId && filtered.length > 0) {
      setFocusId(filtered[0].id);
    }
    if (focusId && filtered.length > 0 && !filtered.some((trip) => trip.id === focusId)) {
      setFocusId(filtered[0].id);
    }
  }, [filtered, focusId]);

  if (loading) return <div className="py-4">載入中...</div>;
  if (error) return <div className="alert alert-warning">載入失敗：{error}</div>;

  return (
    <section className="mjv7 mb-5">
      <header className="mjv7-editorial-head">
        <div>
          <p className="mjv7-kicker">TRIPSEAT MEMBER EDIT</p>
          <h2 className="mjv7-title">我的參加行程</h2>
          <p className="mjv7-sub">你的旅程節奏與故事。</p>
        </div>
        <Link to="/member/trips" className="mjv7-head-link">展開完整行程</Link>
      </header>

      <div className="mjv7-status-row" role="tablist" aria-label="狀態切換">
        {statusOrder.map((key) => {
          const active = key === status;
          return (
            <button
              key={key}
              type="button"
              className={`mjv7-status-pill ${active ? 'is-active' : ''}`}
              onClick={() => setStatus(key)}
            >
              <span>{STATUS_META[key]}</span>
              <strong>{counts[key]}</strong>
            </button>
          );
        })}
      </div>

      {focusTrip ? (
        <div className="mjv7-stage">
          <article className="mjv7-focus" style={{ backgroundImage: `url(${focusTrip.image})` }}>
            <div className="mjv7-overlay" />
            <div className="mjv7-focus-content">
              <span className={`mjv7-badge ${focusTrip.status}`}>{STATUS_META[focusTrip.status]}</span>
              <h3>{focusTrip.title}</h3>
              <p>{focusTrip.hook}</p>
              <div className="mjv7-meta">
                <span><i className="bi bi-calendar3" /> {focusTrip.date}</span>
                <span><i className="bi bi-geo-alt" /> {focusTrip.location}</span>
                <span><i className="bi bi-person" /> 主揪：{focusTrip.host}</span>
              </div>
              <div className="mjv7-tags">
                {focusTrip.tags.map((tag) => <span key={tag}>#{tag}</span>)}
              </div>
              <div className="mjv7-focus-actions">
                <Link to={`/trips/${focusTrip.id}`} className="focus-btn solid">查看細節</Link>
                <button type="button" className="focus-btn ghost">分享行程</button>
              </div>
            </div>
          </article>

          <aside className="mjv7-rail">
            <h4>行程軌道</h4>
            <ul>
              {filtered.map((trip) => {
                const active = focusTrip.id === trip.id;
                return (
                  <li key={trip.id} className={active ? 'is-active' : ''}>
                    <button type="button" onClick={() => setFocusId(trip.id)}>
                      <div className="mjv7-rail-top">
                        <strong>{trip.title}</strong>
                        <span>{STATUS_META[trip.status]}</span>
                      </div>
                      <div className="mjv7-rail-mid">{trip.date} ・ {trip.location}</div>
                      <div className="mjv7-rail-bottom">
                        <div className="mjv7-capacity-track">
                          <span style={{ width: `${ratio(trip.participants, trip.maxPeople)}%` }} />
                        </div>
                        <small>{trip.participants}/{trip.maxPeople} 人</small>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
            {filtered.length === 0 && <div className="mjv7-empty">目前沒有符合條件的行程。</div>}
          </aside>
        </div>
      ) : (
        <div className="mjv7-empty-block">沒有可呈現的焦點行程。</div>
      )}

      <section className="mjv7-story-wall">
        <div className="wall-head">
          <h4>旅後故事牆</h4>
          <span>已結束行程</span>
        </div>
        <div className="wall-grid">
          {stories.map((trip) => (
            <article key={trip.id} className="wall-card">
              <img src={trip.image} alt={trip.title} />
              <div className="wall-body">
                <h5>{trip.title}</h5>
                <p>{trip.story || '這趟還沒有心得，等你補上最真實的感受。'}</p>
                <div className="wall-meta">
                  <span><i className="bi bi-geo-alt" /> {trip.location}</span>
                  <button type="button">{trip.story ? '編輯心得' : '新增心得'}</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
