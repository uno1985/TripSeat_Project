import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import '../../assets/css/thoughtsSection.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import fallbackAvatar from '../../assets/images/avator01.png';

const API_URL = import.meta.env.VITE_API_BASE;
const THOUGHTS_LIMIT = 4;

const truncateText = (text, max = 90) => {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max)}...` : text;
};

const ExperienceCard = ({ data }) => (
  <div className="card h-100 border-0 shadow-sm">
    <div className="p-3 pb-0">
      <img src={data.trip_image} className="card-img-top" alt={data.trip_title} />
    </div>
    <div className="card-body">
      <div className="d-flex align-items-center mb-2">
        <img
          src={data.user_avatar || fallbackAvatar}
          alt={data.user_name}
          className="rounded-circle me-2"
        />
        <span className="h4 mb-0 trip-text-m fw-bold">{data.user_name}</span>
      </div>
      <p className="trip-text-m mb-2 trip-text-gray-400">{data.trip_location || '地點待補'}</p>
      <p className="card-text trip-text-m mb-3 trip-text-gray-800">{truncateText(data.content)}</p>
      <div className="text-end">
        <Link
          to={`/thoughts/${data.id}`}
          className="btn link-m link-underline trip-text-primary-1000"
        >
          查看更多
        </Link>
      </div>
    </div>
  </div>
);

function ThoughtsSection() {
  const [thoughts, setThoughts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchThoughts = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const res = await axios.get(`${API_URL}/664/reviews`, {
          signal: controller.signal,
          params: {
            is_public: true,
            _sort: 'created_at',
            _order: 'desc',
            _limit: THOUGHTS_LIMIT,
          },
        });

        const rows = (res.data || []).filter((item) => !item.deleted_at);
        setThoughts(rows);
      } catch (error) {
        if (error?.name !== 'CanceledError' && error?.code !== 'ERR_CANCELED') {
          setIsError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchThoughts();
    return () => controller.abort();
  }, []);

  return (
    <div className="thoughtsSection py-5 trip-color-gray-100">
      <div className="container px-md-5">
        <div className="main row">
          <h2 className="h2 mb-5 text-center">旅程心得分享</h2>
        </div>

        {isLoading && <p className="text-center trip-text-m">載入心得中...</p>}
        {isError && <p className="text-center trip-text-m">心得資料載入失敗，請稍後再試</p>}
        {!isLoading && !isError && thoughts.length === 0 && (
          <p className="text-center trip-text-m">目前尚無心得分享</p>
        )}

        {!isLoading && !isError && thoughts.length > 0 && (
          <>
            <div className="row d-none d-md-flex">
              {thoughts.map((item) => (
                <div className="col-md-3 mb-4" key={item.id}>
                  <ExperienceCard data={item} />
                </div>
              ))}
            </div>

            <div className="d-block d-md-none position-relative px-4">
              <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={1}
                navigation={{
                  nextEl: '.swiper-button-next-custom',
                  prevEl: '.swiper-button-prev-custom',
                }}
                style={{ overflow: 'hidden' }}
              >
                {thoughts.map((item) => (
                  <SwiperSlide key={item.id}>
                    <div className="w-100">
                      <ExperienceCard data={item} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="swiper-button-prev-custom shadow-sm">
                <i className="bi bi-chevron-left"></i>
              </div>
              <div className="swiper-button-next-custom shadow-sm">
                <i className="bi bi-chevron-right"></i>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ThoughtsSection;
