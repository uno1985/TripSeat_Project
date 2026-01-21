import { Route, Routes } from 'react-router-dom'

// 主單元
import Home from './pages/Home'
import Thoughts from './pages/Thoughts'
import TripsSearch from './pages/TripsSearch'
import Me from './pages/me'

// Me的子頁面
import MeIndex from './pages/me/MeIndex'

function Router() {
    return (

        <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/thoughts' element={<Thoughts />}></Route>
            <Route path='/tripsSearch' element={<TripsSearch />}></Route>
            <Route path='/member' element={<Me />}>
                <Route index element={<MeIndex />}></Route>
            </Route>
        </Routes>

    )
}
export default Router