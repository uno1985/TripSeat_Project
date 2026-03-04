import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import '../../assets/css/myGroups.css';
import time from '../../assets/images/time.svg'

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
    }
  }
  if (trip.status === 'confirmed' || isFull){
    return {
      text: '已成團',
      className: 'bg-success-subtle text-success-emphasis',
    }
  }
  return {
    text: '招募中',
    className: 'bg-warning-subtle text-warning-emphasis',
  }
}

const formatDateTime = (startDate, meetingTime) => {
  if (!startDate) return '';
  const d = new Date(startDate);
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}(${weekdays[d.getDay()]}) ${meetingTime || ''}`.trim();
}

const MyGroups = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchMyGroups = async () => {
    if (!user?.id) {
      setGroups([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `${API_URL}/664/trips?owner_id=${user.id}&_sort=created_at&_order=desc&_limit=3`
      );

      const rows = (res.data || [])
        .filter((item) => !item.deleted_at)
        .map((trip) => {
          const statusMeta = getStatusMeta(trip);
          const remaining = Math.max((trip.max_people || 0) - (trip.current_participants || 0), 0);

          return {
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

      setGroups(rows);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMyGroups();
  }, [user?.id]);

  if (loading) return <div className="py-4">載入中...</div>;
  if (error) return <div className="alert alert-warning">載入失敗：{error}</div>;

  return (
    <div className="my-groups-section my-5">
      <div className="d-flex justify-content-between align-items-center mb-4 mx-2">
        <h3 className="h3 mb-0">我的揪團</h3>
        <Link to="/member/groups" className="trip-text-m link-m link-underline-gray-600">查看更多</Link>
      </div>

      <div className="row g-4">
        {groups.length === 0 ? (
          <div className="col-12">
            <div className="text-center py-4 text-muted">
              目前還沒有你建立的揪團
            </div>
          </div>
        ) : (
        groups.map((group) => (
          <div key={group.id} className="col-12 col-md-4">
            <div className="card">
              {/* 圖片區域 */}
              <div className='position-relative'>
                <img
                  src={group.image}
                  className="card-img-top"
                  alt={group.title}
                />
                <span className={`position-absolute top-0 start-0 m-3 badge px-2 py-1 fw-normal ${group.statusClass}`}>
                  {group.status}
                </span>
                {group.remaining && (
                  <span className="position-absolute bottom-0 end-0 m-2 badge bg-white text-danger border border-danger-subtle rounded-pill px-2 py-1 fw-normal">
                    剩餘 {group.remaining} 個座位
                  </span>
                )}
              </div>
             {/* 內容區域 */}
              <div className="card-body p-3">
                <h5 className="card-title h5 text-truncate-2">
                  {group.title}
                </h5>
                <div className="d-flex align-items-center trip-text-s my-3">
                  <img src={time} className="me-2 icon-time" alt="時間icon" />
                  {group.time}
                </div>
                <div className="d-flex align-items-center small">
                  {/* 模擬頭像疊加 */}
                  <div className="avatar-group d-inline-flex flex-row-reverse align-items-center me-2">
                    {/* 注意：這裡為了讓後面的蓋住前面的，我們在結構上可以維持順序，但用 CSS 控制重疊 */}
                    <img src="https://i.pravatar.cc/30?u=3" className="avatar-item" alt="user" />
                    <img src="https://i.pravatar.cc/30?u=2" className="avatar-item" alt="user" />
                    <img src="https://i.pravatar.cc/30?u=1" className="avatar-item" alt="user" />
                  </div>
                  <span className="text-muted">
                    已有 <span className="fw-bold text-dark">{group.participants}</span> 位乘客加入
                  </span>
                </div>
              </div>

              {/* 按鈕區域 */}
              <div className="card-footer bg-white border-0 p-0">
                <Link to={`/trips/${group.id}`} className="btn btn-warning w-100 py-2 fw-bold text-white rounded-bottom">
                管理行程
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

export default MyGroups;