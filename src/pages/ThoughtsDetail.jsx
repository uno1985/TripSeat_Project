//導入套件
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
//導入元件
import Breadcrumb from '../components/Breadcrumb';

//導入圖片
import shieldCheck from '../assets/images/shield-check.svg';

//導入樣式
import '../assets/css/thoughts.css';

// API URL
const API_URL = import.meta.env.VITE_API_BASE;

function ThoughtsDetail() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchReviewData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${API_URL}/664/reviews/${id}`);
        const authorRes = await axios.get(`${API_URL}/664/users/${response.data.user_id}`);
        setAuthor(authorRes.data);
        setReview(response.data);
      } catch (err) {
        setError(err.message);
        toast.error(err);
      } finally {
        setLoading(false);
      }
    };

    window.scrollTo(0, 0);
    void fetchReviewData();
  }, [id]);

  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}(${weekdays[date.getDay()]})`;
  };

  // 渲染星星
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
        ★
      </span>
    ));
  };

  // 渲染生日換算歲數
  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age;
  };

  // Loading 狀態
  if (loading) {
    return (
      <div className="thoughts-detail-page">
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">載入中...</span>
          </div>
          <p className="mt-3 trip-text-gray-600">正在載入個人心得...</p>
        </div>
      </div>
    );
  }

  // Error 狀態
  if (error) {
    return (
      <div className="thoughts-detail-page">
        <div className="container py-5 text-center">
          <div className="alert alert-warning" role="alert">
            <h4 className="alert-heading">找不到心得</h4>
            <p>{error}</p>
            <hr />
            <Link to="/thoughts" className="btn btn-primary">
              返回心得列表
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 資料不存在
  if (!review) {
    return (
      <div className="thoughts-detail-page">
        <div className="container py-5 text-center">
          <p className="trip-text-gray-600">無法載入心得資料</p>
        </div>
      </div>
    );
  }

  // 準備圖片列表（旅程主圖 + 心得照片）
  const allImages = [review.trip_image, ...(review.images || [])].filter(Boolean);

  return (
    <div className="thoughts-detail-page">
      <div className="container pt-5">
        <Toaster richColors position="top-center" />
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: '首頁', path: '/' },
            { label: '回憶旅程', path: '/thoughts' },
            { label: review.trip_title },
          ]}
        />

        {/* 標題區 */}
        <div className="detail-header mb-4">
          <h1 className="h2 trip-text-gray-800 mb-3">{review.trip_title}</h1>
          <div className="header-meta d-flex align-items-center gap-3 flex-wrap">
            <div className="rating-display">
              {renderStars(review.rating)}
              <span className="rating-text trip-text-m trip-text-gray-600 ms-2">
                {review.rating}.0 分
              </span>
            </div>
            <span className="meta-divider">|</span>
            <span className="location-text trip-text-m trip-text-gray-600">
              <span className="location-icon">📍</span> {review.trip_location}
            </span>
            <span className="meta-divider">|</span>
            <span className="date-text trip-text-m trip-text-gray-400">
              {formatDate(review.created_at)}
            </span>
          </div>
        </div>

        {/* 主要內容區 - 雙欄佈局 */}
        <div className="row g-4">
          {/* 左欄 - 主要內容 */}
          <div className="col-lg-8">
            {/* 圖片區 */}
            {allImages.length > 0 && (
              <div className="gallery-section mb-4">
                <div className="hero-image-wrapper">
                  <img src={allImages[selectedImageIndex]} alt="心得照片" className="hero-image" />
                </div>
                {allImages.length > 1 && (
                  <div className="thumbnail-strip">
                    {allImages.map((img, idx) => (
                      <div
                        key={idx}
                        className={`thumbnail-item ${idx === selectedImageIndex ? 'active' : ''}`}
                        onClick={() => setSelectedImageIndex(idx)}
                      >
                        <img src={img} alt={`照片 ${idx + 1}`} className="thumbnail-image" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 心得內容 */}
            <div className="section-block content-section mb-4">
              <h3 className="section-title trip-text-gray-800 mb-3">旅程心得</h3>
              <div className="content-body">
                <p
                  className="trip-text-m trip-text-gray-700"
                  style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}
                >
                  {review.content}
                </p>
              </div>
            </div>

            {/* 互動區 */}
            <div className="interaction-section mb-4">
              <div className="d-flex align-items-center justify-content-between">
                <div className="like-section">
                  <button className="like-btn">
                    <span className="heart-icon">❤️</span>
                    <span className="like-count">{review.likes_count || 0}</span>
                    <span className="like-text trip-text-s">人覺得有幫助</span>
                  </button>
                </div>
                <div className="share-section">
                  <button className="share-btn trip-text-s trip-text-gray-600">
                    <span className="share-icon">📤</span> 分享
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 右欄 - 側邊欄 */}
          <div className="col-lg-4">
            <div className="sticky-sidebar">
              {/* 作者資訊卡 */}
              <div className="sidebar-card author-card mb-4">
                <h5 className="subsection-title trip-text-gray-600 mb-3">關於作者</h5>
                <div className="author-header mb-3">
                  <img src={author.avatar} alt={author.name} className="author-avatar" />
                  <div className="author-info">
                    <span className="author-name trip-text-gray-800">
                      {author.name}

                      <span className="ms-2 author-age trip-text-s trip-text-gray-400">
                        {calculateAge(author.birthday)} 歲
                      </span>
                    </span>
                    <div className="host-rating trip-text-s trip-text-gray-400">
                      <span className="star">★</span> {author.rating_average} (
                      {author.trips_completed} 趟旅程)
                    </div>
                  </div>
                </div>
                <div className="author-intro">
                  <div className="stat-item">
                    <span className="stat-text trip-text-s trip-text-gray-600">{author.intro}</span>
                  </div>
                </div>
                <div className="author-verified mt-2">
                  {author.is_verified_host ? (
                    <div className="verified-btn">
                      <span className="verified-icon">
                        <img src={shieldCheck} alt="shieldCheck" />
                      </span>{' '}
                      已認證 真安心團主
                    </div>
                  ) : null}
                </div>
              </div>

              {/* 相關旅程卡 */}
              <div className="sidebar-card trip-card mb-4">
                <h5 className="subsection-title trip-text-gray-600 mb-3">相關旅程</h5>
                <div className="related-trip">
                  <div className="trip-image-wrapper mb-3">
                    <img src={review.trip_image} alt={review.trip_title} className="trip-image" />
                  </div>
                  <h6 className="trip-name trip-text-gray-800 mb-2">{review.trip_title}</h6>
                  <p className="trip-location trip-text-s trip-text-gray-600 mb-3">
                    <span className="location-icon">📍</span> {review.trip_location}
                  </p>
                  <Link
                    to={`/trips/${review.trip_id}`}
                    className="view-trip-btn trip-btn-outline-primary"
                  >
                    查看旅程詳情
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThoughtsDetail;
