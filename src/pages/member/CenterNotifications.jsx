import '../../assets/css/notifictions.css';

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: 'apply',
      typeText: '入團申請',
      user: { name: '小白貓', id: 'user123' }, // 獨立會員資料
      content: ' 提出入團申請。',
      linkText: '請審核！',
      badgeClass: 'bg-warning-subtle text-warning-emphasis',
    },
    {
      id: 2,
      type: 'success',
      typeText: '成團通知',
      content: '你參加的 ',
      trip: { name: '2026跨年101煙火團', id: 'trip456' }, // 獨立團名資料
      endContent: ' 已成團！',
      badgeClass: 'bg-info-subtle text-info-emphasis',
    },
    {
      id: 3,
      type: 'cancel',
      typeText: '棄團通知',
      content: '你參加的 ',
      trip: { name: '農場體驗', id: 'trip789' }, // 獨立團名資料
      endContent: ' 已棄團！',
      badgeClass: 'bg-danger-subtle text-danger-emphasis',
    },
  ];

  return (
    <div className="notifications-section mb-4">
      <div className="d-flex justify-content-between align-items-center mb-4 mx-2">
        <h3 className="h3 mb-0">訊息通知</h3>
        <a href="#more" className="trip-text-m link-m link-underline-gray-600 ">查看更多</a>
      </div>

      <div className="list-group list-group-flush bg-white shadow-sm rounded-4 p-4">
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
                    <a href={`/member/${note.user.id}`} className="fw-bold text-dark text-decoration-none mx-1">
                      {note.user.name}
                    </a>
                  )}

                  {/* 如果有後段文字 */}
                  {note.content}


                  {/* 團名連結 */}
                  {note.trip && (
                    <a href={`/trip-detail/${note.trip.id}`} className="fw-bold text-dark text-decoration-none mx-1">
                      {note.trip.name}
                    </a>
                  )}

                  {/* 如果有後段文字 (例如：已成團！) */}
                  {note.endContent}

                  {/* 審核連結 */}
                  {note.linkText && (
                    <a href="#audit" className="ms-1 fw-bold text-dark text-decoration-underline">
                      {note.linkText}
                    </a>
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