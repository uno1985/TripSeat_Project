

import { Link } from 'react-router-dom';
import '../assets/css/about.css'; // 調整為專案正確路徑 → import '../assets/css/about.css'

const About = () => {
    const stats = [
        { number: '3,200+', label: '成功旅程', icon: 'bi-compass-fill' },
        { number: '18,000+', label: '快樂旅人', icon: 'bi-people-fill' },
        { number: '120+', label: '探索城市', icon: 'bi-geo-alt-fill' },
        { number: '4.9', label: '平均評分', icon: 'bi-star-fill' },
    ];

    const values = [
        {
            icon: 'bi-heart-fill',
            title: '真誠連結',
            desc: '我們相信旅行最美的部分是人。TripSeat 讓旅伴不只是同行者，而是真正的朋友。每一段旅程，都是一段新的緣分故事。',
            color: '#ff6b6b',
            bg: '#fff5f5',
        },
        {
            icon: 'bi-shield-check-fill',
            title: '安心保障',
            desc: '實名認證、信用評分、旅伴評價三重把關，讓每一次出行都有保障。你的安全是我們設計每個功能的首要考量。',
            color: '#4fcf7c',
            bg: '#f0fff4',
        },
        {
            icon: 'bi-globe2',
            title: '無限可能',
            desc: '從都市美食散步到百岳攻頂，從輕鬆一日遊到深度長途旅行，在 TripSeat 你永遠可以找到志同道合的旅伴。',
            color: '#339af0',
            bg: '#f0f8ff',
        },
    ];

    const features = [
        {
            icon: 'bi-search-heart',
            title: '精準配對旅伴',
            desc: '根據旅遊風格、行程偏好、出發時間，精準媒合最適合的旅伴，讓每次出行都心情愉快。',
        },
        {
            icon: 'bi-person-badge-fill',
            title: '認證團主機制',
            desc: '通過認證的優質團主帶領行程，有清楚的行前說明、詳細的費用明細，讓你出發前就放心。',
        },
        {
            icon: 'bi-chat-heart-fill',
            title: '出發前溝通',
            desc: '內建群組聊天室，成團後立即開放，讓旅伴可以在出發前互相認識、討論行程細節。',
        },
        {
            icon: 'bi-journal-richtext',
            title: '旅行心得社群',
            desc: '旅程結束後，分享你的旅行故事與照片，成為下一位旅人的靈感來源，讓旅行回憶永久珍藏。',
        },
    ];

    const team = [
        {
            name: 'Uno Wu',
            role: '創意發想者',
            desc: '曾背包走遍 30 國，深信旅行能改變人生，希望讓更多人找到旅伴圓夢。',
            avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=kelly&backgroundColor=ffb74c',
            tag: '旅行狂熱者',
        },
        {
            name: 'Cami Wang',
            role: '產品設計師',
            desc: '10 年 UX 設計經驗，致力打造讓使用者一用就愛上的旅遊社群體驗。',
            avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=designer&backgroundColor=a5d8ff',
            tag: 'UI UX 達人',
        },
        {
            name: '小光',
            role: '全端工程師',
            desc: '熱衷開源技術與系統架構，打造穩定、快速、安全的平台基礎設施。',
            avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=engineer&backgroundColor=b2f2bb',
            tag: '工程達人',
        },
        {
            name: '大頭',
            role: '社群經營總監',
            desc: '擅長社群行銷與活動策劃，讓 TripSeat 的每一個旅程故事都被更多人看見。',
            avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=social&backgroundColor=ffd6e0',
            tag: '社群靈魂',
        },
    ];

    return (
        <div className="about-page">

            {/* ===== 1. Hero 大橫幅 ===== */}
            <section className="about-hero">
                <div className="about-hero-overlay"></div>
                <div className="about-hero-content container">
                    <div className="about-hero-badge">
                        <i className="bi bi-compass-fill"></i>
                        TripSeat 共享旅程
                    </div>
                    <h1 className="about-hero-title">
                        讓每一段旅程<br />都不再孤單
                    </h1>
                    <p className="about-hero-subtitle">
                        我們連結有緣的旅人，把陌生人變成旅伴，把旅伴變成朋友
                    </p>
                    <div className="about-hero-actions">
                        <Link to="/trips" className="btn about-btn-primary">
                            <i className="bi bi-compass me-2"></i>探索旅程
                        </Link>
                        <button
                            className="btn about-btn-ghost"
                            onClick={() => document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            <i className="bi bi-arrow-down me-2"></i>了解我們
                        </button>
                    </div>
                </div>
                <div className="about-hero-scroll">
                    <i className="bi bi-chevron-double-down"></i>
                </div>
            </section>

            {/* ===== 2. 品牌故事 ===== */}
            <section id="story" className="about-story">
                <div className="container">
                    <div className="about-story-grid">
                        <div className="about-story-images">
                            <div
                                className="about-story-img main"
                                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=800&fit=crop')" }}
                            ></div>
                            <div
                                className="about-story-img sub"
                                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&fit=crop')" }}
                            ></div>
                            <div className="about-story-img-badge">
                                <span>2023</span>
                                <span>成立</span>
                            </div>
                        </div>

                        <div className="about-story-content">
                            <div className="about-section-label">
                                <i className="bi bi-book-fill"></i>我們的故事
                            </div>
                            <h2 className="about-section-title">
                                從一個旅人的孤單<br />出發的旅程平台
                            </h2>
                            <p className="about-story-text">
                                2025 年，創辦人林小明在一次獨自旅行中，在合歡山的山頂上，望著壯觀的雲海，心裡卻有一種說不出的遺憾——<strong>如果這一刻有個人能一起分享，該有多好。</strong>
                            </p>
                            <p className="about-story-text">
                                那一刻，TripSeat 的種子悄悄萌芽。我們相信，最美的風景需要有人共同欣賞，最好的旅行需要有旅伴相陪。
                            </p>
                            <p className="about-story-text">
                                於是，一個連結有緣旅人的平台就此誕生。不只是「找旅伴」，更是讓旅行從個人的獨白，變成一段共同的故事。
                            </p>
                            <div className="about-story-quote">
                                <i className="bi bi-quote"></i>
                                <blockquote>旅行的意義，不在於去了哪裡，而在於和誰一起去。</blockquote>
                                <cite>— UNO，TripSeat 創辦人</cite>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== 3. 核心數據 ===== */}
            <section className="about-stats">
                <div className="container">
                    <div className="about-stats-grid">
                        {stats.map((stat, i) => (
                            <div key={i} className="about-stat-card">
                                <div className="about-stat-icon">
                                    <i className={stat.icon}></i>
                                </div>
                                <div className="about-stat-number">{stat.number}</div>
                                <div className="about-stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== 4. 核心價值 ===== */}
            <section className="about-values">
                <div className="container">
                    <div className="about-section-header">
                        <div className="about-section-label">
                            <i className="bi bi-gem-fill"></i>核心理念
                        </div>
                        <h2 className="about-section-title">我們相信的三件事</h2>
                        <p className="about-section-desc">
                            每個設計決定、每個功能，都來自這三個核心信念
                        </p>
                    </div>
                    <div className="about-values-grid">
                        {values.map((val, i) => (
                            <div
                                key={i}
                                className="about-value-card"
                                style={{ '--val-color': val.color, '--val-bg': val.bg }}
                            >
                                <div className="about-value-icon">
                                    <i className={val.icon}></i>
                                </div>
                                <h3 className="about-value-title">{val.title}</h3>
                                <p className="about-value-desc">{val.desc}</p>
                                <div className="about-value-num">0{i + 1}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== 5. 服務特色 ===== */}
            <section className="about-features">
                <div className="container">
                    <div className="about-features-inner">
                        <div className="about-features-label-col">
                            <div className="about-section-label">
                                <i className="bi bi-lightning-fill"></i>平台特色
                            </div>
                            <h2 className="about-section-title">為什麼選擇<br />TripSeat？</h2>
                            <p className="about-section-desc">
                                我們不只是一個「找旅伴」的工具，更是一個讓旅行更美好的社群。
                            </p>
                            <Link to="/trips" className="btn about-btn-primary mt-4">
                                立即探索 <i className="bi bi-arrow-right ms-2"></i>
                            </Link>
                        </div>
                        <div className="about-features-list">
                            {features.map((feat, i) => (
                                <div key={i} className="about-feature-item">
                                    <div className="about-feature-icon">
                                        <i className={feat.icon}></i>
                                    </div>
                                    <div className="about-feature-content">
                                        <h4 className="about-feature-title">{feat.title}</h4>
                                        <p className="about-feature-desc">{feat.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== 6. 團隊介紹 ===== */}
            <section className="about-team">
                <div className="container">
                    <div className="about-section-header">
                        <div className="about-section-label">
                            <i className="bi bi-people-fill"></i>核心團隊
                        </div>
                        <h2 className="about-section-title">認識打造 TripSeat 的人們</h2>
                        <p className="about-section-desc">
                            一群對旅行充滿熱情的人，用心打造讓旅行更美好的平台
                        </p>
                    </div>
                    <div className="about-team-grid">
                        {team.map((member, i) => (
                            <div key={i} className="about-team-card">
                                <div className="about-team-avatar-wrap">
                                    <img
                                        src={member.avatar}
                                        alt={member.name}
                                        className="about-team-avatar"
                                    />
                                    <span className="about-team-tag">{member.tag}</span>
                                </div>
                                <div className="about-team-info">
                                    <h4 className="about-team-name">{member.name}</h4>
                                    <p className="about-team-role">{member.role}</p>
                                    <p className="about-team-desc">{member.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== 7. 聯絡資訊 + CTA ===== */}
            <section className="about-contact">
                <div className="container">
                    <div className="about-contact-grid">
                        {/* 聯絡資訊 */}
                        <div className="about-contact-info">
                            <div className="about-section-label">
                                <i className="bi bi-telephone-fill"></i>聯絡我們
                            </div>
                            <h2 className="about-section-title" style={{ color: 'var(--trip-color-white)' }}>
                                有任何問題<br />歡迎聯絡我們
                            </h2>
                            <div className="about-contact-details">
                                <div className="about-contact-row">
                                    <i className="bi bi-telephone-fill"></i>
                                    <span>07-1314-1688</span>
                                </div>
                                <div className="about-contact-row">
                                    <i className="bi bi-geo-alt-fill"></i>
                                    <span>高雄市六角路168號</span>
                                </div>
                                <div className="about-contact-row">
                                    <i className="bi bi-envelope-fill"></i>
                                    <span>hello@tripseat.com</span>
                                </div>
                                <div className="about-contact-row">
                                    <i className="bi bi-clock-fill"></i>
                                    <span>週一至週五 09:00 – 18:00</span>
                                </div>
                            </div>
                            <div className="about-social">
                                <a href="#" className="about-social-btn" aria-label="Facebook">
                                    <i className="bi bi-facebook"></i>
                                </a>
                                <a href="#" className="about-social-btn" aria-label="Instagram">
                                    <i className="bi bi-instagram"></i>
                                </a>
                                <a href="#" className="about-social-btn" aria-label="Line">
                                    <i className="bi bi-line"></i>
                                </a>
                                <a href="#" className="about-social-btn" aria-label="X">
                                    <i className="bi bi-twitter-x"></i>
                                </a>
                            </div>
                        </div>

                        {/* CTA 卡片 */}
                        <div className="about-cta-card">
                            <div className="about-cta-icon">
                                <i className="bi bi-airplane-fill"></i>
                            </div>
                            <h3 className="about-cta-title">準備好開始你的旅程了嗎？</h3>
                            <p className="about-cta-desc">
                                加入 18,000+ 旅人的行列，找到你的專屬旅伴，開啟下一段難忘的冒險
                            </p>
                            <div className="about-cta-actions">
                                <Link to="/trips" className="btn about-cta-btn-primary">
                                    <i className="bi bi-compass-fill me-2"></i>
                                    探索所有旅程
                                </Link>
                                <Link to="/login" className="btn about-cta-btn-outline">
                                    <i className="bi bi-person-plus me-2"></i>
                                    免費加入
                                </Link>
                            </div>
                            <div className="about-cta-badges">
                                <span><i className="bi bi-shield-check-fill"></i> 安全認證</span>
                                <span><i className="bi bi-star-fill"></i> 4.9 評分</span>
                                <span><i className="bi bi-people-fill"></i> 18K+ 會員</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default About;
