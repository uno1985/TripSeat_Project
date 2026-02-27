import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import '../../assets/css/memberNotifications.css';

const API_URL = import.meta.env.VITE_API_BASE;

const TYPE_META = {
  apply:    { text: '入團申請', icon: 'bi-person-plus-fill',      color: 'warning' },
  approval: { text: '審核通過', icon: 'bi-check-circle-fill',     color: 'success' },
  rejected: { text: '審核未通過', icon: 'bi-x-circle-fill',       color: 'danger'  },
  success:  { text: '成團通知', icon: 'bi-people-fill',            color: 'info'    },
  cancel:   { text: '棄團通知', icon: 'bi-slash-circle-fill',      color: 'danger'  },
  review:   { text: '心得通知', icon: 'bi-star-fill',              color: 'primary' },
  system:   { text: '系統通知', icon: 'bi-megaphone-fill',         color: 'secondary'},
};

const formatTime = (t) => {
  if (!t) return '';
  return new Date(t).toLocaleString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const MemberNotifications = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('notif'); // 'notif' | 'message'

  // ── 通知 ──
  const [notifs, setNotifs] = useState([]);
  const [notifLoading, setNotifLoading] = useState(true);
  const [notifFilter, setNotifFilter] = useState('all'); // all | unread | read

  // ── 私訊 ──
  const [messages, setMessages] = useState([]);
  const [msgLoading, setMsgLoading] = useState(true);
  const [expandedMsgId, setExpandedMsgId] = useState(null); // 展開回覆的訊息 id
  const [replyTexts, setReplyTexts] = useState({});          // { msgGroupKey: text }
  const [sendingId, setSendingId] = useState(null);

  const getToken = () =>
    document.cookie.split('; ').find(r => r.startsWith('tripToken='))?.split('=')[1];

  // ── 抓通知 ──
  useEffect(() => {
    if (!user?.id) { setNotifLoading(false); return; }
    setNotifLoading(true);
    axios.get(`${API_URL}/664/notifications?user_id=${user.id}&_sort=created_at&_order=desc`)
      .then(res => setNotifs(res.data || []))
      .catch(() => setNotifs([]))
      .finally(() => setNotifLoading(false));
  }, [user?.id]);

  // ── 抓私訊（我收到的 + 我寄出的） ──
  useEffect(() => {
    if (!user?.id) { setMsgLoading(false); return; }
    setMsgLoading(true);
    Promise.all([
      axios.get(`${API_URL}/664/messages?receiver_id=${user.id}&_sort=created_at&_order=desc`),
      axios.get(`${API_URL}/664/messages?sender_id=${user.id}&_sort=created_at&_order=desc`),
    ])
      .then(([receivedRes, sentRes]) => {
        const all = [...(receivedRes.data || []), ...(sentRes.data || [])]
          .filter(m => !m.deleted_at)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setMessages(all);
      })
      .catch(() => setMessages([]))
      .finally(() => setMsgLoading(false));
  }, [user?.id]);

  // ── 標記通知已讀 ──
  const markNotifRead = async (id) => {
    const token = getToken();
    if (!token) return;
    await axios.patch(`${API_URL}/664/notifications/${id}`, { is_read: true }, { headers: { Authorization: `Bearer ${token}` } });
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAllNotifRead = async () => {
    const token = getToken();
    if (!token) return;
    const unread = notifs.filter(n => !n.is_read);
    await Promise.all(unread.map(n =>
      axios.patch(`${API_URL}/664/notifications/${n.id}`, { is_read: true }, { headers: { Authorization: `Bearer ${token}` } })
    ));
    setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  // ── 標記私訊已讀 ──
  const markMsgRead = async (id) => {
    const token = getToken();
    if (!token) return;
    await axios.patch(`${API_URL}/664/messages/${id}`, { is_read: true }, { headers: { Authorization: `Bearer ${token}` } });
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
  };

  // ── 回覆私訊 ──
  const handleReply = async (originalMsg) => {
    const content = (replyTexts[originalMsg.id] || '').trim();
    if (!content) return;
    const token = getToken();
    if (!token || !user?.id) return;
    setSendingId(originalMsg.id);
    try {
      const res = await axios.post(
        `${API_URL}/664/messages`,
        {
          id: crypto.randomUUID(),
          trip_id: originalMsg.trip_id,
          trip_title: originalMsg.trip_title,
          sender_id: user.id,
          sender_name: user.name || '我',
          sender_avatar: user.avatar || '',
          receiver_id: originalMsg.sender_id,
          receiver_name: originalMsg.sender_name,
          content,
          is_read: false,
          created_at: new Date().toISOString(),
          deleted_at: null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(prev => [res.data, ...prev]);
      setReplyTexts(prev => ({ ...prev, [originalMsg.id]: '' }));
      setExpandedMsgId(null);
    } finally {
      setSendingId(null);
    }
  };

  // ── 通知過濾 ──
  const filteredNotifs = useMemo(() => {
    if (notifFilter === 'unread') return notifs.filter(n => !n.is_read);
    if (notifFilter === 'read')   return notifs.filter(n => n.is_read);
    return notifs;
  }, [notifs, notifFilter]);

  // ── 私訊依旅程分組（每個 trip + 對方 一組，取最新一則） ──
  const msgGroups = useMemo(() => {
    const groups = new Map();
    messages.forEach(m => {
      const otherId = m.sender_id === user?.id ? m.receiver_id : m.sender_id;
      const key = `${m.trip_id || 'no-trip'}__${otherId}`;
      if (!groups.has(key) || new Date(m.created_at) > new Date(groups.get(key).latest.created_at)) {
        groups.set(key, {
          key,
          trip_id: m.trip_id,
          trip_title: m.trip_title,
          otherId,
          otherName: m.sender_id === user?.id ? m.receiver_name : m.sender_name,
          otherAvatar: m.sender_id === user?.id ? m.receiver_avatar : m.sender_avatar,
          latest: m,
          unread: 0,
        });
      }
    });
    // 計算每組未讀數
    messages.forEach(m => {
      const otherId = m.sender_id === user?.id ? m.receiver_id : m.sender_id;
      const key = `${m.trip_id || 'no-trip'}__${otherId}`;
      if (m.receiver_id === user?.id && !m.is_read && groups.has(key)) {
        groups.get(key).unread++;
      }
    });
    return [...groups.values()].sort((a, b) => new Date(b.latest.created_at) - new Date(a.latest.created_at));
  }, [messages, user?.id]);

  // ── 統計 ──
  const unreadNotifCount = notifs.filter(n => !n.is_read).length;
  const unreadMsgCount = messages.filter(m => m.receiver_id === user?.id && !m.is_read).length;

  return (
    <div className="member-notifications-v2">
      {/* 頁面標題 */}
      <div className="notif-v2-header mb-4">
        <h2 className="h3 trip-text-gray-800">
          <i className="bi bi-bell-fill me-2 trip-text-primary-800"></i>
          訊息通知
        </h2>
        <p className="trip-text-s trip-text-gray-400 mt-1 mb-0">查看通知與旅程相關訊息</p>
      </div>

      {/* Tab 切換 */}
      <div className="notif-v2-tabs mb-4">
        <button
          className={`notif-v2-tab-btn ${tab === 'notif' ? 'active' : ''}`}
          onClick={() => setTab('notif')}
        >
          <i className="bi bi-bell me-1"></i>通知
          {unreadNotifCount > 0 && <span className="notif-v2-badge">{unreadNotifCount}</span>}
        </button>
        <button
          className={`notif-v2-tab-btn ${tab === 'message' ? 'active' : ''}`}
          onClick={() => setTab('message')}
        >
          <i className="bi bi-chat-dots me-1"></i>私訊
          {unreadMsgCount > 0 && <span className="notif-v2-badge">{unreadMsgCount}</span>}
        </button>
      </div>

      {/* ════ Tab 1：通知 ════ */}
      {tab === 'notif' && (
        <div>
          {/* 工具列 */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex gap-2">
              {['all', 'unread', 'read'].map(f => (
                <button
                  key={f}
                  className={`notif-v2-filter-btn ${notifFilter === f ? 'active' : ''}`}
                  onClick={() => setNotifFilter(f)}
                >
                  {f === 'all' ? '全部' : f === 'unread' ? `未讀 (${unreadNotifCount})` : '已讀'}
                </button>
              ))}
            </div>
            {unreadNotifCount > 0 && (
              <button className="btn btn-sm trip-btn-outline-primary trip-btn-s" onClick={markAllNotifRead}>
                <i className="bi bi-check-all me-1"></i>全部標為已讀
              </button>
            )}
          </div>

          {/* 通知列表 */}
          {notifLoading ? (
            <div className="py-4 text-center trip-text-gray-400">載入中...</div>
          ) : filteredNotifs.length === 0 ? (
            <div className="notif-v2-empty">
              <i className="bi bi-inbox"></i>
              <h5>沒有通知</h5>
              <p>目前沒有符合條件的通知</p>
            </div>
          ) : (
            <div className="notif-v2-list">
              {filteredNotifs.map(notif => {
                const meta = TYPE_META[notif.type] || TYPE_META.system;
                return (
                  <div
                    key={notif.id}
                    className={`notif-v2-item ${!notif.is_read ? 'unread' : ''}`}
                    onClick={() => !notif.is_read && markNotifRead(notif.id)}
                    style={{ cursor: !notif.is_read ? 'pointer' : 'default' }}
                  >
                    <div className={`notif-v2-icon notif-v2-icon-${meta.color}`}>
                      <i className={`bi ${meta.icon}`}></i>
                    </div>
                    <div className="notif-v2-content">
                      <div className="notif-v2-main">
                        <span className={`notif-v2-type-tag notif-v2-tag-${notif.type}`}>{meta.text}</span>
                        <div className="notif-v2-text">
                          {notif.actor_name && (
                            <strong className="me-1">{notif.actor_name}</strong>
                          )}
                          <span>{notif.content}</span>
                          {notif.trip_title && (
                            <Link to={`/trips/${notif.trip_id}`} className="notif-v2-trip-link ms-1">
                              「{notif.trip_title}」
                            </Link>
                          )}
                        </div>
                        <div className="notif-v2-meta">
                          <span className="notif-v2-time">
                            <i className="bi bi-clock me-1"></i>{formatTime(notif.created_at)}
                          </span>
                          {notif.action_text && notif.action_link && (
                            <Link to={notif.action_link} className="notif-v2-action-btn ms-2"
                              onClick={e => e.stopPropagation()}>
                              {notif.action_text} →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                    {!notif.is_read && <div className="notif-v2-unread-dot"></div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ════ Tab 2：私訊 ════ */}
      {tab === 'message' && (
        <div>
          {msgLoading ? (
            <div className="py-4 text-center trip-text-gray-400">載入中...</div>
          ) : msgGroups.length === 0 ? (
            <div className="notif-v2-empty">
              <i className="bi bi-chat-dots"></i>
              <h5>還沒有私訊</h5>
              <p>私訊會在團主或團員傳送訊息後出現</p>
            </div>
          ) : (
            <div className="notif-v2-list">
              {msgGroups.map(group => {
                const isExpanded = expandedMsgId === group.key;
                const isMe = group.latest.sender_id === user?.id;
                return (
                  <div
                    key={group.key}
                    className={`notif-v2-item ${group.unread > 0 ? 'unread' : ''}`}
                  >
                    {/* 頭像 */}
                    <div className="notif-v2-avatar">
                      <img
                        src={group.otherAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${group.otherId}`}
                        alt={group.otherName}
                      />
                    </div>

                    {/* 內容 */}
                    <div className="notif-v2-content">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong>{group.otherName}</strong>
                          {group.trip_title && (
                            <Link to={`/trips/${group.trip_id}`} className="notif-v2-trip-link ms-2 trip-text-s">
                              關於「{group.trip_title}」
                            </Link>
                          )}
                        </div>
                        <span className="notif-v2-time trip-text-s trip-text-gray-400">
                          {formatTime(group.latest.created_at)}
                        </span>
                      </div>

                      {/* 最新訊息預覽 */}
                      <p className="mb-1 trip-text-s trip-text-gray-600 mt-1">
                        {isMe ? <span className="trip-text-gray-400 me-1">我：</span> : null}
                        {group.latest.content}
                      </p>

                      {/* 未讀 badge + 操作按鈕 */}
                      <div className="d-flex align-items-center gap-2 mt-1">
                        {group.unread > 0 && (
                          <span className="badge bg-danger rounded-pill">{group.unread} 則未讀</span>
                        )}
                        <button
                          className="btn btn-sm trip-btn-outline-primary trip-btn-s"
                          onClick={() => {
                            // 展開/收合回覆框
                            setExpandedMsgId(isExpanded ? null : group.key);
                            // 標記已讀
                            messages
                              .filter(m => m.receiver_id === user?.id && !m.is_read &&
                                m.sender_id === group.otherId && m.trip_id === group.trip_id)
                              .forEach(m => markMsgRead(m.id));
                          }}
                        >
                          <i className={`bi bi-chat-${isExpanded ? 'fill' : ''} me-1`}></i>
                          {isExpanded ? '收合' : '回覆'}
                        </button>
                      </div>

                      {/* 回覆輸入框 */}
                      {isExpanded && (
                        <div className="notif-v2-reply-box mt-3">
                          <textarea
                            className="form-control mb-2"
                            rows={2}
                            placeholder={`回覆給 ${group.otherName}...`}
                            value={replyTexts[group.latest.id] || ''}
                            onChange={e => setReplyTexts(prev => ({ ...prev, [group.latest.id]: e.target.value }))}
                            disabled={sendingId === group.latest.id}
                            style={{ resize: 'none' }}
                          />
                          <div className="d-flex justify-content-end gap-2">
                            <button
                              className="btn trip-btn-s btn-outline-secondary"
                              onClick={() => setExpandedMsgId(null)}
                              disabled={sendingId === group.latest.id}
                            >取消</button>
                            <button
                              className="btn trip-btn-s trip-btn-primary"
                              onClick={() => handleReply(group.latest)}
                              disabled={sendingId === group.latest.id || !(replyTexts[group.latest.id] || '').trim()}
                            >
                              {sendingId === group.latest.id
                                ? <><span className="spinner-border spinner-border-sm me-1"></span>送出中</>
                                : <><i className="bi bi-send me-1"></i>送出</>}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {group.unread > 0 && <div className="notif-v2-unread-dot"></div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MemberNotifications;
