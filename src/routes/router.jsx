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
                path: '/trips/:id',
                element: <TripDetail />
            },
            {
                path: '/thoughts',
                element: <Thoughts />

            },
            {
                path: '/thoughts/:id',
                element: <ThoughtsDetail />

            },
            {
                path: '/about',
                element: <About />

            },

            {
                path: '/login',
                element: <Login />

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