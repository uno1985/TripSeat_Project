import "../../assets/css/reviewsSection.css";

import avator06 from "../../assets/images/avator06.png";
import avator05 from "../../assets/images/avator05.png";
import avator04 from "../../assets/images/avator04.png";
import avator03 from "../../assets/images/avator03.png";
import avator07 from "../../assets/images/avator07.png";
import group125 from "../../assets/images/Group 125.png";
import bCloud from "../../assets/images/big-cloud.svg";
import mCloud from "../../assets/images/m-cloud.png";
import sCloud from "../../assets/images/small-cloud.svg";
import ReviewCard from "../../components/ReviewCard";

const reviewsData = [
  {
    avatar: avator06,
    name: "阿哲",
    age: "32",
    content: "終於不用因為沒人陪就放棄旅行，很快就找到合得來的旅伴",
  },
  {
    avatar: avator05,
    name: "阿福伯",
    age: "78",
    content: "這​把​年​紀​了，​還​能​找到​人​一起​去​旅行，​真的​沒​想過。​",
  },
  {
    avatar: avator04,
    name: "婷",
    age: "31",
    content:
      "已​經​跟​了​三​次​團，​每​次​都​不​一樣。​適合​想​認識​新​朋友​的​人​",
  },
  {
    avatar: avator03,
    name: "Alex",
    age: "28",
    content: "I was traveling alone in Taiwan, and still found a great group.”",
  },
  {
    avatar: avator07,
    name: "Kevin",
    age: "35",
    content: "缺​一人​也​能​馬​上​成團，​速度​超快。​比​社團​好​用​太​多​",
  },
];

const scrollRevCard = (direction) => {
  const container = document.querySelector(".rev-card");
  if (!container) return;

  const card = container.querySelector(":scope > *");
  if (!card) return;

  // 取得當前卡片寬度 + 間距
  const gap = 28; 
  const scrollAmount = card.offsetWidth + gap;

  container.scrollBy({
    left: direction * scrollAmount,
    behavior: "smooth",
  });
};

function ReviewsSection() {
  return (
    <div className="reviewsSection text-center relative overflow-hidden">
      {/* 背景雲朵 */}
      <img src={group125} alt="Background picture" className="rev-bg-pic z-0" />
      <img src={bCloud} alt="Big Cloud" className="bCloud z-0" />
      <img src={mCloud} alt="Medium Cloud" className="mCloud z-0" />
      <img src={sCloud} alt="Small Cloud" className="sCloud z-0" />

      <div className=" container">
        <h3 className="h3 pt-100 mb-4">被信任，不是一句話</h3>
        <h2 className="h2 mb-16">是一次次的好評累積</h2>
        <p className="trip-text-l mb-52">來自真實用戶的故事與推薦</p>

        {/* 左箭頭 */}
        <button className="scroll-btn left" onClick={() => scrollRevCard(-1)}>
          <i class="bi bi-chevron-left"></i>
        </button>

        {/* 卡片內容 */}
        <div className="mb-52 g-28 rev-card">
          {reviewsData.map((reviewData, index) => {
            return (
              <ReviewCard
                className={index % 2 === 1 ? "mt-40" : ""}
                key={reviewData.name}
                {...reviewData}
              />
            );
          })}
        </div>

        {/* 右箭頭 */}
        <button className="scroll-btn right" onClick={() => scrollRevCard(1)}>
          <i class="bi bi-chevron-right"></i>
        </button>

        {/* 更多評價按鈕 */}
        <div>
          <button className="mt-52 mb-100 btn trip-btn-primary trip-btn-l z-3 position-relative">
            更多網站評價
          </button>
        </div>
      </div>
    </div>
  );
}
export default ReviewsSection;
