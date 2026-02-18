import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/myJoinedTrips-v5.css';

const JOINED_TRIPS = [
  {
    id: 501,
    title: '阿里山日出攝影團',
    dateLabel: '2026/03/22 03:40',
    city: '嘉義',
    status: 'upcoming',
    host: '晨光隊長',
    hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunrise',
    seatsUsed: 4,
    seatsTotal: 6,
    theme: '拍照取景',
    highlight: '含火車位與觀景平台卡位',
    checklist: ['相機電池充飽', '保暖外套', '頭燈'],
    review: null,
  },
  {
    id: 502,
    title: '台東海線慢旅・兩日',
    dateLabel: '2026/04/05 08:10',
    city: '台東',
    status: 'open',
    host: '小魚',
    hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fish',
    seatsUsed: 5,
    seatsTotal: 8,
    theme: '放鬆行程',
    highlight: '海景民宿＋在地早餐',
    checklist: ['身分證件', '薄外套', '防曬'],
    review: null,
  },
  {
    id: 503,
    title: '大稻埕街拍夜走',
    dateLabel: '2026/01/12 18:30',
    city: '台北',
    status: 'ended',
    host: '阿修',
    hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nightwalk',
    seatsUsed: 7,
    seatsTotal: 7,
    theme: '城市散策',
    highlight: '專人導覽老街歷史',
    checklist: ['輕便鞋', '行動電源'],
    review: '節奏很舒服，路線安排也很好拍，想再跟一次。',
  },
  {
    id: 504,
    title: '屏東山海野炊團',
    dateLabel: '2025/12/20 10:00',
    city: '屏東',
    status: 'ended',
    host: '布魯',
    hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=camp',
    seatsUsed: 6,
    seatsTotal: 6,
    theme: '戶外料理',
    highlight: '現場分組料理競賽',
    checklist: ['個人餐具', '替換衣物'],
    review: null,
  },
  {
    id: 505,
    title: '北海岸單車半日',
    dateLabel: '2026/03/29 07:20',
    city: '新北',
    status: 'upcoming',
    host: '凱特',
    hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bike',
    seatsUsed: 3,
    seatsTotal: 5,
    theme: '運動流汗',
    highlight: '補給點與跟車支援',
    checklist: ['水壺', '手套', '防風衣'],
    review: null,
  },
];

const LANE_META = {
  upcoming: {
    label: '待出發',
    desc: '已成團，進入準備階段',
  },
  open: {
    label: '招募中',
    desc: '還有名額，歡迎揪朋友',
  },
  ended: {
    label: '已結束',
    desc: '可補寫心得與評分',
  },
};

function getPercent(used, total) {
  if (!total) return 0;
  return Math.round((used / total) * 100);
}

export default function MyJoinedTripsV5() {
  const [activeLane, setActiveLane] = useState('upcoming');
  const [keyword, setKeyword] = useState('');

  const laneCounts = useMemo(() => {
    return {
      upcoming: JOINED_TRIPS.filter((trip) => trip.status === 'upcoming').length,
      open: JOINED_TRIPS.filter((trip) => trip.status === 'open').length,
      ended: JOINED_TRIPS.filter((trip) => trip.status === 'ended').length,
    };
  }, []);

  const filteredTrips = useMemo(() => {
    const text = keyword.trim().toLowerCase();
    return JOINED_TRIPS
      .filter((trip) => trip.status === activeLane)
      .filter((trip) => {
        if (!text) return true;
        return `${trip.title}${trip.city}${trip.host}`.toLowerCase().includes(text);
      });
  }, [activeLane, keyword]);

  const [selectedId, setSelectedId] = useState(() => {
    const first = JOINED_TRIPS.find((trip) => trip.status === 'upcoming');
    return first ? first.id : JOINED_TRIPS[0]?.id;
  });

  const selectedTrip = useMemo(() => {
    const inLane = filteredTrips.find((trip) => trip.id === selectedId);
    if (inLane) return inLane;
    return filteredTrips[0] || null;
  }, [filteredTrips, selectedId]);

  const endedCount = laneCounts.ended;
  const reviewCount = JOINED_TRIPS.filter((trip) => trip.status === 'ended' && trip.review).length;
  const reviewRate = endedCount ? Math.round((reviewCount / endedCount) * 100) : 0;

  return (
    <section className="mjv5">
      <header className="mjv5-head">
        <div>
          <h2 className="mjv5-title">我的旅程軌道（v5）</h2>
          <p className="mjv5-sub">用分段軌道快速管理每一趟同行進度</p>
        </div>
        <Link to="/member/trips" className="mjv5-link-all">
          看完整清單
        </Link>
      </header>

      <div className="mjv5-metrics">
        <article>
          <span>總參加</span>
          <strong>{JOINED_TRIPS.length}</strong>
        </article>
        <article>
          <span>本季待出發</span>
          <strong>{laneCounts.upcoming}</strong>
        </article>
        <article>
          <span>心得完成率</span>
          <strong>{reviewRate}%</strong>
        </article>
      </div>

      <div className="mjv5-lanes" role="tablist" aria-label="行程階段">
        {Object.entries(LANE_META).map(([key, meta]) => {
          const active = key === activeLane;
          return (
            <button
              key={key}
              type="button"
              className={`mjv5-lane ${active ? 'is-active' : ''}`}
              onClick={() => {
                setActiveLane(key);
                const next = JOINED_TRIPS.find((trip) => trip.status === key);
                if (next) setSelectedId(next.id);
              }}
            >
              <span className="mjv5-lane-name">{meta.label}</span>
              <span className="mjv5-lane-count">{laneCounts[key]}</span>
              <small>{meta.desc}</small>
            </button>
          );
        })}
      </div>

      <div className="mjv5-toolbar">
        <label htmlFor="mjv5-search">快速搜尋</label>
        <input
          id="mjv5-search"
          type="text"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="輸入地點、主揪或關鍵字"
        />
      </div>

      <div className="mjv5-main">
        <aside className="mjv5-rail-wrap">
          <ol className="mjv5-rail">
            {filteredTrips.map((trip) => {
              const active = selectedTrip?.id === trip.id;
              const percent = getPercent(trip.seatsUsed, trip.seatsTotal);
              return (
                <li key={trip.id} className={`mjv5-stop ${active ? 'is-active' : ''}`}>
                  <button type="button" onClick={() => setSelectedId(trip.id)}>
                    <div className="mjv5-stop-top">
                      <strong>{trip.title}</strong>
                      <span>{trip.dateLabel}</span>
                    </div>
                    <div className="mjv5-stop-bottom">
                      <span>{trip.city} ・ 主揪 {trip.host}</span>
                      <span>已滿 {percent}%</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
          {filteredTrips.length === 0 && (
            <div className="mjv5-empty">目前這個階段沒有符合條件的行程。</div>
          )}
        </aside>

        <section className="mjv5-panel">
          {selectedTrip ? (
            <>
              <div className="mjv5-panel-head">
                <p className="mjv5-status">{LANE_META[selectedTrip.status].label}</p>
                <h3>{selectedTrip.title}</h3>
                <p>{selectedTrip.highlight}</p>
                <div className="mjv5-host-inline">
                  <img src={selectedTrip.hostAvatar} alt={selectedTrip.host} />
                  <span>主揪：{selectedTrip.host}</span>
                </div>
              </div>

              <div className="mjv5-panel-grid">
                <div>
                  <h4>基本資訊</h4>
                  <ul>
                    <li><i className="bi bi-calendar3" /> {selectedTrip.dateLabel}</li>
                    <li><i className="bi bi-geo-alt" /> {selectedTrip.city}</li>
                    <li><i className="bi bi-people" /> {selectedTrip.seatsUsed}/{selectedTrip.seatsTotal} 人</li>
                    <li><i className="bi bi-stars" /> 主題：{selectedTrip.theme}</li>
                  </ul>
                </div>
                <div>
                  <h4>出發前清單</h4>
                  <ul>
                    {selectedTrip.checklist.map((item) => (
                      <li key={item}><i className="bi bi-check-circle" /> {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {selectedTrip.status === 'ended' && (
                <div className="mjv5-review">
                  <h4>旅後心得</h4>
                  <p>{selectedTrip.review || '這趟還沒有填寫心得，歡迎補上你的真實體驗。'}</p>
                </div>
              )}

              <div className="mjv5-actions">
                <Link to={`/trips/${selectedTrip.id}`} className="btn-view">查看行程</Link>
                {(selectedTrip.status === 'open' || selectedTrip.status === 'upcoming') && (
                  <button type="button" className="btn-chat">聯絡主揪</button>
                )}
                {selectedTrip.status === 'ended' && !selectedTrip.review && (
                  <button type="button" className="btn-review">新增心得</button>
                )}
                {selectedTrip.status === 'ended' && selectedTrip.review && (
                  <button type="button" className="btn-review">編輯心得</button>
                )}
              </div>
            </>
          ) : (
            <div className="mjv5-empty-panel">請先選擇一個行程節點。</div>
          )}
        </section>
      </div>
    </section>
  );
}
