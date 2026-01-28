import Layout from "../layout/Layout"
import MeLayout from "../layout/MeLayout"
import About from "../pages/About"
import Home from "../pages/Home"
import MeIndex from "../pages/me/MeIndex"
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
                path: '/me',
                element: <MeLayout />,
                children: [
                    {
                        path: '/me',
                        element: <MeIndex />,
                    },

                ]

            },
            ,
            {
                path: '*',
                element: <NotFound />

            },

        ]
    },

]

export default routes