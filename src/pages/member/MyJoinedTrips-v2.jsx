import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/myJoinedTrips-v2.css';

const SAMPLE_TRIPS = [
  {
    id: 101,
    title: '基隆海岸晨騎',
    dateLabel: '2026/03/16 06:00',
    city: '基隆',
    status: 'upcoming',
    host: 'Irene',
    seatsUsed: 3,
    seatsTotal: 4,
    mood: '高能量',
  },
  {
    id: 102,
    title: '南投茶山慢旅行',
    dateLabel: '2026/03/24 09:30',
    city: '南投',
    status: 'open',
    host: 'Ming',
    seatsUsed: 5,
    seatsTotal: 8,
    mood: '放鬆系',
  },
  {
    id: 103,
    title: '台南老城夜拍散步',
    dateLabel: '2026/01/12 15:00',
    city: '台南',
    status: 'ended',
    host: 'Luke',
    seatsUsed: 6,
    seatsTotal: 6,
    mood: '故事感',
    review: '行程節奏很好，主揪照顧新手，路線也很好拍。',
  },
  {
    id: 104,
    title: '港都夜市巡禮',
    dateLabel: '2025/12/28 18:30',
    city: '高雄',
    status: 'ended',
    host: 'Ken',
    seatsUsed: 4,
    seatsTotal: 6,
    mood: '美食派',
    review: null,
  },
];

const STATUS_META = {
  all: { label: '全部' },
  upcoming: { label: '待出發' },
  open: { label: '招募中' },
  ended: { label: '已結束' },
};

function toPercent(used, total) {
  if (!total) return 0;
  return Math.min(100, Math.round((used / total) * 100));
}

export default function MyJoinedTripsV2() {
  const [filter, setFilter] = useState('all');

  const filteredTrips = useMemo(() => {
    if (filter === 'all') return SAMPLE_TRIPS;
    return SAMPLE_TRIPS.filter((trip) => trip.status === filter);
  }, [filter]);

  const nextTrip = useMemo(() => {
    return SAMPLE_TRIPS.find((trip) => trip.status === 'upcoming') || null;
  }, []);

  return (
    <section className="mjv2-wrap">
      <header className="mjv2-head">
        <div>
          <h2 className="mjv2-title">我的參加行程（v2）</h2>
          <p className="mjv2-sub">快速檢視下一趟行程與目前進度</p>
        </div>
        <Link to="/member/trips" className="mjv2-link">
          查看完整清單
        </Link>
      </header>

      {nextTrip && (
        <div className="mjv2-next">
          <div className="mjv2-next-label">下一趟</div>
          <div className="mjv2-next-main">
            <strong>{nextTrip.title}</strong>
            <span>{nextTrip.dateLabel}</span>
            <span>{nextTrip.city}</span>
          </div>
          <div className="mjv2-seats">{nextTrip.seatsUsed}/{nextTrip.seatsTotal} 人</div>
        </div>
      )}

      <div className="mjv2-filters" role="tablist" aria-label="行程狀態篩選">
        {Object.entries(STATUS_META).map(([key, meta]) => {
          const active = key === filter;
          return (
            <button
              key={key}
              type="button"
              className={`mjv2-chip ${active ? 'is-active' : ''}`}
              onClick={() => setFilter(key)}
            >
              {meta.label}
            </button>
          );
        })}
      </div>

      {filteredTrips.length === 0 ? (
        <div className="mjv2-empty">
          <p>目前這個狀態沒有行程。</p>
        </div>
      ) : (
        <div className="mjv2-grid">
          {filteredTrips.map((trip) => {
            const percent = toPercent(trip.seatsUsed, trip.seatsTotal);
            return (
              <article key={trip.id} className={`mjv2-card status-${trip.status}`}>
                <div className="mjv2-card-top">
                  <span className="mjv2-badge">{STATUS_META[trip.status]?.label || trip.status}</span>
                  <span className="mjv2-mood">{trip.mood}</span>
                </div>

                <h3 className="mjv2-card-title">{trip.title}</h3>

                <ul className="mjv2-meta">
                  <li><i className="bi bi-calendar3" /> {trip.dateLabel}</li>
                  <li><i className="bi bi-geo-alt" /> {trip.city}</li>
                  <li><i className="bi bi-person" /> 主揪：{trip.host}</li>
                </ul>

                <div className="mjv2-progress-row">
                  <div className="mjv2-progress-bar" aria-hidden="true">
                    <span style={{ width: `${percent}%` }} />
                  </div>
                  <span className="mjv2-progress-text">{trip.seatsUsed}/{trip.seatsTotal}</span>
                </div>

                {trip.status === 'ended' && (
                  <div className="mjv2-review">
                    {trip.review ? trip.review : '尚未填寫心得。'}
                  </div>
                )}

                <div className="mjv2-actions">
                  <Link to={`/trips/${trip.id}`} className="mjv2-btn ghost">查看行程</Link>
                  {trip.status === 'ended' && !trip.review && (
                    <button type="button" className="mjv2-btn solid">新增心得</button>
                  )}
                  {trip.status === 'ended' && trip.review && (
                    <button type="button" className="mjv2-btn solid">編輯心得</button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
