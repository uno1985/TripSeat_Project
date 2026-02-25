import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import '../../assets/css/myGroups.css';
import time from '../../assets/images/time.svg';

const API_URL = import.meta.env.VITE_API_BASE;

const getStatusMeta = (trip) => {
  const now = new Date();
  const end = trip.end_date ? new Date(trip.end_date) : null;
  const isEnded = end && end < now;
  const isFull = (trip.current_participants || 0) >= (trip.max_people || 0);

  if (trip.status === 'ended' || isEnded) {
    return {
      text: '已結束',
      className: 'bg-secondary-subtle text-secondary-emphasis',
    };
  }
  if (trip.status === 'confirmed' || isFull) {
    return {
      text: '已成團',
      className: 'bg-success-subtle text-success-emphasis',
    };
  }
  return {
    text: '招募中',
    className: 'bg-warning-subtle text-warning-emphasis',
  };
};

const formatDateTime = (startDate, meetingTime) => {
  if (!startDate) return '';
  const d = new Date(startDate);
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}(${weekdays[d.getDay()]}) ${meetingTime || ''}`.trim();
};

const MemberFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.id) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const [favRes, tripsRes] = await Promise.all([
          axios.get(`${API_URL}/664/favorites?user_id=${user.id}&_sort=created_at&_order=desc`),
          axios.get(`${API_URL}/664/trips`),
        ]);

        const tripMap = new Map((tripsRes.data || []).map((trip) => [trip.id, trip]));
        const rows = (favRes.data || [])
          .filter((item) => !item.deleted_at && tripMap.has(item.trip_id))
          .map((item) => {
            const trip = tripMap.get(item.trip_id);
            const statusMeta = getStatusMeta(trip);
            const remaining = Math.max((trip.max_people || 0) - (trip.current_participants || 0), 0);

            return {
              favoriteId: item.id,
              id: trip.id,
              title: trip.title,
              image: trip.image_url,
              time: formatDateTime(trip.start_date, trip.meeting_time),
              status: statusMeta.text,
              statusClass: statusMeta.className,
              participants: trip.current_participants || 0,
              remaining,
            };
          });

        setFavorites(rows);
      } catch (err) {
        setError(err.message || '載入收藏失敗');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user?.id]);

  if (loading) return <div className="py-4">載入中...</div>;
  if (error) return <div className="alert alert-warning">載入失敗：{error}</div>;

  return (
    <div className="my-groups-section my-4">
      <div className="d-flex justify-content-between align-items-center mb-4 mx-2">
        <h3 className="h3 mb-0">我的收藏</h3>
      </div>

      <div className="row g-4">
        {favorites.length === 0 ? (
          <div className="col-12">
            <div className="text-center py-4 text-muted">目前還沒有收藏旅程</div>
          </div>
        ) : (
          favorites.map((item) => (
            <div key={item.favoriteId} className="col-12 col-md-4">
              <div className="card">
                <div className="position-relative">
                  <img src={item.image} className="card-img-top" alt={item.title} />
                  <span className={`position-absolute top-0 start-0 m-3 badge px-2 py-1 fw-normal ${item.statusClass}`}>
                    {item.status}
                  </span>
                  {item.remaining > 0 && (
                    <span className="position-absolute bottom-0 end-0 m-2 badge bg-white text-danger border border-danger-subtle rounded-pill px-2 py-1 fw-normal">
                      剩餘 {item.remaining} 個座位
                    </span>
                  )}
                </div>

                <div className="card-body p-3">
                  <h5 className="card-title h5 text-truncate-2">{item.title}</h5>
                  <div className="d-flex align-items-center trip-text-s my-3">
                    <img src={time} className="me-2 icon-time" alt="時間icon" />
                    {item.time}
                  </div>
                  <div className="d-flex align-items-center small">
                    <div className="avatar-group d-inline-flex flex-row-reverse align-items-center me-2">
                      <img src="https://i.pravatar.cc/30?u=3" className="avatar-item" alt="user" />
                      <img src="https://i.pravatar.cc/30?u=2" className="avatar-item" alt="user" />
                      <img src="https://i.pravatar.cc/30?u=1" className="avatar-item" alt="user" />
                    </div>
                    <span className="text-muted">
                      已有 <span className="fw-bold text-dark">{item.participants}</span> 位乘客加入
                    </span>
                  </div>
                </div>

                <div className="card-footer bg-white border-0 p-0">
                  <Link to={`/trips/${item.id}`} className="btn btn-warning w-100 py-2 fw-bold text-white rounded-bottom">
                    查看細節
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MemberFavorites;
