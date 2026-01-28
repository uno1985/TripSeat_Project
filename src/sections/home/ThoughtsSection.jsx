import '../../assets/css/thoughtsSection.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import avator01 from '../../assets/images/avator01.png';
import avator02 from '../../assets/images/avator02.png';
import avator04 from '../../assets/images/avator04.png';
import avator09 from '../../assets/images/avator09.png';

// 1. 準備四張卡片的資料
const thoughtsData = [
  {
    id: 1,
    userName: 'Jessy',
    location: '屏東墾丁・南灣',
    content: '原本擔心一個人報名會很尷尬，結果大家都超級熱情！領隊很會帶氣氛，這幾天認識了好多頻率相同的新朋友，我們已經約好下次要再一起揪團去海島了！推推！',
    coverImg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    avatar: avator04
  },
  {
    id: 2,
    userName: 'Tony Chang',
    location: '苗栗・星空露營區',
    content: '平常工作太忙，只想參加這種「無腦跟團」的行程。行程安排得很順暢，不用自己開車、不用找餐廳真的太放鬆了。晚上的營火晚會超 Chill，感覺壓力全都不見了。',
    coverImg: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=600&q=80',
    avatar: avator02
  },
  {
    id: 3,
    userName: 'Jessica Chou',
    location: '台南・漁光島藝術節',
    content: '這次的行程太超值了！導遊帶我們去的私房景點拍照都美到不行，完全避開人潮。而且安排在地小吃也都沒有踩雷，身為吃貨覺得超級滿意，手機記憶體都滿了啦！',
    coverImg: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    avatar: avator09
  },
  {
    id: 4,
    userName: 'Andy Chen',
    location: '花蓮・清水斷崖獨木舟',
    content: '第一次參加這種半自助的揪團，CP 值比想像中高很多！不管是住宿還是活動都很用心，完全不用做功課就能玩得很盡興，對於不想排行程的人來說真的是救星，下次會想帶家人參加。',
    coverImg: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    avatar: avator01
  }
];

// 2. 修改卡片組件，接收 data 作為參數
const ExperienceCard = ({ data }) => (
  <div className="card h-100 border-0 shadow-sm">
    <div className="p-3 pb-0">
      <img 
        src={data.coverImg} 
        className="card-img-top" 
        alt={data.userName} 
      />
    </div>
    <div className="card-body">
      <div className="d-flex align-items-center mb-2">
        <img 
          src={data.avatar} 
          alt={data.userName}
          className="rounded-circle me-2" 
        />
        <span className="h4 mb-0 trip-text-m fw-bold">{data.userName}</span>
      </div>
      <p className="trip-text-m mb-2 trip-text-gray-400">{data.location}</p>
      <p className="card-text trip-text-m mb-3 trip-text-gray-800">
        {data.content}
      </p>
      <div className="text-end">
        <a href="#" className="btn link-m link-underline trip-text-primary-1000">查看更多</a>
      </div>
    </div>
  </div>
);

function ThoughtsSection() {
  return (
    <div className="thoughtsSection py-5 trip-color-gray-100">
      <div className="container px-md-5">
        <div className="main row">
          <h2 className="h2 mb-5 text-center">旅程心得分享</h2>
        </div>

        {/* --- 電腦版：使用 map 渲染陣列 --- */}
        <div className="row d-none d-md-flex">
          {thoughtsData.map((item) => (
            <div className="col-md-3 mb-4" key={item.id}>
              <ExperienceCard data={item} />
            </div>
          ))}
        </div>

        {/* --- 手機版：使用 map 渲染 SwiperSlide --- */}
        <div className="d-block d-md-none position-relative px-4">
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1} // 強制一次只顯示一張
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            // 確保 Swiper 本身不會把沒看到的 Slide 顯示出來
            style={{ overflow: 'hidden' }} 
          >
            {thoughtsData.map((item) => (
              <SwiperSlide key={item.id}>
                {/* 確保卡片寬度撐滿 Slide */}
                <div className="w-100">
                  <ExperienceCard data={item} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* 自定義箭頭 */}
          <div className="swiper-button-prev-custom shadow-sm">
             <i className="bi bi-chevron-left"></i>
          </div>
          <div className="swiper-button-next-custom shadow-sm">
             <i className="bi bi-chevron-right"></i>
          </div>
        </div>
      </div>

    </div>
  );
}

export default ThoughtsSection;