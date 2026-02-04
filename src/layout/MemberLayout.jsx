import { Outlet, Link } from "react-router-dom";

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
                <Outlet />
            </div >
        </div>
    )
}
export default MemberLayout