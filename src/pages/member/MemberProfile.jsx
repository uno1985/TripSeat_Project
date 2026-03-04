import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import '../../assets/css/memberCreateGroups.css';
import '../../assets/css/memberProfile.css';

const API_URL = import.meta.env.VITE_API_BASE;

const emptyForm = {
  name: '',
  nickname: '',
  phone: '',
  email: '',
  intro: '',
};

const normalizeDepartures = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const MemberProfile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [origin, setOrigin] = useState(emptyForm);
  const [departures, setDepartures] = useState([]);
  const [originDepartures, setOriginDepartures] = useState([]);
  const [newDeparture, setNewDeparture] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getToken = () =>
    document.cookie
      .split('; ')
      .find((row) => row.startsWith('tripToken='))
      ?.split('=')[1];

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_URL}/664/users/${user.id}`);
        const data = res.data || {};
        const mapped = {
          name: data.name || '',
          nickname: data.nickname || '',
          phone: data.phone || '',
          email: data.email || '',
          intro: data.intro || '',
        };
        const dep = normalizeDepartures(data.frequent_departures);
        setForm(mapped);
        setOrigin(mapped);
        setDepartures(dep);
        setOriginDepartures(dep);
      } catch (err) {
        setError(err.message || '載入個人資料失敗');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const isDirty = useMemo(() => {
    const formChanged = Object.keys(emptyForm).some((key) => form[key] !== origin[key]);
    const depChanged = JSON.stringify(departures) !== JSON.stringify(originDepartures);
    return formChanged || depChanged;
  }, [form, origin, departures, originDepartures]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addDeparture = () => {
    const city = newDeparture.trim();
    if (!city) return;
    if (departures.includes(city)) {
      setNewDeparture('');
      return;
    }
    setDepartures((prev) => [...prev, city]);
    setNewDeparture('');
  };

  const removeDeparture = (city) => {
    setDepartures((prev) => prev.filter((item) => item !== city));
  };

  const handleReset = () => {
    setForm(origin);
    setDepartures(originDepartures);
    setNewDeparture('');
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError('姓名與 Email 為必填');
      return;
    }

    const token = getToken();
    if (!token || !user?.id) {
      setError('登入狀態失效，請重新登入');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    const payload = {
      name: form.name.trim(),
      nickname: form.nickname.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      intro: form.intro.trim(),
      frequent_departures: departures,
      updated_at: new Date().toISOString(),
    };

    try {
      await axios.patch(`${API_URL}/600/users/${user.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const nextOrigin = {
        ...form,
        name: payload.name,
        nickname: payload.nickname,
        phone: payload.phone,
        email: payload.email,
        intro: payload.intro,
      };

      setOrigin(nextOrigin);
      setForm(nextOrigin);
      setOriginDepartures(departures);
      setSuccess('個人資料已更新');

      // const localUser = JSON.parse(localStorage.getItem('tripUser') || '{}');
      // const merged = { ...localUser, ...payload };
      // localStorage.setItem('tripUser', JSON.stringify(merged));
      updateUser(payload);
    } catch (err) {
      setError(err.response?.data || err.message || '儲存失敗');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-4">載入中...</div>;

  return (
    <div className="create-group-page member-profile-page">
      <div className=" mb-4">
        <h2 className="h3 trip-text-gray-800">
          <i className="bi bi-person me-2 trip-text-primary-800"></i>
          我的檔案
        </h2>
        <p className="trip-text-m trip-text-gray-400 mt-2">管理個人資訊與常用出發地</p>
      </div>

      {(error || success) && (
        <div className={`alert ${error ? 'alert-warning' : 'alert-success'}`}>
          {error || success}
        </div>
      )}

      <div className="create-group-card mb-4">
        <h5 className="create-group-card-title">
          <i className="bi bi-card-text me-2"></i>基本資料
        </h5>

        <div className="mb-3">
          <label className="form-label create-group-label" htmlFor="name">姓名</label>
          <input
            id="name"
            name="name"
            type="text"
            className="form-control create-group-input"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label create-group-label" htmlFor="nickname">暱稱</label>
          <input
            id="nickname"
            name="nickname"
            type="text"
            className="form-control create-group-input"
            value={form.nickname}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label create-group-label" htmlFor="phone">電話</label>
          <input
            id="phone"
            name="phone"
            type="text"
            className="form-control create-group-input"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label create-group-label" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="form-control create-group-input"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="form-label create-group-label" htmlFor="intro">自我介紹</label>
          <textarea
            id="intro"
            name="intro"
            rows={6}
            className="form-control create-group-input"
            value={form.intro}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label create-group-label">常用出發地</label>
          <div className="member-profile-chip-list mb-2">
            {departures.map((city) => (
              <button
                key={city}
                type="button"
                className="member-profile-chip"
                onClick={() => removeDeparture(city)}
                title="移除地點"
              >
                {city}
                <i className="bi bi-x ms-2"></i>
              </button>
            ))}
            {departures.length === 0 && (
              <span className="trip-text-s trip-text-gray-400">尚未設定常用出發地</span>
            )}
          </div>

          <div className="member-profile-departure-row">
            <input
              type="text"
              className="form-control create-group-input"
              placeholder="輸入城市，例如：台南市"
              value={newDeparture}
              onChange={(e) => setNewDeparture(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addDeparture();
                }
              }}
            />
            <button type="button" className="btn trip-btn-s trip-btn-outline-primary" onClick={addDeparture}>
              + 新增常用地點
            </button>
          </div>
        </div>

        <div className="member-profile-password-hint">
          密碼變更（點擊後，系統將送出一封 Email，請至您的信箱確認）
        </div>
      </div>

      <div className="member-profile-actions">
        <button type="button" className="btn trip-btn-m trip-btn-outline-primary" onClick={handleReset} disabled={saving || !isDirty}>
          取消變更
        </button>
        <button type="button" className="btn trip-btn-m trip-btn-primary" onClick={handleSave} disabled={saving || !isDirty}>
          {saving ? '儲存中...' : '儲存'}
        </button>
      </div>
    </div>
  );
};

export default MemberProfile;
