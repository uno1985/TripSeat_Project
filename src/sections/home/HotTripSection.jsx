import '../../assets/css/hotTripSection.css'
import location from '../../assets/images/location.svg'
import time from '../../assets/images/time.svg'
import triprow01 from '../../assets/images/triprow01.png'
import triprow02 from '../../assets/images/triprow02.png'
import triprow03 from '../../assets/images/triprow03.png'
import triprow04 from '../../assets/images/triprow04.png'
import triprow05 from '../../assets/images/triprow05.png'
import triprow06 from '../../assets/images/triprow06.png'
function HotTripSection() {
    return (
        <div className="hotTripSection">
            <div className="container-xl">
                <div className="main">
                    <div className="row">
                        {/* 左側：熱門開團 */}
                        <div className="col-12 col-md-6 mb-4">
                            <div className="bg-white p-4 tripRow">
                                <h2 className="h2 mb-4">熱門開團</h2>
                                {/* 第一筆資料 */}  
                                <div className="d-flex pt-3 position-relative">
                                    {/* 圖片區塊 */}
                                    <div className="flex-shrink-0">
                                        <div className="tripImg">
                                            <img src={triprow01} alt="trip"/>
                                        </div>
                                    </div>

                                    {/* 內容區塊 */}
                                    <div className="flex-grow-1 ms-3">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <h4 className="h4 mb-2">2026 跨年 101煙火團</h4>
                                            <span className="trip-text-m trip-text-gray-400 desktop-show">136人瀏覽</span>
                                        </div>
                                        
                                        <div className="mb-1">
                                            <p className="trip-text-m mb-1 d-flex align-items-center">
                                                <img src={location} className="me-2 icon-location" alt="" />
                                                <span>台北 101 大樓 1F</span>
                                            </p>
                                            <p className="trip-text-m mb-0">
                                                <img src={time} className="me-2" alt="" />
                                                <span>2025/12/31 23:00</span>
                                            </p>
                                        </div>

                                        {/* 剩餘位數標籤 (絕對定位在右下角) */}
                                        <div className="d-flex align-items-center justify-content-end flex-row px-2 py-1">
                                            <span className="trip-text-m trip-text-gray-400 me-3 mobile-show">136人瀏覽</span>
                                            <span className='lastSeat trip-text-m px-2 py-1'>剩餘 1 位</span>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                {/* 第二筆資料 */}
                                <div className="d-flex pt-3 position-relative">
                                    {/* 圖片區塊 */}
                                    <div className="flex-shrink-0">
                                        <div className="tripImg">
                                            <img src={triprow02} alt="trip"/>
                                        </div>
                                    </div>

                                    {/* 內容區塊 */}
                                    <div className="flex-grow-1 ms-3">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <h4 className="h4 mb-2">彩妝課程五人優惠團</h4>
                                            <span className="trip-text-m trip-text-gray-400 desktop-show">36人瀏覽</span>
                                        </div>
                                        
                                        <div className="mb-1">
                                            <p className="trip-text-m mb-1 d-flex align-items-center">
                                                <img src={location} className="me-2 icon-location" alt="" />
                                                <span>台中大遠百門口集合</span>
                                            </p>
                                            <p className="trip-text-m mb-0">
                                                <img src={time} className="me-2" alt="" />
                                                <span>2026/03/04 23:00</span>
                                            </p>
                                        </div>

                                        {/* 剩餘位數標籤 (絕對定位在右下角) */}
                                        <div className="d-flex align-items-center justify-content-end flex-row px-2 py-1">
                                            <span className="trip-text-m trip-text-gray-400 me-3 mobile-show">36人瀏覽</span>
                                            <span className='lastSeat trip-text-m px-2 py-1'>剩餘 1 位</span>
                                        </div>
                                    </div>
                                </div>
                                <hr />

                                {/* 第三筆資料 */}
                                <div className="d-flex pt-3 position-relative">
                                    {/* 圖片區塊 */}
                                    <div className="flex-shrink-0">
                                        <div className="tripImg">
                                            <img src={triprow03} alt="trip"/>
                                        </div>
                                    </div>

                                    {/* 內容區塊 */}
                                    <div className="flex-grow-1 ms-3">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <h4 className="h4 mb-2">台南山上聖誕市集共乘</h4>
                                            <span className="trip-text-m trip-text-gray-400 desktop-show">236人瀏覽</span>
                                        </div>
                                        
                                        <div className="mb-1">
                                            <p className="trip-text-m mb-1 d-flex align-items-center">
                                                <img src={location} className="me-2 icon-location" alt="" />
                                                <span>台南仁德家樂福集合</span>
                                            </p>
                                            <p className="trip-text-m mb-0">
                                                <img src={time} className="me-2" alt="" />
                                                <span>2025/12/20 23:00</span>
                                            </p>
                                        </div>

                                        {/* 剩餘位數標籤 (絕對定位在右下角) */}
                                        <div className="d-flex align-items-center justify-content-end flex-row px-2 py-1">
                                            <span className="trip-text-m trip-text-gray-400 me-3 mobile-show">336人瀏覽</span>
                                            <span className='lastSeat trip-text-m px-2 py-1'>剩餘 1 位</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 右側：最新開團 */}
                        <div className="col-12 col-md-6 mb-4">
                            <div className="bg-white p-4 tripRow">
                                <h2 className="h2 mb-4">最新開團</h2>
                                {/* 第一筆資料 */}  
                                <div className="d-flex pt-3 position-relative">
                                    {/* 圖片區塊 */}
                                    <div className="flex-shrink-0">
                                        <div className="tripImg">
                                            <img src={triprow04} alt="trip"/>
                                        </div>
                                    </div>

                                    {/* 內容區塊 */}
                                    <div className="flex-grow-1 ms-3">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <h4 className="h4 mb-2">手工皮件課程三人成團</h4>
                                            <span className="trip-text-m trip-text-gray-400 desktop-show">12/12 開團</span>
                                        </div>
                                        
                                        <div className="mb-1">
                                            <p className="trip-text-m mb-1 d-flex align-items-center">
                                                <img src={location} className="me-2 icon-location" alt="" />
                                                <span>高雄漢神巨蛋一樓集合</span>
                                            </p>
                                            <p className="trip-text-m mb-0">
                                                <img src={time} className="me-2" alt="" />
                                                <span>2025/12/12 13:00</span>
                                            </p>
                                        </div>

                                        {/* 剩餘位數標籤 (絕對定位在右下角) */}
                                        <div className="d-flex align-items-center justify-content-end flex-row px-2 py-1">
                                            <span className="trip-text-m trip-text-gray-400 me-3 mobile-show">12/12 開團</span>
                                            <span className='lastSeat trip-text-m px-2 py-1'>剩餘 1 位</span>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                {/* 第二筆資料 */}
                                <div className="d-flex pt-3 position-relative">
                                    {/* 圖片區塊 */}
                                    <div className="flex-shrink-0">
                                        <div className="tripImg">
                                            <img src={triprow05} alt="trip"/>
                                        </div>
                                    </div>

                                    {/* 內容區塊 */}
                                    <div className="flex-grow-1 ms-3">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <h4 className="h4 mb-2">阿里山小火車一日遊共乘</h4>
                                            <span className="trip-text-m trip-text-gray-400 desktop-show">12/08 開團</span>
                                        </div>
                                        
                                        <div className="mb-1">
                                            <p className="trip-text-m mb-1 d-flex align-items-center">
                                                <img src={location} className="me-2 icon-location" alt="" />
                                                <span>嘉義火車站集合</span>
                                            </p>
                                            <p className="trip-text-m mb-0">
                                                <img src={time} className="me-2" alt="" />
                                                <span>2025/12/19 08:00</span>
                                            </p>
                                        </div>

                                        {/* 剩餘位數標籤 (絕對定位在右下角) */}
                                        <div className="d-flex align-items-center justify-content-end flex-row px-2 py-1">
                                            <span className="trip-text-m trip-text-gray-400 me-3 mobile-show">12/08 開團</span>
                                            <span className='lastSeat trip-text-m px-2 py-1'>剩餘 1 位</span>
                                        </div>
                                    </div>
                                </div>
                                <hr />

                                {/* 第三筆資料 */}
                                <div className="d-flex pt-3 position-relative">
                                    {/* 圖片區塊 */}
                                    <div className="flex-shrink-0">
                                        <div className="tripImg">
                                            <img src={triprow06} alt="trip"/>
                                        </div>
                                    </div>

                                    {/* 內容區塊 */}
                                    <div className="flex-grow-1 ms-3">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <h4 className="h4 mb-2">卓也藍染、日月潭一日遊</h4>
                                            <span className="trip-text-m trip-text-gray-400 desktop-show">12/07 開團</span>
                                        </div>
                                        
                                        <div className="mb-1">
                                            <p className="trip-text-m mb-1 d-flex align-items-center">
                                                <img src={location} className="me-2 icon-location" alt="" />
                                                <span>苗栗火車站門口集合</span>
                                            </p>
                                            <p className="trip-text-m mb-0">
                                                <img src={time} className="me-2" alt="" />
                                                <span>2025/12/17 07:30</span>
                                            </p>
                                        </div>

                                        {/* 剩餘位數標籤 (絕對定位在右下角) */}
                                        <div className="d-flex align-items-center justify-content-end flex-row px-2 py-1">
                                            <span className="trip-text-m trip-text-gray-400 me-3 mobile-show">12/07 開團</span>
                                            <span className='lastSeat trip-text-m px-2 py-1'>剩餘 1 位</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 底部按鈕 */}
                <div className="text-center more-btn">
                    <button className="btn trip-btn-primary trip-btn-l">
                        更多揪團
                    </button>
                </div>
            </div>
            </div>

    )
}
export default HotTripSection