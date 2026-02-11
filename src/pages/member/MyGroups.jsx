import '../../assets/css/myGroups.css';
import time from '../../assets/images/time.svg'

const MyGroups = () => {
  const groups = [
    {
      id: 1,
      status: '招募中',
      statusClass: 'bg-warning-subtle text-warning-emphasis',
      title: '迎接2026年 | 包棟跨年派對 一起歡樂',
      time: '2025/12/31 23:00 (三)',
      image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=2069&auto=format&fit=crop',
      remaining: 2,
      participants: 2
    },
    {
      id: 2,
      status: '已成團',
      statusClass: 'bg-success-subtle text-success-emphasis',
      title: '阿里山小火車一日遊',
      time: '2025/01/10 06:00 (六)',
      image: 'https://res.klook.com/image/upload/w_500,h_313,c_fill,q_85/activities/ewhfvs3noqk0l3xkujqg.webp',
      participants: 2
    },
    {
      id: 3,
      status: '已結束',
      statusClass: 'bg-secondary-subtle text-secondary-emphasis',
      title: '卓也藍染、日月潭一日遊...',
      time: '2025/12/30 10:00 (二)',
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop',
      participants: 5
    }
  ];

  return (
    <div className="my-groups-section my-5">
      <div className="d-flex justify-content-between align-items-center mb-4 mx-2">
        <h3 className="h3 mb-0">我的揪團</h3>
        <a href="#more" className="trip-text-m link-m link-underline-gray-600">查看更多</a>
      </div>

      <div className="row g-4">
        {groups.map((group) => (
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
                <button className="btn btn-warning w-100 py-2 fw-bold text-white rounded-bottom">
                  管理行程
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyGroups;