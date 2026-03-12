import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import '../../assets/css/memberNotifications.css';

const API_URL = import.meta.env.VITE_API_BASE;
const MEMBER_UNREAD_EVENT = 'tripseat:member-unread-changed';

const TYPE_META = {
  apply: { text: '入團申請', icon: 'bi-person-plus-fill', color: 'warning' },
  approval: { text: '審核通過', icon: 'bi-check-circle-fill', color: 'success' },
  rejected: { text: '審核未通過', icon: 'bi-x-circle-fill', color: 'danger' },
  success: { text: '成團通知', icon: 'bi-people-fill', color: 'info' },
  cancel: { text: '棄團通知', icon: 'bi-slash-circle-fill', color: 'danger' },
  review: { text: '心得通知', icon: 'bi-star-fill', color: 'primary' },
  system: { text: '系統通知', icon: 'bi-megaphone-fill', color: 'secondary' },
};

const formatTime = (t) => {
  if (!t) return '';
  return new Date(t).toLocaleString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const MemberNotifications = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const userName = user?.name || '';
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
    if (!userId) { setNotifLoading(false); return; }
    setNotifLoading(true);
    axios.get(`${API_URL}/664/notifications?user_id=${userId}&_sort=created_at&_order=desc`)
      .then(res => setNotifs(res.data || []))
      .catch(() => setNotifs([]))
      .finally(() => setNotifLoading(false));
  }, [userId]);

  // ── 抓私訊（messages 表 + notifications 表，統一格式） ──
  useEffect(() => {
    if (!userId) { setMsgLoading(false); return; }
    setMsgLoading(true);

    const fetchMessages = Promise.all([
      axios.get(`${API_URL}/664/messages?receiver_id=${userId}&_sort=created_at&_order=desc`),
      axios.get(`${API_URL}/664/messages?sender_id=${userId}&_sort=created_at&_order=desc`),
    ]).then(([r, s]) => [...(r.data || []), ...(s.data || [])]).catch(() => []);

    // notifications 表（MemberTrips 發送的訊息，欄位為 recipient_id / message）
    const fetchNotifMsgs = Promise.all([
      axios.get(`${API_URL}/664/notifications?recipient_id=${userId}&_sort=created_at&_order=desc`),
      axios.get(`${API_URL}/664/notifications?sender_id=${userId}&_sort=created_at&_order=desc`),
    ]).then(([r, s]) => {
      const normalize = (item, isMeReceiver) => ({
        ...item,
        _source: 'notification',
        receiver_id: isMeReceiver ? userId : (item.recipient_id || ''),
        receiver_name: isMeReceiver ? userName : (item.recipient_name || ''),
        receiver_avatar: '',
        content: item.message || item.content || '',
      });
      return [
        ...(r.data || []).map(m => normalize(m, true)),
        ...(s.data || []).map(m => normalize(m, false)),
      ];
    }).catch(() => []);

    Promise.all([fetchMessages, fetchNotifMsgs]).then(([msgs, notifMsgs]) => {
      const seen = new Set();
      const all = [...msgs, ...notifMsgs]
        .filter(m => !m.deleted_at)
        .filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setMessages(all);
    }).catch(() => setMessages([])).finally(() => setMsgLoading(false));
  }, [userId, userName]);

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


  // ── 將某對象的所有未讀訊息標記已讀（同步更新 state，不等 API） ──
  const markGroupRead = (otherId) => {
    const unreadIds = messages.filter(
      m => m.receiver_id === user?.id && !m.is_read && m.sender_id === otherId
    ).map(m => m.id);
    if (unreadIds.length === 0) return;
    // 立即更新 state（讓頁籤數字和 badge 即時消失）
    setMessages(prev => prev.map(m =>
      unreadIds.includes(m.id) ? { ...m, is_read: true } : m
    ));
    // 背景同步 API
    const token = getToken();
    if (!token) return;
    unreadIds.forEach(id => {
      const target = messages.find(m => m.id === id);
      const table = target?._source === 'notification' ? 'notifications' : 'messages';
      axios.patch(
        `${API_URL}/664/${table}/${id}`,
        { is_read: true },
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch(() => { });
    });
  };

  // ── 回覆私訊 ──
  const handleReply = async (originalMsg) => {
    // 支援用 group.key 當 replyKey（避免 latest 換掉後 key 失效）
    const textKey = originalMsg._replyKey || originalMsg.id;
    const replyContent = (replyTexts[textKey] || '').trim();
    if (!replyContent) return;
    const token = getToken();
    if (!token || !user?.id) return;
    setSendingId(originalMsg.id);
    try {
      // 依原始訊息來源決定回覆寫入哪張表
      if (originalMsg._source === 'notification') {
        // 回覆到 notifications 表（對齊 MemberTrips 發送格式）
        const res = await axios.post(
          `${API_URL}/664/notifications`,
          {
            recipient_id: originalMsg.sender_id,
            recipient_name: originalMsg.sender_name || '',
            sender_id: user.id,
            sender_name: user.name || '我',
            sender_avatar: user.avatar || '',
            message: replyContent,
            content: replyContent,
            is_read: false,
            created_at: new Date().toISOString(),
            deleted_at: null,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // 正規化後放入 messages state
        const normalized = {
          ...res.data,
          _source: 'notification',
          receiver_id: originalMsg.sender_id,
          receiver_name: originalMsg.sender_name || '',
          receiver_avatar: '',
          content: replyContent,
        };
        setMessages(prev => [normalized, ...prev]);
      } else {
        // 回覆到 messages 表（原有格式）
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
            content: replyContent,
            is_read: false,
            created_at: new Date().toISOString(),
            deleted_at: null,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(prev => [res.data, ...prev]);
      }
      setReplyTexts(prev => ({ ...prev, [textKey]: '' }));
      setExpandedMsgId(null);
    } finally {
      setSendingId(null);
    }
  };

  // ── 通知過濾 ──
  const filteredNotifs = useMemo(() => {
    if (notifFilter === 'unread') return notifs.filter(n => !n.is_read);
    if (notifFilter === 'read') return notifs.filter(n => n.is_read);
    return notifs;
  }, [notifs, notifFilter]);

  // ── 私訊依對方分組（key = otherId） ──
  const msgGroups = useMemo(() => {
    const groups = new Map();

    messages.forEach(m => {
      const otherId = m.sender_id === user?.id ? m.receiver_id : m.sender_id;
      const key = otherId || 'unknown';
      const existing = groups.get(key);

      // otherName / otherAvatar：只從「對方是 sender」的訊息取，確保不因自己回覆後跑掉
      const isFromOther = m.sender_id !== user?.id;
      const candidateName = isFromOther ? (m.sender_name || '') : null;
      const candidateAvatar = isFromOther ? (m.sender_avatar || '') : null;

      if (!existing) {
        groups.set(key, {
          key,
          trip_id: m.trip_id || null,
          trip_title: m.trip_title || null,
          otherId,
          // 若這則是自己寄出的，name/avatar 先暫存空，等後續掃到對方的訊息再補
          otherName: candidateName ?? '',
          otherAvatar: candidateAvatar ?? '',
          latest: m,
          unread: 0,
        });
      } else {
        // 更新 latest（取最新一則）
        if (new Date(m.created_at) > new Date(existing.latest.created_at)) {
          existing.latest = m;
        }
        // 只要掃到對方寄來的訊息就鎖定 name/avatar，不再被自己寄出的覆蓋
        if (isFromOther && !existing.otherName) {
          existing.otherName = candidateName ?? '';
          existing.otherAvatar = candidateAvatar ?? '';
        }
      }
    });

    // 計算每組未讀數
    messages.forEach(m => {
      const otherId = m.sender_id === user?.id ? m.receiver_id : m.sender_id;
      const key = otherId || 'unknown';
      if (m.receiver_id === user?.id && !m.is_read && groups.has(key)) {
        groups.get(key).unread++;
      }
    });

    return [...groups.values()].sort((a, b) => new Date(b.latest.created_at) - new Date(a.latest.created_at));
  }, [messages, user?.id]);

  // ── 統計 ──
  const unreadNotifCount = notifs.filter(n => !n.is_read).length;
  const unreadMsgCount = messages.filter(m => m.receiver_id === user?.id && !m.is_read).length;

  // [AI修改開始 2026-03-11] 通知頁內未讀數變化時，同步通知 MemberSidebar 更新紅色 badge
  useEffect(() => {
    if (!user?.id) return;
    window.dispatchEvent(new CustomEvent(MEMBER_UNREAD_EVENT, {
      detail: { total: unreadNotifCount + unreadMsgCount }
    }));
  }, [unreadMsgCount, unreadNotifCount, user?.id]);
  // [AI修改結束 2026-03-11]

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
                // 取出這組對話的所有訊息，按時間舊→新排序
                const threadMsgs = messages
                  .filter(m => {
                    const otherId = m.sender_id === user?.id ? m.receiver_id : m.sender_id;
                    return (otherId || 'unknown') === group.key;
                  })
                  .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                // 用固定的 group.key 當 textarea 的 state key，不跟著 latest 跑
                const replyKey = group.key;
                // 找到對方原始的最早訊息，用來正確傳給 handleReply
                const firstFromOther = threadMsgs.find(m => m.sender_id !== user?.id);
                return (
                  <div
                    key={group.key}
                    className={`notif-v2-item ${group.unread > 0 ? 'unread' : ''}`}
                  >
                    {/* 頭像：固定用對方頭像，不隨 latest 變動 */}
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

                      {/* 最新訊息預覽（收合時只顯示最後一則） */}
                      {!isExpanded && (
                        <p className="mb-1 trip-text-s trip-text-gray-600 mt-1">
                          {isMe ? <span className="trip-text-gray-400 me-1">我：</span> : null}
                          {group.latest.content}
                        </p>
                      )}

                      {/* 展開時顯示完整對話紀錄 */}
                      {isExpanded && (
                        <div className="notif-v2-thread mt-2">
                          {threadMsgs.map(m => {
                            const isMine = m.sender_id === user?.id;
                            return (
                              <div
                                key={m.id}
                                className={`notif-v2-bubble ${isMine ? 'notif-v2-bubble-me' : 'notif-v2-bubble-other'}`}
                              >
                                <span className="notif-v2-bubble-name trip-text-xs trip-text-gray-400">
                                  {isMine ? '我' : group.otherName}
                                </span>
                                <div className="notif-v2-bubble-text trip-text-s trip-text-gray-600">{m.content}</div>
                                <span className="notif-v2-bubble-time trip-text-xs trip-text-gray-400">
                                  {formatTime(m.created_at)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* 未讀 badge + 操作按鈕 */}
                      <div className="d-flex align-items-center gap-2 mt-1">
                        {group.unread > 0 && (
                          <span className="badge bg-danger rounded-pill">{group.unread} 則未讀</span>
                        )}
                        <button
                          className="btn btn-sm trip-btn-outline-primary trip-btn-s"
                          onClick={() => {
                            setExpandedMsgId(isExpanded ? null : group.key);
                            if (!isExpanded) markGroupRead(group.otherId);
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
                            value={replyTexts[replyKey] || ''}
                            onChange={e => setReplyTexts(prev => ({ ...prev, [replyKey]: e.target.value }))}
                            disabled={!!sendingId}
                            style={{ resize: 'none' }}
                          />
                          <div className="d-flex justify-content-end gap-2">
                            <button
                              className="btn trip-btn-s btn-outline-secondary"
                              onClick={() => setExpandedMsgId(null)}
                              disabled={!!sendingId}
                            >取消</button>
                            <button
                              className="btn trip-btn-s trip-btn-primary"
                              onClick={() => {
                                // 用 replyKey 取 text，回覆對象取對方最早的訊息（確保 sender_id 正確）
                                const target = firstFromOther || group.latest;
                                handleReply({ ...target, _replyKey: replyKey });
                              }}
                              disabled={!!sendingId || !(replyTexts[replyKey] || '').trim()}
                            >
                              {sendingId
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
