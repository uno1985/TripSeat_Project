//導入套件
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

//導入元件
import Breadcrumb from '../components/Breadcrumb';

//導入樣式
import '../assets/css/thoughts.css';

const API_URL = import.meta.env.VITE_API_BASE;

function Thoughts() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await axios.get(`${API_URL}/664/reviews?is_public=true&_sort=created_at&_order=desc`);
            // 過濾掉已刪除的心得
            const activeReviews = res.data.filter(review => !review.deleted_at);
            setReviews(activeReviews);
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // 格式化日期
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    };

    // 截斷內容
    const truncateContent = (content, maxLength = 80) => {
        if (!content) return '';
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    // 渲染星星
    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
        ));
    };

    // Loading 狀態
    if (loading) {
        return (
            <div className="thoughts-page">
                <div className="container py-5 text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">載入中...</span>
                    </div>
                    <p className="mt-3 trip-text-gray-600">正在載入回憶旅程...</p>
                </div>
            </div>
        );
    }

    // Error 狀態
    if (error) {
        return (
            <div className="thoughts-page">
                <div className="container py-5 text-center">
                    <div className="alert alert-warning" role="alert">
                        <h4 className="alert-heading">載入失敗</h4>
                        <p>{error}</p>
                        <hr />
                        <button onClick={fetchReviews} className="btn btn-primary">重新載入</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="thoughts-page">
            <div className="container pt-5">

                {/* Breadcrumb */}
                <Breadcrumb items={[
                    { label: '首頁', path: '/' },
                    { label: '回憶旅程' }
                ]} />

                {/* 頁面標題 */}
                <div className="page-header mb-4">
                    <h1 className="h2 trip-text-gray-800">旅程心得</h1>
                    <p className="trip-text-m trip-text-gray-600 mt-2">
                        看看大家的旅程故事，發現更多精彩冒險
                    </p>
                </div>

                {/* 心得列表 */}
                {reviews.length === 0 ? (
                    <div className="empty-state text-center py-5">
                        <div className="empty-icon mb-3">📝</div>
                        <h4 className="trip-text-gray-600">目前還沒有心得</h4>
                        <p className="trip-text-s trip-text-gray-400">成為第一個分享旅程心得的人吧！</p>
                    </div>
                ) : (
                    <div className="reviews-grid">
                        {reviews.map((review) => (
                            <Link
                                to={`/thoughts/${review.id}`}
                                key={review.id}
                                className="review-card text-decoration-none"
                            >
                                {/* 卡片圖片 */}
                                <div className="card-image-box">
                                    <img
                                        src={review.trip_image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800'}
                                        alt={review.trip_title}
                                        className="card-image"
                                    />
                                    {/* 旅程地點標籤 */}
                                    <div className="location-badge">
                                        <span className="location-icon">📍</span>
                                        {review.trip_location}
                                    </div>
                                </div>

                                {/* 卡片內容 */}
                                <div className="card-content-box">
                                    {/* 旅程標題 */}
                                    <h3 className="card-title trip-text-gray-800">
                                        {review.trip_title}
                                    </h3>

                                    {/* 評分 */}
                                    <div className="card-rating mb-2">
                                        {renderStars(review.rating)}
                                    </div>

                                    {/* 心得內容預覽 */}
                                    <p className="card-excerpt trip-text-s trip-text-gray-600">
                                        {truncateContent(review.content)}
                                    </p>

                                    {/* 使用者資訊 */}
                                    <div className="card-footer">
                                        <div className="user-info">
                                            <img
                                                src={review.user_avatar}
                                                alt={review.user_name}
                                                className="user-avatar"
                                            />
                                            <div className="user-details">
                                                <span className="user-name trip-text-s trip-text-gray-800">
                                                    {review.user_name}
                                                </span>
                                                <span className="post-date trip-text-s trip-text-gray-400">
                                                    {formatDate(review.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="likes-count trip-text-s trip-text-gray-400">
                                            <span className="heart-icon">❤️</span> {review.likes_count || 0}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

export default Thoughts;
