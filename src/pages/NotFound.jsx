import { Link } from "react-router-dom";
import "../assets/css/notFound.css";

const NotFound = () => {
  return (
    <section className="not-found-section">
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-70">
          <div className="col-lg-6 text-center">
            {/* 404 大字 */}
            <div className="not-found-code">404</div>

            {/* 插圖 */}
            <div className="not-found-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=600&h=400&fit=crop&q=80"
                alt="迷路的旅人"
                className="not-found-image"
              />
            </div>

            {/* 文字 */}
            <h2 className="h3 trip-text-gray-800 mt-4">
              哎呀，這條路走不通！
            </h2>
            <p className="trip-text-m trip-text-gray-400 mt-3 mb-4">
              看起來你迷路了，這個頁面不存在。
              <br />
              別擔心，讓我們帶你回到起點，重新出發吧！
            </p>

            {/* 回首頁按鈕 */}
            <Link to="/" className="btn trip-btn-m trip-btn-primary mt-2">
              <i className="bi bi-house-door me-2"></i>
              回到首頁
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
