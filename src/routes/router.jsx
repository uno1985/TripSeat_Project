// 說明文
// 引入所有有route的頁面檔案位置，並且設定路由(網址)名稱
// children下的 path 以下兩種方式皆會呈現相同結果
// {
//     path: '/member',
//         element: <MemberLayout />,
//             children: [
//                 {
//                     // 我的檔案
//                     path: 'profile', <這邊
//                     element: <MemberProfile />,
//                 },
//                 {
//                     // 我的檔案
//                     path: '/member/profile', <這邊
//                     element: <MemberProfile />,
//                 },
// }

import Layout from "../layout/Layout"
import MemberLayout from "../layout/MemberLayout"
import About from "../pages/About"
import Home from "../pages/Home"
import MemberCenter from "../pages/member/MemberCenter"
import NotFound from "../pages/NotFound"
import Thoughts from "../pages/Thoughts"
import ThoughtsDetail from "../pages/ThoughtsDetail"
import TripsSearch from "../pages/TripsSearch"
import TripDetail from "../pages/TripDetail"
import Login from "../pages/Login"
import MemberProfile from "../pages/member/MemberProfile"
import MemberTrips from "../pages/member/MemberTrips"
import MemberGroups from "../pages/member/MemberGroups"
import MemberCreateGroups from "../pages/member/MemberCreateGroups"
import MemberFavorites from "../pages/member/MemberFavorites"
import MemberNotifications from "../pages/member/MemberNotifications"
import Legal from "../pages/Legal"


const routes = [
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                //首頁
                path: '/',
                element: <Home />
            },
            {
                //探索旅程
                path: '/trips',
                element: <TripsSearch />
            },
            {
                //行程詳細
                path: '/trips/:id',
                element: <TripDetail />
            },
            {
                //回憶旅程
                path: '/thoughts',
                element: <Thoughts />
            },
            {
                //回憶旅程詳細
                path: '/thoughts/:id',
                element: <ThoughtsDetail />
            },
            {
                //關於TripSeat
                path: '/about',
                element: <About />
            },
            {
                //服務條款與幫助
                path: '/legal',
                element: <Legal />
            },
            {
                //登入
                path: '/login',
                element: <Login />
            },
            {
                //會員中心
                path: '/member',
                element: <MemberLayout />,
                children: [
                    {
                        // 會員中心主頁面
                        path: '/member',
                        element: <MemberCenter />,
                    },
                    {
                        // 會員中心主頁面
                        path: '/member/profile',
                        element: <MemberProfile />,
                    },
                    {
                        // 我的檔案
                        path: '/member/trips',
                        element: <MemberTrips />,
                    },
                    {
                        // 我的旅程
                        path: '/member/trips',
                        element: <MemberTrips />,
                    },
                    {
                        // 我的揪團
                        path: '/member/groups',
                        element: <MemberGroups />,
                    },
                    {
                        // 我要開團
                        path: '/member/create-group',
                        element: <MemberCreateGroups />,
                    },
                    {
                        // 我的收藏
                        path: '/member/favorites',
                        element: <MemberFavorites />,
                    },
                    {
                        // 訊息通知
                        path: '/member/notifications',
                        element: <MemberNotifications />,
                    },

                ]

            },
            {
                //找不到頁面
                path: '*',
                element: <NotFound />

            },

        ]
    },

]

export default routes