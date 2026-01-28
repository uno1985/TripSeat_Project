import { Outlet } from "react-router"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import bearImage from '../assets/images/bear.png';


const Layout = () => {
    return (
        <div className="container-fluid px-0">

            <Navbar />
            <Outlet />
            <Footer />

            <div className="bear">
                <img src={bearImage} alt="氣球小熊" />
            </div>

        </div>
    )
}
export default Layout