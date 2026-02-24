import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import '../../assets/css/notifictions.css';

const API_URL = import.meta.env.VITE_API_BASE;

const TYPE_META = {
  apply: { text: '入團申請', badgeClass: 'bg-warning-subtle text-warning-emphasis' },
  success: { text: '成團通知', badgeClass: 'bg-info-subtle text-info-emphasis' },
  cancel: { text: '棄團通知', badgeClass: 'bg-danger-subtle text-danger-emphasis' },
  review: { text: '心得通知', badgeClass: 'bg-primary-subtle text-primary-emphasis' },
  system: { text: '系統通知', badgeClass: 'bg-secondary-subtle text-secondary-emphasis' },
};

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) {
        setNotifications([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [notifRes, myTripsRes, reviewsRes] = await Promise.all([
          axios.get(`${API_URL}/664/notifications?user_id=${user.id}&_sort=created_at&_order=desc&_limit=5`),
          axios.get(`${API_URL}/664/trips?owner_id=${user.id}`),
          axios.get(`${API_URL}/664/reviews?_sort=created_at&_order=desc`),
        ]);

        const dbNotifs = (notifRes.data || []).map((item) => {
          const meta = TYPE_META[item.type] || TYPE_META.system;
          return {
            id: item.id,
            typeText: meta.text,
            badgeClass: meta.badgeClass,
            user: item.actor_name ? { name: item.actor_name, id: item.actor_id } : null,
            content: item.content || '',
            trip: item.trip_title ? { name: item.trip_title, id: item.trip_id } : null,
            endContent: '',
            linkText: item.action_text || null,
            actionLink: item.action_link || null,
            created_at: item.created_at,
          };
        });

        if (dbNotifs.length > 0) {
          setNotifications(dbNotifs);
          return;
        }

        const myTripMap = new Map((myTripsRes.data || []).map((trip) => [trip.id, trip]));
        const fallback = (reviewsRes.data || [])
          .filter((review) => !review.deleted_at && myTripMap.has(review.trip_id) && review.user_id !== user.id)
          .slice(0, 5)
          .map((review) => ({
            id: `review-${review.id}`,
            typeText: TYPE_META.review.text,
            badgeClass: TYPE_META.review.badgeClass,
            user: { name: review.user_name, id: review.user_id },
            content: ' 在你的揪團留下心得：',
            trip: { name: review.trip_title, id: review.trip_id },
            endContent: '',
            linkText: '前往查看',
            actionLink: `/thoughts/${review.id}`,
            created_at: review.created_at,
          }));

        setNotifications(fallback);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user?.id]);

  if (loading) return <div className="py-3">載入中...</div>;
  if (error) return <div className="alert alert-warning">載入通知失敗：{error}</div>;

  return (
    <div className="notifications-section mb-4">
      <div className="d-flex justify-content-between align-items-center mb-4 mx-2">
        <h3 className="h3 mb-0">訊息通知</h3>
        <Link to="/member/notifications" className="trip-text-m link-m link-underline-gray-600 ">查看更多</Link>
      </div>

      <div className="list-group list-group-flush bg-white shadow-sm rounded-4 p-4">
        {notifications.length === 0 && (
          <div className="text-center text-muted py-3">目前沒有通知</div>
        )}
        {notifications.map((note) => (
          <div key={note.id} className="list-group-item border-0 px-0 py-3 dashed-border">
            <div className="d-flex align-items-start gap-3">
              {/* 狀態標籤 */}
              <span className={`badge rounded-1 px-2 py-2 fw-normal ${note.badgeClass}`}>
                {note.typeText}
              </span>

              {/* 內容文字區塊 */}
              <div className="flex-grow-1">
                <p className="mb-0 trip-text-l">
                  {/* 會員名稱連結 */}
                  {note.user && (
                    <Link to={`/member/${note.user.id}`} className="fw-bold text-dark text-decoration-none mx-1">
                      {note.user.name}
                    </Link>
                  )}

                  {/* 如果有後段文字 */}
                  {note.content}


                  {/* 團名連結 */}
                  {note.trip && (
                    <Link to={`/trips/${note.trip.id}`} className="fw-bold text-dark text-decoration-none mx-1">
                      {note.trip.name}
                    </Link>
                  )}

                  {/* 如果有後段文字 (例如：已成團！) */}
                  {note.endContent}

                  {/* 審核連結 */}
                  {note.linkText && note.actionLink && (
                    <Link to={note.actionLink} className="ms-1 fw-bold text-dark text-decoration-underline">
                      {note.linkText}
                    </Link>
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
