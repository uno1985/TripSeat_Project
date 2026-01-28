import { Outlet } from "react-router"
import MeNavbar from "../pages/me/MeNavbar"

const MeLayout = () => {

    return (
        <>

            <div className="container mt-2">
                <div className="row">
                    <div className="col-md-12 col-lg-2 d-none d-lg-block">
                        <ul className="list-unstyled">
                            <MeNavbar />

                        </ul>
                    </div>
                    <div className="col-md-12 col-lg-10">
                        <Outlet />
                    </div>
                </div>
            </div >



        </>






    )
}
export default MeLayout