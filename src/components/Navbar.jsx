
import Collapse from 'bootstrap/js/dist/collapse';
import { Link } from 'react-router';
import '../assets/css/navbar.css'
import logo from '../assets/images/logo.svg'
import { useState } from 'react';



function Navbar() {

    const [isLogin, setIslogin] = useState(false);
    const closeNavbar = () => {
        if (window.innerWidth >= 992) return; // lg 以上不處理

        const el = document.getElementById('navbarNav');
        if (!el) return;

        let instance = Collapse.getInstance(el);
        if (!instance) {
            instance = new Collapse(el, { toggle: false });
        }

        instance.hide();
    };



    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 border-bottom">
            <div className="container">
                <Link to='/' className="navbar-brand d-flex align-items-center" onClick={() => closeNavbar()} ><img src={logo} alt="TripSeat" className="me-2" /></Link>



                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>


                <div className="collapse navbar-collapse" id="navbarNav">

                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                        <li className="nav-item mx-2">
                            <Link to='/trips' className="nav-link text-dark fw-bold" onClick={() => closeNavbar()}>探索旅程</Link>

                        </li>
                        <li className="nav-item mx-2">
                            <Link to='/thoughts' className="nav-link text-dark fw-bold" onClick={() => closeNavbar()} >回憶旅程</Link>

                        </li>
                        <li className="nav-item mx-2">
                            <Link to='/about' className="nav-link text-dark fw-bold" onClick={() => closeNavbar()} >關於TripSeat</Link>

                        </li>
                        {
                            isLogin ? (<li className="nav-item mx-2">
                                <Link to='/member' className="nav-link text-dark fw-bold" onClick={() => closeNavbar()}>會員中心</Link>

                            </li>) : ('')
                        }
                    </ul>

                    {/* 右側按鈕 */}
                    <div className="d-flex">
                        {
                            isLogin ? (
                                <button className="navbar-btn btn trip-btn-primary trip-btn-m" onClick={() => closeNavbar()}>
                                    我要開團
                                </button>
                            ) : (
                                <button className="navbar-btn btn trip-btn-primary trip-btn-m" onClick={() => { setIslogin(true); closeNavbar() }}>
                                    註冊 / 登入
                                </button>
                            )
                        }

                    </div>
                </div>
            </div>
        </nav>
    );
}
export default Navbar