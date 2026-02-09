import { Outlet, Link } from "react-router-dom";
import MemberSidebar from "../components/MemberSidebar";

const MemberLayout = () => {

    return (
        <div className=" trip-color-gray-100">
            <div className="container-xl pt-5">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to='/' className="btn trip-text-m pe-0">首頁</Link>
                        </li>
                        <li className="btn trip-text-m text-dark fw-bold breadcrumb-item" aria-current="page">會員中心</li>
                    </ol>
                </nav>
                <div className="row">
                    {/* 左側選單：電腦版佔 3 欄，手機版佔全寬 */}
                    <div className="col-lg-3 col-12 mb-4">
                        <MemberSidebar />
                    </div>

                    {/* 右側內容區 */}
                    
                    <Outlet />
                </div>
                {/* <CenterNotifications />
                    <MyGroups /> */}
            </div >
        </div>
    )
}
export default MemberLayout