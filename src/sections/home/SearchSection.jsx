import Selector from '../../components/Selector'
import Image1157 from '../../assets/images/home-search-1157.svg'
import Image1156 from '../../assets/images/home-search-1156.svg'
import Image1775 from '../../assets/images/home-search-1775.svg'
import Image996 from '../../assets/images/home-search-996.svg'
import SearchBtn from '../../assets/images/home-search-btn.svg'

const areas = [
    {text: '台北市', value: '台北市'},
    {text: '台中市', value: '台中市'},
    {text: '高雄市', value: '高雄市'},
]

function SearchSection() {
    return (
        <>
        <div className="searchSection position-relative">
            <div className="search-container mx-auto">
                <h2 className="h2 text-center">從這裡，開始你的旅程</h2>
                <SearchBar />
                <div className="image-box d-flex justify-content-between align-items-end">
                    <div><img src={Image1157} className="img-fluid" /></div>
                    <div><img src={Image1156} className="img-fluid" /></div>
                    <div><img src={Image1775} className="img-fluid" /></div>
                    <div><img src={Image996} className="img-fluid" /></div>
                </div>
            </div>
        </div>
        </>
    )
}

function SearchBar() {
    return <div className="searchBar d-flex">
        <div className="selector-box">
            <Selector
                data={areas}
                className="selector h-100 text-center border-0 border-end"
            />
        </div>
        <div className="flex-grow-1">
            <input
                type="text"
                className="h-100 w-100 border-0 ps-2"
                placeholder={'請搜尋"煙火"'}/>
        </div>
        <div className="searchBtn-box d-flex justify-content-center align-items-center">
            <div className="searchBtn" onClick={(e) => {console.log(e.target)}}>
                <img src={SearchBtn} />
            </div>
        </div>
    </div>
}

export default SearchSection