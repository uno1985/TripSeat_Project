import Layout from "../layout/Layout"
import MemberLayout from "../layout/MemberLayout"
import About from "../pages/About"
import Home from "../pages/Home"
import MemberCenter from "../pages/member/MemberCenter"
import NotFound from "../pages/NotFound"
import Thoughts from "../pages/Thoughts"
import TripsSearch from "../pages/TripsSearch"


const routes = [
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Home />

            },
            {
                path: '/trips',
                element: <TripsSearch />

            },
            {
                path: '/thoughts',
                element: <Thoughts />

            },
            {
                path: '/about',
                element: <About />

            },
            {
                path: '/member',
                element: <MemberLayout />,
                children: [
                    {
                        // 會員中心主頁面 (Dashboard)
                        path: '/member',
                        element: <MemberCenter />,
                    },
                    // {
                    //     path: 'profile', //個人檔案
                    //     element: <MemberProfile />,
                    // },
                ]

            },
            {
                path: '*',
                element: <NotFound />

            },

        ]
    },

]

export default routes