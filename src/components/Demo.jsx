function Demo() {
    return (
        <div className="Demo mt-4 text-center">
            <p>快速公版樣式查找區</p>

            <div className="title">
                <h1 className="h1">h1 標題</h1>
                <h2 className="h2">h2 標題</h2>
                <h2 className="h3">h3 標題</h2>
                <h2 className="h4">h4 標題</h2>
                <h2 className="h5">h5 標題</h2>
            </div>
            <div className="text">
                <span className="trip-text-l">內文Ｌ、</span>
                <span className="trip-text-m">內文M、</span>
                <span className="trip-text-s">內文S</span>
            </div>
            <div className="link">
                <a href="##" className="btn link-l">連結</a>
                <a href="##" className="btn link-m">連結</a>
                <a className="link-l disabled">連結</a>

                <a href="##" className="btn link-m link-underline">查看更多</a>
            </div>
            <div className="bitton">
                <button className="btn trip-btn-primary trip-btn-l" type="button">我要開團</button>&nbsp;
                <button className="btn trip-btn-primary trip-btn-m" type="button">我要開團</button>&nbsp;
                <button className="btn trip-btn-primary trip-btn-s" type="button">我要開團</button>&nbsp;
                <button className="btn trip-btn-primary trip-btn-s" type="button" disabled>我要開團</button>&nbsp;
                <button className="btn trip-btn-outline-primary trip-btn-l" type="button">按鈕</button>&nbsp;
                <button className="btn trip-btn-outline-primary trip-btn-m" type="button">按鈕</button>&nbsp;
                <button className="btn trip-btn-outline-primary trip-btn-s" type="button">按鈕</button>&nbsp;
                <button className="btn trip-btn-outline-primary trip-btn-s" type="button" disabled>按鈕</button>&nbsp;
            </div>
        </div>
    )
}
export default Demo