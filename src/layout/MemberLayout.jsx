// 導入套件
import { Outlet, useLocation } from "react-router-dom";

//導入共用元件
import MemberSidebar from "../components/MemberSidebar";
import Breadcrumb from '../components/Breadcrumb';


// 路徑 → 麵包屑對照表設定
const BREADCRUMB_MAP = {
    '/member': '會員中心',
    '/member/profile': '我的檔案',
    '/member/trips': '我的旅程',
    '/member/groups': '我的揪團',
    '/member/create-group': '我要開團',
    '/member/favorites': '我的收藏',
    '/member/notifications': '訊息通知',
};


const MemberLayout = () => {

    const { pathname } = useLocation();
    // 自動組合麵包屑
    const currentLabel = BREADCRUMB_MAP[pathname] || '會員中心';
    const isSubPage = pathname !== '/member';
    const breadcrumbItems = [
        { label: '首頁', path: '/' },
        ...(isSubPage
            ? [
                { label: '會員中心', path: '/member' },
                { label: currentLabel }
            ]
            : [
                { label: '會員中心' }
            ]
        )
    ];

    return (
        <div className=" trip-color-gray-100">
            <div className="container-xl pt-5">
                {/* Breadcrumb */}
                <Breadcrumb items={breadcrumbItems} />
                <div className="row">
                    {/* 左側選單：電腦版佔 3 欄，手機版佔全寬 */}
                    <div className="col-lg-3 col-12 mb-4">
                        <MemberSidebar />
                    </div>
                    {/* 右側內容區 */}
                    <div className="col-lg-9 col-12">
                        <Outlet />
                    </div>

                </div>
            </div >
        </div>
    )
}
export default MemberLayout