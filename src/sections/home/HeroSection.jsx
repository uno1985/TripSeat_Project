import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/heroSection.css';

import smailCloud from '../../assets/images/small-cloud.svg';
import bigCloud from '../../assets/images/big-cloud.svg';
import homeHero01 from '../../assets/images/home-hero-01.svg';
import homeHero02 from '../../assets/images/home-hero-02.svg';
import homeHero04 from '../../assets/images/home-hero-04.PNG';

function HeroSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayText, setDisplayText] = useState({ t1: "", t2: "" });
    const heroData = [
        { img: homeHero01, title1: "不知道去哪？", title2: "跟著旅程走就對了", sub: "今天想出門？看看誰正在出發", btn: "探索旅程", to: "/trips" },
        { img: homeHero02, title1: "每段旅程，", title2: "都值得遇見新的人", sub: "讓陌生變成熟悉，讓旅程變成故事", btn: "加入旅程", to: "/trips" },
        { img: homeHero04, title1: "把空位留給", title2: "懂得欣賞風景的人", sub: "一個座位，換一段新的回憶", btn: "發起旅程", to: "/" }
    ];

    // 車站翻牌隨機字體效果
    const flipText = (target1, target2) => {
        const chars = "！？，。不知道去哪跟著旅程走就對了每段值得遇見新的人把空位留給欣賞風景";
        let iteration = 0;
        const interval = setInterval(() => {
            setDisplayText({
                t1: target1.split("").map((l, i) => i < iteration ? target1[i] : chars[Math.floor(Math.random() * chars.length)]).join(""),
                t2: target2.split("").map((l, i) => i < iteration ? target2[i] : chars[Math.floor(Math.random() * chars.length)]).join("")
            });
            if (iteration >= Math.max(target1.length, target2.length)) clearInterval(interval);
            iteration += 1 / 2;
        }, 50);
    };

    useEffect(() => {
        flipText(heroData[currentIndex].title1, heroData[currentIndex].title2);
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % heroData.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [currentIndex]);

    return (
        <div className="heroSection">
            <div className="hero-wrapper">
                {/* 雲朵背景：100% 還原座標 */}
                <div className="cloud-decorations d-none d-lg-block">
                    <img src={smailCloud} className="cloud cloud-a" alt="" />
                    <img src={bigCloud} className="cloud cloud-b" alt="" />
                    <img src={smailCloud} className="cloud cloud-c" alt="" />
                    <img src={bigCloud} className="cloud cloud-d" alt="" />
                </div>

                <div className="container hero-content-box">
                    <div className="row align-items-center">
                        <div className="col-lg-6 text-center text-lg-start">
                            {/* 大標題：第一行底線 */}
                            <h1 className="hero-title">
                                <span className="line-1">{displayText.t1}</span>
                                <span className="line-2">{displayText.t2}</span>
                            </h1>

                            {/* 副標題：持續慢速閃爍打字機 */}
                            <div className="hero-subtitle-container">
                                <p className="hero-subtitle typewriter-animation trip-text-l" key={`sub-${currentIndex}`}>
                                    {heroData[currentIndex].sub}
                                </p>
                            </div>

                            {/* 按鈕：淡入不位移 */}
                            <Link className="btn trip-btn-primary trip-btn-l btn-fade-animation" key={`btn-${currentIndex}`} to={heroData[currentIndex].to}>
                                {heroData[currentIndex].btn}
                            </Link>
                        </div>

                        {/* 右側插畫：旋轉進入 */}
                        <div className="col-lg-6 text-center mt-5 mt-lg-0">
                            <img
                                key={`img-${currentIndex}`}
                                src={heroData[currentIndex].img}
                                className="img-fluid hero-img-animation"
                                alt="TripSeat Hero"
                            />
                        </div>
                    </div>

                    <div className="hero-dots text-center">
                        {heroData.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(index)}
                            ></span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeroSection;