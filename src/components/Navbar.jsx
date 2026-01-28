
import '../assets/css/navbar.css'
import logo from '../assets/images/logo.svg'

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 border-bottom">
            <div className="container">
                {/* 1. Logo 區塊 */}
                <a className="navbar-brand d-flex align-items-center" href="#">
                    <img src={logo} alt="TripSeat" className="me-2" />
                </a>

                {/* 行動裝置漢堡選單按鈕 */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* 2. 導覽選單 & 3. 右側按鈕 */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    {/* 使用 mx-auto 將 ul 頂到中間 */}
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                        <li className="nav-item mx-2">
                            <a className="nav-link text-dark fw-bold" href="#">探索旅程</a>
                        </li>
                        <li className="nav-item mx-2">
                            <a className="nav-link text-dark fw-bold" href="#">回憶旅程</a>
                        </li>
                        <li className="nav-item mx-2">
                            <a className="nav-link text-dark fw-bold" href="#">關於TripSeat</a>
                        </li>
                    </ul>

                    {/* 右側按鈕 */}
                    <div className="d-flex">
                        <button className="btn trip-btn-primary trip-btn-m">
                            註冊 / 登入
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
export default Navbar