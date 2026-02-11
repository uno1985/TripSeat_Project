//導入套件
import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

//導入元件
import Breadcrumb from '../components/Breadcrumb';

//導入樣式
import '../assets/css/legal.css';

function Legal() {
    const { hash } = useLocation();

    // 錨點自動滾動
    useEffect(() => {
        if (hash) {
            const el = document.querySelector(hash);
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [hash]);

    return (
        <div className="legal-page">
            <div className="container py-5">

                <Breadcrumb items={[
                    { label: '首頁', path: '/' },
                    { label: '服務條款與幫助' }
                ]} />

                {/* 錨點導航列 */}
                <div className="legal-nav-bar mb-4">
                    <Link to="/legal#faq" className="legal-nav-item">
                        <i className="bi bi-question-circle me-2"></i>常見問題
                    </Link>
                    <Link to="/legal#terms" className="legal-nav-item">
                        <i className="bi bi-file-earmark-text me-2"></i>使用條款
                    </Link>
                    <Link to="/legal#privacy" className="legal-nav-item">
                        <i className="bi bi-shield-lock me-2"></i>隱私政策
                    </Link>

                </div>
                {/* ==================== 常見問題 ==================== */}
                <section id="faq" className="legal-section">
                    <div className="legal-section-card">
                        <h2 className="h3 legal-section-title">
                            <i className="bi bi-question-circle me-2"></i>常見問題
                        </h2>

                        <div className="legal-content">
                            <div className="accordion legal-accordion" id="faqAccordion">

                                {/* 帳號相關 */}
                                <h5 className="legal-subtitle mt-4">帳號相關</h5>

                                <div className="accordion-item legal-accordion-item">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed legal-accordion-btn" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                                            如何註冊帳號？
                                        </button>
                                    </h2>
                                    <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body legal-accordion-body">
                                            點擊首頁右上角的「註冊 / 登入」按鈕，填寫電子信箱與密碼即可完成註冊。註冊後建議完善個人檔案，讓其他旅伴更了解你！
                                        </div>
                                    </div>
                                </div>

                                <div className="accordion-item legal-accordion-item">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed legal-accordion-btn" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                                            忘記密碼怎麼辦？
                                        </button>
                                    </h2>
                                    <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body legal-accordion-body">
                                            請在登入頁面點擊「忘記密碼」，輸入您的註冊信箱，我們會寄送密碼重設連結給您。連結有效期為 24 小時。
                                        </div>
                                    </div>
                                </div>

                                {/* 旅程相關 */}
                                <h5 className="legal-subtitle">旅程與揪團</h5>

                                <div className="accordion-item legal-accordion-item">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed legal-accordion-btn" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                                            如何建立一個揪團旅程？
                                        </button>
                                    </h2>
                                    <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body legal-accordion-body">
                                            登入後點擊「我要開團」按鈕，填寫旅程名稱、日期、地點、費用等資訊，上傳旅程照片後即可發布。發布後其他使用者就能看到並申請加入你的旅程。
                                        </div>
                                    </div>
                                </div>

                                <div className="accordion-item legal-accordion-item">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed legal-accordion-btn" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                                            如何加入別人的旅程？
                                        </button>
                                    </h2>
                                    <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body legal-accordion-body">
                                            在「探索旅程」頁面找到感興趣的旅程，點進詳情頁後按下「申請加入旅程」按鈕。團主收到申請後會進行審核，通過後您就會收到通知。
                                        </div>
                                    </div>
                                </div>

                                <div className="accordion-item legal-accordion-item">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed legal-accordion-btn" type="button" data-bs-toggle="collapse" data-bs-target="#faq5">
                                            費用怎麼計算？
                                        </button>
                                    </h2>
                                    <div id="faq5" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body legal-accordion-body">
                                            旅程頁面上顯示的是「預估平攤費用」，由團主設定，實際費用可能因參與人數、實際消費等因素有所調整。建議出發前與團主確認最終費用明細。本平台不經手任何款項。
                                        </div>
                                    </div>
                                </div>

                                {/* 安全相關 */}
                                <h5 className="legal-subtitle">安全與信任</h5>

                                <div className="accordion-item legal-accordion-item">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed legal-accordion-btn" type="button" data-bs-toggle="collapse" data-bs-target="#faq6">
                                            什麼是「已認證團主」？
                                        </button>
                                    </h2>
                                    <div id="faq6" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body legal-accordion-body">
                                            已認證團主是通過本平台身份驗證的使用者，代表其身份資訊已經過審核。認證團主的旅程頁面會顯示認證徽章，提供額外的信任保障。
                                        </div>
                                    </div>
                                </div>

                                <div className="accordion-item legal-accordion-item">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed legal-accordion-btn" type="button" data-bs-toggle="collapse" data-bs-target="#faq7">
                                            旅程中發生問題怎麼辦？
                                        </button>
                                    </h2>
                                    <div id="faq7" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body legal-accordion-body">
                                            如遇到任何問題，您可以透過平台的站內訊息聯繫團主或其他團員。若遇到嚴重爭議，請透過「聯繫客服」功能回報，我們會協助調解處理。建議所有參與者出發前自行投保旅遊平安險。
                                        </div>
                                    </div>
                                </div>

                                {/* 心得相關 */}
                                <h5 className="legal-subtitle">心得分享</h5>

                                <div className="accordion-item legal-accordion-item">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed legal-accordion-btn" type="button" data-bs-toggle="collapse" data-bs-target="#faq8">
                                            如何發表旅程心得？
                                        </button>
                                    </h2>
                                    <div id="faq8" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body legal-accordion-body">
                                            完成旅程後，您可以在「回憶旅程」頁面發表心得，分享您的旅行體驗、照片和評價。好的心得可以幫助其他使用者找到適合自己的旅程！
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* ==================== 使用條款 ==================== */}
                <section id="terms" className="legal-section">
                    <div className="legal-section-card">
                        <h2 className="h3 legal-section-title">
                            <i className="bi bi-file-earmark-text me-2"></i>使用條款
                        </h2>
                        <p className="legal-update-date trip-text-s trip-text-gray-400">最後更新日期：2026 年 1 月 1 日</p>

                        <div className="legal-content">
                            <h5 className="legal-subtitle">1. 服務說明</h5>
                            <p>TripSeat（以下簡稱「本平台」）是一個旅遊揪團社群平台，提供使用者建立旅程、加入揪團、分享旅行心得等服務。使用本平台即表示您同意以下條款。</p>

                            <h5 className="legal-subtitle">2. 帳號註冊與管理</h5>
                            <ul className="legal-list">
                                <li>您必須年滿 18 歲或取得法定代理人同意方可註冊帳號。</li>
                                <li>您有責任維護帳號安全，不得將帳號借予他人使用。</li>
                                <li>若發現帳號遭到未授權使用，請立即通知我們。</li>
                            </ul>

                            <h5 className="legal-subtitle">3. 使用者行為規範</h5>
                            <ul className="legal-list">
                                <li>不得發布虛假或誤導性的旅程資訊。</li>
                                <li>不得騷擾、威脅或歧視其他使用者。</li>
                                <li>不得將本平台用於任何非法活動。</li>
                                <li>不得利用平台進行商業推銷或廣告行為。</li>
                            </ul>

                            <h5 className="legal-subtitle">4. 旅程與揪團</h5>
                            <p>本平台僅提供媒合與資訊交流服務，不直接參與旅程的規劃、執行或費用收取。使用者之間的旅程安排、費用分攤等事宜，由參與者自行協商處理。</p>

                            <h5 className="legal-subtitle">5. 費用說明</h5>
                            <p>旅程頁面顯示的費用為「預估平攤費用」，實際費用以團主公告為準。本平台不對費用爭議負責，但會協助調解。</p>

                            <h5 className="legal-subtitle">6. 免責聲明</h5>
                            <ul className="legal-list">
                                <li>本平台不對旅程中發生的意外事故、財物損失負責。</li>
                                <li>建議所有參與者自行投保旅遊平安險。</li>
                                <li>本平台保留隨時修改服務內容與條款的權利。</li>
                            </ul>

                            <h5 className="legal-subtitle">7. 智慧財產權</h5>
                            <p>使用者於本平台發布的內容（文字、照片等），著作權歸原作者所有。但使用者同意授權本平台於服務範圍內使用該內容。</p>
                        </div>
                    </div>
                </section>

                {/* ==================== 隱私政策 ==================== */}
                <section id="privacy" className="legal-section">
                    <div className="legal-section-card">
                        <h2 className="h3 legal-section-title">
                            <i className="bi bi-shield-lock me-2"></i>隱私政策
                        </h2>
                        <p className="legal-update-date trip-text-s trip-text-gray-400">最後更新日期：2026 年 1 月 1 日</p>

                        <div className="legal-content">
                            <h5 className="legal-subtitle">1. 資料蒐集範圍</h5>
                            <p>我們會蒐集以下個人資料：</p>
                            <ul className="legal-list">
                                <li><strong>註冊資訊</strong>：姓名、電子信箱、密碼（加密儲存）。</li>
                                <li><strong>個人檔案</strong>：頭像、自我介紹、生日（選填）。</li>
                                <li><strong>使用紀錄</strong>：瀏覽紀錄、旅程參與紀錄、心得發布紀錄。</li>
                                <li><strong>裝置資訊</strong>：瀏覽器類型、IP 位址、作業系統。</li>
                            </ul>

                            <h5 className="legal-subtitle">2. 資料使用目的</h5>
                            <ul className="legal-list">
                                <li>提供並改善平台服務體驗。</li>
                                <li>發送重要通知（帳號安全、旅程更新等）。</li>
                                <li>匿名統計分析以優化服務。</li>
                                <li>防止詐騙或不當使用行為。</li>
                            </ul>

                            <h5 className="legal-subtitle">3. 資料保護措施</h5>
                            <ul className="legal-list">
                                <li>所有密碼均經過加密處理後儲存。</li>
                                <li>採用 HTTPS 加密傳輸保護您的資料。</li>
                                <li>定期進行安全性檢測與更新。</li>
                            </ul>

                            <h5 className="legal-subtitle">4. Cookie 使用</h5>
                            <p>本平台使用 Cookie 來維持您的登入狀態與偏好設定。您可以透過瀏覽器設定管理 Cookie，但關閉 Cookie 可能影響部分功能的正常使用。</p>

                            <h5 className="legal-subtitle">5. 第三方分享</h5>
                            <p>除法律要求外，我們不會將您的個人資料提供給第三方。但匿名統計資料可能用於合作夥伴的分析用途。</p>

                            <h5 className="legal-subtitle">6. 您的權利</h5>
                            <ul className="legal-list">
                                <li>您可以隨時查閱、修改或刪除您的個人資料。</li>
                                <li>您可以要求我們停止處理您的資料。</li>
                                <li>您可以要求匯出您的個人資料。</li>
                                <li>如需行使上述權利，請透過客服信箱聯繫我們。</li>
                            </ul>
                        </div>
                    </div>
                </section>



                {/* 回到頂部 */}
                <div className="text-center mt-4 mb-3">
                    <a href="#" className="legal-back-top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                        <i className="bi bi-arrow-up-circle me-2"></i>回到頂部
                    </a>
                </div>

            </div>
        </div>
    );
}

export default Legal;
