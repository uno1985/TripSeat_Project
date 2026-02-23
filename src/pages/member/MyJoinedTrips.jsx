import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/myJoinedTrips.css';

const TRIPS = [
  {
    id: 701,
    title: '阿里山雲海日出線',
    status: 'upcoming',
    date: '2026/04/03 03:50',
    location: '嘉義',
    host: '晨光小隊',
    participants: 5,
    maxPeople: 7,
    image: 'https://images.unsplash.com/photo-1464822759844-d150ad6d1b2f?q=80&w=1200&fit=crop',
    hook: '凌晨第一班小火車，直達觀景平台。',
    tags: ['日出', '攝影', '山線'],
    story: null,
  },
  {
    id: 702,
    title: '台南老城夜拍散步',
    status: 'open',
    date: '2026/03/21 18:40',
    location: '台南',
    host: '阿修',
    participants: 4,
    maxPeople: 8,
    image: 'https://images.unsplash.com/photo-1526481280695-3c46915b9b56?q=80&w=1200&fit=crop',
    hook: '路線以巷弄光影為主，附現場構圖建議。',
    tags: ['夜拍', '散步', '城市'],
    story: null,
  },
  {
    id: 703,
    title: '花蓮海岸慢跑團',
    status: 'upcoming',
    date: '2026/03/30 06:20',
    location: '花蓮',
    host: '小魚',
    participants: 6,
    maxPeople: 6,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&fit=crop',
    hook: '配速分組，跑後早餐集合。',
    tags: ['運動', '海線'],
    story: null,
  },
  {
    id: 704,
    title: '台東海線慢旅兩日',
    status: 'ended',
    date: '2026/01/18 09:00',
    location: '台東',
    host: 'Ming',
    participants: 8,
    maxPeople: 8,
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=1200&fit=crop',
    hook: '海景民宿與在地早餐路線。',
    tags: ['慢旅', '海景'],
    story: '整體節奏很舒服，住宿點位和停留時間抓得剛好。',
  },
  {
    id: 705,
    title: '屏東山海野炊團',
    status: 'ended',
    date: '2025/12/20 10:00',
    location: '屏東',
    host: '布魯',
    participants: 6,
    maxPeople: 6,
    image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=1200&fit=crop',
    hook: '分組料理比賽與海邊日落收尾。',
    tags: ['野炊', '團隊'],
    story: null,
  },
];

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

export default function MyJoinedTripsV7() {
  const [status, setStatus] = useState('all');

  const filtered = useMemo(() => {
    if (status === 'all') return TRIPS;
    return TRIPS.filter((trip) => trip.status === status);
  }, [status]);

  const counts = useMemo(() => {
    return {
      all: TRIPS.length,
      upcoming: TRIPS.filter((trip) => trip.status === 'upcoming').length,
      open: TRIPS.filter((trip) => trip.status === 'open').length,
      ended: TRIPS.filter((trip) => trip.status === 'ended').length,
    };
  }, []);

  const [focusId, setFocusId] = useState(TRIPS[0].id);

  const focusTrip = useMemo(() => {
    const candidate = filtered.find((trip) => trip.id === focusId);
    return candidate || filtered[0] || null;
  }, [filtered, focusId]);

  const stories = TRIPS.filter((trip) => trip.status === 'ended');

  return (
    <section className="mjv7">
      <header className="mjv7-editorial-head">
        <div>
          <p className="mjv7-kicker">TRIPSEAT MEMBER EDIT</p>
          <h2 className="mjv7-title">我的參加行程 v7</h2>
          <p className="mjv7-sub">這版以「視覺編輯版面」呈現你的旅程節奏與故事感。</p>
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
