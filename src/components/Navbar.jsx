
import '../assets/css/navbar.css'
import logo from '../assets/images/logo.svg'

function Navbar() {

    return (
        <>
            <nav className="navbar container-fluid navbar-expand-lg navbar-light bg-light">
                <div className="container trip-nav-inner">
                    <div className="trip-logo" ><img src={logo} alt="TripSeat" /></div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        {/* <div className="trip-nav-spacer"></div> */}
                        <div className="row">
                            <div class="col-md-3 offset-md-3">
                                <div className=' trip-menu'>
                                    <ul className="navbar-nav mx-auto trip-menu">
                                        <li className="nav-item">
                                            <a className="nav-link btn link-l" href="#">探索旅程</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link btn link-l" href="#">回憶旅程</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link btn link-l" href="#">關於TripSeat</a>
                                        </li>

                                    </ul>

                                </div>
                            </div>
                            <div class="col-md-3 offset-md-3">
                                {/* <div className="trip-nav-right"> */}
                                <button className="trip-btn btn trip-btn-primary trip-btn-m ms-auto">註冊 / ​登入</button>
                                {/* </div> */}
                            </div>
                        </div>



                    </div>

                </div>
            </nav>
        </>
    )
}
export default Navbar