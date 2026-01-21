import { Outlet } from "react-router-dom"


function Me() {
    return (
        <div className="row">
            <div className="col-2">

                <div className="d-grid gap-2">
                    <span>會員中心選單</span>
                    <button className="btn btn-primary" type="button">我的檔案</button>
                    <button className="btn btn-primary" type="button">我的旅程</button>
                    <button className="btn btn-primary" type="button">我的揪團</button>
                    <button className="btn btn-primary" type="button">我要開團</button>
                    <button className="btn btn-primary" type="button">我的收藏</button>
                    <button className="btn btn-primary" type="button">訊息通知</button>
                </div>
            </div>
            <div className="col-10">
                <Outlet />
            </div>
        </div>
    )

}
export default Me