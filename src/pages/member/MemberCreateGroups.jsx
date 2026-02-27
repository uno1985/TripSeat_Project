import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import '../../assets/css/memberCreateGroups.css';

const API_URL = import.meta.env.VITE_API_BASE;

const initialForm = {
    tripTitle: '',
    tripCategory: '',
    tripTags: '',
    tripDescription: '',
    vibeText: '',
    vibeTags: '',
    startDate: '',
    endDate: '',
    deadline: '',
    location: '',
    meetingPoint: '',
    meetingTime: '',
    transport: '',
    accommodation: '',
    price: '',
    maxPeople: '',
    cancellationPolicy: '',
};

const createItineraryItem = () => ({
    id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    time: '',
    icon: '📍',
    title: '',
    note: '',
});

const createItineraryDay = (day) => ({
    id: `day-${day}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    day,
    items: [createItineraryItem()],
});

const MemberCreateGroups = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [form, setForm] = useState(initialForm);
    const [itineraryDays, setItineraryDays] = useState([createItineraryDay(1)]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const canSubmit = useMemo(() => {
        return (
            form.tripTitle.trim() &&
            form.tripCategory &&
            form.tripDescription.trim() &&
            form.startDate &&
            form.endDate &&
            form.deadline &&
            form.location.trim() &&
            form.meetingPoint.trim() &&
            form.price !== '' &&
            form.maxPeople !== ''
        );
    }, [form]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setForm((prev) => ({ ...prev, [id]: value }));
    };

    const parseCommaList = (text) =>
        text
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);

    const getToken = () =>
        document.cookie
            .split('; ')
            .find((row) => row.startsWith('tripToken='))
            ?.split('=')[1];

    const updateItineraryItem = (dayId, itemId, field, value) => {
        setItineraryDays((prev) =>
            prev.map((day) => {
                if (day.id !== dayId) return day;
                return {
                    ...day,
                    items: day.items.map((item) =>
                        item.id === itemId ? { ...item, [field]: value } : item
                    ),
                };
            })
        );
    };

    const addItineraryItem = (dayId) => {
        setItineraryDays((prev) =>
            prev.map((day) =>
                day.id === dayId
                    ? { ...day, items: [...day.items, createItineraryItem()] }
                    : day
            )
        );
    };

    const removeItineraryItem = (dayId, itemId) => {
        setItineraryDays((prev) =>
            prev.map((day) => {
                if (day.id !== dayId) return day;
                if (day.items.length === 1) return day;
                return {
                    ...day,
                    items: day.items.filter((item) => item.id !== itemId),
                };
            })
        );
    };

    const addItineraryDay = () => {
        setItineraryDays((prev) => [...prev, createItineraryDay(prev.length + 1)]);
    };

    const removeItineraryDay = (dayId) => {
        setItineraryDays((prev) => {
            const target = prev.find((day) => day.id === dayId);
            if (!target || target.day === 1) return prev;

            return prev
                .filter((day) => day.id !== dayId)
                .map((day, index) => ({ ...day, day: index + 1 }));
        });
    };

    const getItineraryTypeByIcon = (icon) => {
        if (icon === '🍽️') return 'food';
        if (icon === '🚗') return 'transport';
        if (icon === '🏨') return 'accommodation';
        if (icon === '✏️') return 'note';
        return 'activity';
    };

    const handlePublish = async () => {
        if (!canSubmit) {
            setError('請先填完必填欄位');
            return;
        }

        if (new Date(form.endDate) < new Date(form.startDate)) {
            setError('回程日期不能早於出發日期');
            return;
        }

        if (new Date(form.deadline) > new Date(form.startDate)) {
            setError('報名截止日不能晚於出發日期');
            return;
        }

        const token = getToken();
        if (!token || !user?.id) {
            setError('登入狀態失效，請重新登入');
            return;
        }

        setSubmitting(true);
        setError('');

        const payload = {
            owner_id: user.id,
            title: form.tripTitle.trim(),
            category: form.tripCategory,
            tags: parseCommaList(form.tripTags),
            description: form.tripDescription.trim(),
            vibe_text: form.vibeText.trim(),
            vibe_tags: parseCommaList(form.vibeTags),
            start_date: form.startDate,
            end_date: form.endDate,
            deadline: form.deadline,
            location: form.location.trim(),
            meeting_point: form.meetingPoint.trim(),
            meeting_time: form.meetingTime || '09:00',
            transport: form.transport || '自行前往',
            accommodation: form.accommodation || '當天來回，無住宿',
            price: Number(form.price) || 0,
            max_people: Number(form.maxPeople) || 2,
            current_participants: 1,
            cancellation_policy: form.cancellationPolicy || '不退費',
            image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800',
            related_images: [],
            status: 'open',
            owner_name: user.name,
            owner_avatar: user.avatar,
            owner_is_verified_host: user.is_verified_host || 0,
            views: 0,
            is_featured: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null,
        };

        try {
            const res = await axios.post(`${API_URL}/600/trips`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const itineraryPayloads = itineraryDays
                .flatMap((day) =>
                    day.items
                        .filter((item) => item.title.trim() || item.note.trim())
                        .map((item) => ({
                            day: day.day,
                            time: item.time || '09:00',
                            type: getItineraryTypeByIcon(item.icon),
                            icon: item.icon,
                            title: item.title.trim() || '行程安排',
                            note: item.note.trim(),
                        }))
                );

            if (itineraryPayloads.length > 0) {
                await Promise.all(
                    itineraryPayloads.map((item) =>
                        axios.post(
                            `${API_URL}/600/itineraries`,
                            {
                                trip_id: res.data.id,
                                day: item.day,
                                time: item.time,
                                type: item.type,
                                icon: item.icon,
                                title: item.title,
                                note: item.note,
                                updated_at: new Date().toISOString(),
                                deleted_at: null,
                            },
                            {
                                headers: { Authorization: `Bearer ${token}` },
                            }
                        )
                    )
                );
            }

            navigate(`/trips/${res.data.id}`);
        } catch (err) {
            setError(err.response?.data || err.message || '發佈失敗');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="create-group-page">
            {error && <div className="alert alert-warning">{error}</div>}

            {/* ===== 頁面標題 ===== */}
            <div className="create-group-header mb-4">
                <h2 className="h3 trip-text-gray-800">
                    <i className="bi bi-plus-circle me-2 trip-text-primary-800"></i>
                    建立新旅程
                </h2>
                <p className="trip-text-m trip-text-gray-400 mt-2">
                    填寫以下資訊，讓旅伴們認識你的旅程！
                </p>
            </div>

            {/* ===== 基本資訊 ===== */}
            <div className="create-group-card mb-4">
                <h5 className="create-group-card-title">
                    <i className="bi bi-info-circle me-2"></i>基本資訊
                </h5>

                {/* 旅程名稱 */}
                <div className="mb-3">
                    <label htmlFor="tripTitle" className="form-label create-group-label">
                        旅程名稱 <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        className="form-control create-group-input"
                        id="tripTitle"
                        placeholder="例如：2026 春季花蓮慢旅行"
                        maxLength={50}
                        value={form.tripTitle}
                        onChange={handleChange}
                    />
                    <div className="form-text create-group-hint">最多 50 個字</div>
                </div>

                {/* 分類 & 標籤 */}
                <div className="row g-3 mb-3">
                    <div className="col-md-6">
                        <label htmlFor="tripCategory" className="form-label create-group-label">
                            旅程分類 <span className="text-danger">*</span>
                        </label>
                        <select className="form-select create-group-input" id="tripCategory" value={form.tripCategory} onChange={handleChange}>
                            <option value="">請選擇分類</option>
                            <option value="登山">登山</option>
                            <option value="文化體驗">文化體驗</option>
                            <option value="戶外探險">戶外探險</option>
                            <option value="美食">美食</option>
                            <option value="潛水">潛水</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="tripTags" className="form-label create-group-label">
                            標籤
                        </label>
                        <input
                            type="text"
                            className="form-control create-group-input"
                            id="tripTags"
                            placeholder="輸入標籤，以逗號分隔（例：親子, 攝影, 自然）"
                            value={form.tripTags}
                            onChange={handleChange}
                        />
                        <div className="form-text create-group-hint">多個標籤請用逗號分隔</div>
                    </div>
                </div>

                {/* 旅程描述 */}
                <div className="mb-3">
                    <label htmlFor="tripDescription" className="form-label create-group-label">
                        旅程描述 <span className="text-danger">*</span>
                    </label>
                    <textarea
                        className="form-control create-group-input"
                        id="tripDescription"
                        rows={5}
                        placeholder="描述你的旅程特色、行程亮點、適合對象..."
                        value={form.tripDescription}
                        onChange={handleChange}
                    ></textarea>
                </div>

                {/* 旅程氛圍 */}
                <div className="row g-3">
                    <div className="col-md-6">
                        <label htmlFor="vibeText" className="form-label create-group-label">
                            氛圍描述
                        </label>
                        <input
                            type="text"
                            className="form-control create-group-input"
                            id="vibeText"
                            placeholder="例如：輕鬆自在，慢步調享受大自然"
                            value={form.vibeText}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="vibeTags" className="form-label create-group-label">
                            氛圍標籤
                        </label>
                        <input
                            type="text"
                            className="form-control create-group-input"
                            id="vibeTags"
                            placeholder="例如：Chill, 療癒, 大自然"
                            value={form.vibeTags}
                            onChange={handleChange}
                        />
                        <div className="form-text create-group-hint">多個標籤請用逗號分隔</div>
                    </div>
                </div>
            </div>

            {/* ===== 時間與地點 ===== */}
            <div className="create-group-card mb-4">
                <h5 className="create-group-card-title">
                    <i className="bi bi-geo-alt me-2"></i>時間與地點
                </h5>

                {/* 日期 */}
                <div className="row g-3 mb-3">
                    <div className="col-md-4">
                        <label htmlFor="startDate" className="form-label create-group-label">
                            出發日期 <span className="text-danger">*</span>
                        </label>
                        <input
                            type="date"
                            className="form-control create-group-input"
                            id="startDate"
                            value={form.startDate}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="endDate" className="form-label create-group-label">
                            回程日期 <span className="text-danger">*</span>
                        </label>
                        <input
                            type="date"
                            className="form-control create-group-input"
                            id="endDate"
                            value={form.endDate}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="deadline" className="form-label create-group-label">
                            報名截止日 <span className="text-danger">*</span>
                        </label>
                        <input
                            type="date"
                            className="form-control create-group-input"
                            id="deadline"
                            value={form.deadline}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* 地點 */}
                <div className="row g-3 mb-3">
                    <div className="col-md-6">
                        <label htmlFor="location" className="form-label create-group-label">
                            目的地 <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control create-group-input"
                            id="location"
                            placeholder="例如：花蓮縣 秀林鄉"
                            value={form.location}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="meetingPoint" className="form-label create-group-label">
                            集合地點 <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control create-group-input"
                            id="meetingPoint"
                            placeholder="例如：花蓮火車站前站出口"
                            value={form.meetingPoint}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* 集合時間 */}
                <div className="row g-3">
                    <div className="col-md-4">
                        <label htmlFor="meetingTime" className="form-label create-group-label">
                            集合時間
                        </label>
                        <input
                            type="time"
                            className="form-control create-group-input"
                            id="meetingTime"
                            value={form.meetingTime}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            {/* ===== 交通與住宿 ===== */}
            <div className="create-group-card mb-4">
                <h5 className="create-group-card-title">
                    <i className="bi bi-truck me-2"></i>交通與住宿
                </h5>

                <div className="row g-3">
                    <div className="col-md-6">
                        <label htmlFor="transport" className="form-label create-group-label">
                            交通方式
                        </label>
                        <select className="form-select create-group-input" id="transport" value={form.transport} onChange={handleChange}>
                            <option value="">請選擇</option>
                            <option value="團主開車">團主開車</option>
                            <option value="共乘">共乘</option>
                            <option value="大眾運輸">大眾運輸</option>
                            <option value="自行前往">自行前往</option>
                            <option value="其他">其他（請在描述中說明）</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="accommodation" className="form-label create-group-label">
                            住宿安排
                        </label>
                        <input
                            type="text"
                            className="form-control create-group-input"
                            id="accommodation"
                            placeholder="例如：民宿兩人房 / 露營 / 當天來回"
                            value={form.accommodation}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            {/* ===== 費用與人數 ===== */}
            <div className="create-group-card mb-4">
                <h5 className="create-group-card-title">
                    <i className="bi bi-people me-2"></i>費用與人數
                </h5>

                <div className="row g-3 mb-3">
                    <div className="col-md-4">
                        <label htmlFor="price" className="form-label create-group-label">
                            每人費用 (NT$) <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                            <span className="input-group-text create-group-input-addon">$</span>
                            <input
                                type="number"
                                className="form-control create-group-input"
                                id="price"
                                placeholder="0"
                                min={0}
                                value={form.price}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-text create-group-hint">填 0 表示免費</div>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="maxPeople" className="form-label create-group-label">
                            人數上限 <span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            className="form-control create-group-input"
                            id="maxPeople"
                            placeholder="4"
                            min={2}
                            max={50}
                            value={form.maxPeople}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="cancellationPolicy" className="form-label create-group-label">
                            取消政策
                        </label>
                        <select className="form-select create-group-input" id="cancellationPolicy" value={form.cancellationPolicy} onChange={handleChange}>
                            <option value="">請選擇</option>
                            <option value="出發前 7 天可全額退費">出發前 7 天可全額退費</option>
                            <option value="出發前 3 天可全額退費，否則扣 50%">出發前 3 天可全額退費</option>
                            <option value="不退費，但可轉讓">不退費，但可轉讓</option>
                            <option value="不退費">不退費</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* ===== 旅程圖片 ===== */}
            <div className="create-group-card mb-4">
                <h5 className="create-group-card-title">
                    <i className="bi bi-image me-2"></i>旅程圖片
                </h5>

                {/* 主圖上傳 */}
                <div className="mb-3">
                    <label className="form-label create-group-label">
                        封面主圖 <span className="text-danger">*</span>
                    </label>
                    <div className="create-group-upload-area">
                        <div className="create-group-upload-placeholder">
                            <i className="bi bi-cloud-arrow-up"></i>
                            <p>點擊或拖曳上傳封面圖片</p>
                            <span>建議尺寸 800×600，支援 JPG / PNG</span>
                        </div>
                        {/* 隱藏的 file input，開發者自行綁定 */}
                        <input type="file" className="d-none" id="coverImage" accept="image/*" />
                    </div>
                </div>

                {/* 其他圖片 */}
                <div>
                    <label className="form-label create-group-label">
                        其他照片（最多 3 張）
                    </label>
                    <div className="row g-3">
                        {[1, 2, 3].map((n) => (
                            <div className="col-md-4" key={n}>
                                <div className="create-group-upload-area create-group-upload-small">
                                    <div className="create-group-upload-placeholder">
                                        <i className="bi bi-plus-lg"></i>
                                        <span>照片 {n}</span>
                                    </div>
                                    <input type="file" className="d-none" id={`relatedImage${n}`} accept="image/*" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ===== 行程規劃 ===== */}
            <div className="create-group-card mb-4">
                <h5 className="create-group-card-title">
                    <i className="bi bi-calendar3 me-2"></i>行程規劃
                </h5>
                <p className="trip-text-s trip-text-gray-400 mb-3">
                    可依天數新增每日行程，讓旅伴提前了解安排
                </p>

                {itineraryDays.map((day) => (
                    <div className="create-group-day-block" key={day.id}>
                        <div className="create-group-day-header">
                            <span className="create-group-day-badge">Day {day.day}</span>
                            {day.day > 1 && (
                                <button
                                    type="button"
                                    className="btn btn-sm create-group-btn-remove"
                                    title={`刪除 Day ${day.day}`}
                                    onClick={() => removeItineraryDay(day.id)}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            )}
                        </div>

                        {day.items.map((item) => (
                            <div className="create-group-itinerary-item" key={item.id}>
                                <div className="row g-2 align-items-end">
                                    <div className="col-md-2">
                                        <label className="form-label create-group-label-sm">時間</label>
                                        <input
                                            type="time"
                                            className="form-control create-group-input-sm"
                                            value={item.time}
                                            onChange={(e) => updateItineraryItem(day.id, item.id, 'time', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label create-group-label-sm">圖示</label>
                                        <select
                                            className="form-select create-group-input-sm"
                                            value={item.icon}
                                            onChange={(e) => updateItineraryItem(day.id, item.id, 'icon', e.target.value)}
                                        >
                                            <option value="📍">📍 地點</option>
                                            <option value="🍽️">🍽️ 餐食</option>
                                            <option value="🏨">🏨 住宿</option>
                                            <option value="🚗">🚗 交通</option>
                                            <option value="🎯">🎯 活動</option>
                                            <option value="✏️">✏️ 備註</option>
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label create-group-label-sm">項目名稱</label>
                                        <input
                                            type="text"
                                            className="form-control create-group-input-sm"
                                            placeholder="例如：出發集合"
                                            value={item.title}
                                            onChange={(e) => updateItineraryItem(day.id, item.id, 'title', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label create-group-label-sm">備註</label>
                                        <input
                                            type="text"
                                            className="form-control create-group-input-sm"
                                            placeholder="補充說明（選填）"
                                            value={item.note}
                                            onChange={(e) => updateItineraryItem(day.id, item.id, 'note', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-1 text-center">
                                        <button
                                            type="button"
                                            className="btn btn-sm create-group-btn-remove"
                                            title="刪除此項"
                                            onClick={() => removeItineraryItem(day.id, item.id)}
                                            disabled={day.items.length === 1}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="btn btn-sm create-group-btn-add-item mt-2"
                            onClick={() => addItineraryItem(day.id)}
                        >
                            <i className="bi bi-plus me-1"></i>新增行程項目
                        </button>
                    </div>
                ))}

                {/* 新增天數按鈕 */}
                <button type="button" className="btn create-group-btn-add-day mt-3" onClick={addItineraryDay}>
                    <i className="bi bi-plus-circle me-2"></i>新增一天
                </button>
            </div>

            {/* ===== 送出區 ===== */}
            <div className="create-group-actions">
                <button type="button" className="btn trip-btn-m trip-btn-outline-primary me-3">
                    <i className="bi bi-save me-2"></i>儲存草稿
                </button>
                <button
                    type="button"
                    className="btn trip-btn-m trip-btn-primary"
                    onClick={handlePublish}
                    disabled={submitting || !canSubmit}
                >
                    <i className="bi bi-send me-2"></i>{submitting ? '發佈中...' : '發佈旅程'}
                </button>
            </div>

        </div>
    );
};

export default MemberCreateGroups;
