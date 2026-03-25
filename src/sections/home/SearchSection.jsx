import '../../assets/css/searchSection.css'
import { useNavigate } from 'react-router-dom';
import { Regions } from '../../data/constants.js'
import Selector from '../../components/Selector'
import Image1157 from '../../assets/images/home-search-1157.svg'
import Image1156 from '../../assets/images/home-search-1156.svg'
import Image1775 from '../../assets/images/home-search-1775.svg'
import Image996 from '../../assets/images/home-search-996.svg'
import SearchBtn from '../../assets/images/home-search-btn.svg'
import { useState } from 'react';

const allRegions = Object.values(Regions).flat();

function SearchSection() {
    return (
        <>
            <div className="searchSection position-relative">
                <div className="container">
                    <div className="main">
                        <h2 className="h2 text-center"><span>從這裡，</span><span>開始你的旅程</span></h2>
                        <SearchBar />
                        <div className="image-box d-flex justify-content-between align-items-end">
                            <div><img src={Image1157} className="img-fluid" alt="旅遊風景" /></div>
                            <div><img src={Image1156} className="img-fluid" alt="旅遊風景" /></div>
                            <div><img src={Image1775} className="img-fluid" alt="旅遊風景" /></div>
                            <div><img src={Image996} className="img-fluid" alt="旅遊風景" /></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function SearchBar() {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [region, setRegion] = useState('');
    return <div className="searchBar d-flex">
        <div className="selector-box">
            <Selector
                data={allRegions}
                placeholder={"選擇地區"}
                defaultValue={region}
                className="selector h-100 text-center border-0 border-end"
                onChange={(e) => {
                    setRegion(e.target.value);
                }}
            />
        </div>
        <div className="flex-grow-1">
            <input
                type="text"
                className="h-100 w-100 border-0 ps-2"
                placeholder={'請搜尋"跨年"'}
                value={keyword}
                onChange={(e) => {
                    setKeyword(e.target.value);
                }} />
        </div>
        <div className="searchBtn-box flex-shrink-0" onClick={() => {
            const params = new URLSearchParams();

            if (keyword) {
                params.set('q', keyword);
            }
            if (region) {
                params.set('location_like', region);
            }

            const queryString = params.toString();
            const sortString = 'sort=views&_order=desc'
            const url = `/trips?` + (queryString ? `${queryString}&` : '') + sortString;

            navigate(url);
        }}>
            <img src={SearchBtn} className="w-100" alt="搜尋按鈕" />
        </div>
    </div>
}

export default SearchSection