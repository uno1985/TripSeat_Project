/**
 * 📍 目標位置：src/pages/member/MemberCreateGroups.jsx
 * 📝 取代原本的 placeholder 頁面
 *
 * ⚠️ 這是純版面（Layout Only），不含任何邏輯：
 *   - 沒有 useState / useEffect
 *   - 沒有 API 呼叫
 *   - 沒有表單驗證
 *   - 表單欄位對應 db.json 的 trips + itineraries 結構
 *
 * 💡 開發者自行加入：
 *   - React Hook Form 或自訂表單管理
 *   - 圖片上傳邏輯
 *   - 行程天數動態新增/刪除
 *   - 提交 API
 */

import '../../assets/css/memberCreateGroups.css';

const MemberCreateGroups = () => {
    return (
        <div className="create-group-page">

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
                    />
                    <div className="form-text create-group-hint">最多 50 個字</div>
                </div>

                {/* 分類 & 標籤 */}
                <div className="row g-3 mb-3">
                    <div className="col-md-6">
                        <label htmlFor="tripCategory" className="form-label create-group-label">
                            旅程分類 <span className="text-danger">*</span>
                        </label>
                        <select className="form-select create-group-input" id="tripCategory">
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
                        <select className="form-select create-group-input" id="transport">
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
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="cancellationPolicy" className="form-label create-group-label">
                            取消政策
                        </label>
                        <select className="form-select create-group-input" id="cancellationPolicy">
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

                {/* Day 1 範例 */}
                <div className="create-group-day-block">
                    <div className="create-group-day-header">
                        <span className="create-group-day-badge">Day 1</span>
                        {/* 開發者自行加入刪除天數按鈕 */}
                    </div>

                    {/* 行程項目 */}
                    <div className="create-group-itinerary-item">
                        <div className="row g-2 align-items-end">
                            <div className="col-md-2">
                                <label className="form-label create-group-label-sm">時間</label>
                                <input type="time" className="form-control create-group-input-sm" />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label create-group-label-sm">圖示</label>
                                <select className="form-select create-group-input-sm">
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
                                <input type="text" className="form-control create-group-input-sm" placeholder="例如：出發集合" />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label create-group-label-sm">備註</label>
                                <input type="text" className="form-control create-group-input-sm" placeholder="補充說明（選填）" />
                            </div>
                            <div className="col-md-1 text-center">
                                <button type="button" className="btn btn-sm create-group-btn-remove" title="刪除此項">
                                    <i className="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 新增行程項目按鈕 */}
                    <button type="button" className="btn btn-sm create-group-btn-add-item mt-2">
                        <i className="bi bi-plus me-1"></i>新增行程項目
                    </button>
                </div>

                {/* 新增天數按鈕 */}
                <button type="button" className="btn create-group-btn-add-day mt-3">
                    <i className="bi bi-plus-circle me-2"></i>新增一天
                </button>
            </div>

            {/* ===== 送出區 ===== */}
            <div className="create-group-actions">
                <button type="button" className="btn trip-btn-m trip-btn-outline-primary me-3">
                    <i className="bi bi-save me-2"></i>儲存草稿
                </button>
                <button type="button" className="btn trip-btn-m trip-btn-primary">
                    <i className="bi bi-send me-2"></i>發佈旅程
                </button>
            </div>

        </div>
    );
};

export default MemberCreateGroups;
