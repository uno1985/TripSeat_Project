// 導入套件
import { Outlet } from "react-router-dom"

//導入共用元件
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Demo from "../components/Demo";

//導入圖片
import bearImage from '../assets/images/bear.png';



const Layout = () => {
    return (
        <div className="container-fluid px-0">

            <Navbar />
            <Outlet />
            <Footer />
            <Demo />

            <div className="bear">
                <img src={bearImage} alt="氣球小熊" />
            </div>

        </div>
    )
}
export default Layout