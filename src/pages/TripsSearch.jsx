import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from "axios";
import '../assets/css/tripsSearch.css'
import Selector from '../components/Selector'
import Icon_Location from '../assets/images/icon-location.svg'
import Icon_Time from '../assets/images/icon-time.svg'
import Icon_Certified from '../assets/images/icon-certified.svg'
import { Categories, Transports } from '../data/constants.js'
const API_URL = import.meta.env.VITE_API_BASE;

function TripsSearch() {
    const [trips, setTrips] = useState([]);
    const [totalCount, setTotalCount] = useState();
    const [currentPage, setPage] = useState();
    const [limit, setLimit] = useState();
    const [searchParams] = useSearchParams();
    useEffect(() => {
        const getTrips = async () => {
            setPage(currentPage || Number(searchParams.get('page')) || 1);
            setLimit(limit || Number(searchParams.get('limit')) || 9);
            const url = searchParams
                        ? `${API_URL}/trips?${searchParams}`
                        : `${API_URL}/trips`;
            const response = await axios.get(url, {
                params: {
                    _page: currentPage,
                    _limit: limit
                }
            });
            if (!!response && !!response.data) {
                setTrips(response.data);
                setTotalCount(response?.headers['x-total-count'] || 0)
            }
        }
        getTrips();
    }, [searchParams, currentPage]);

    function handleTotalCount() {
        if (!totalCount) {
            return 0;
        }
        return totalCount > 999 ? '999+' : totalCount;
    }
    
    return (
        <>
        <div className="tripsSearch">
            <div className="container">
                <div className="main">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item trip-text-m">首頁</li>
                            <li className="breadcrumb-item active trip-text-m fw-bold" aria-current="page">探索旅程</li>
                        </ol>
                    </nav>
                    <div className="d-flex align-items-start gap-24 mt-4">
                        <SideBar />
                        <div className="flex-grow-1">
                            <div className="filter-container d-flex">
                                <div className="flex-grow-1">
                                    <span className="trip-text-m">搜尋到</span>
                                    <span className="trip-text-m">{handleTotalCount()}</span>
                                    <span className="trip-text-m">個結果</span></div>
                                <div className="d-flex align-items-center">
                                    <span className="trip-text-m flex-shrink-0">排序方式</span>
                                    <Selector
                                        data={[{text:"依開團時間", value: "依開團時間"}, {text:"最新開團", value:"最新開團"}, {text:"熱門開團", value:"熱門開團"}]}
                                        defaultValue={"依開團時間"}
                                        className="selector text-center ms-2" />
                                </div>
                            </div>
                            <div className="list-container">
                                <div className="grid">
                                    {trips.map((trip) => {
                                        return (
                                            <TripCard key={trip.id} data={trip}/>
                                        )
                                    })}
                                </div>
                            </div>
                            <Pagination 
                                currentPage={currentPage}
                                setPage={setPage}
                                totalCount={totalCount}
                                limit={limit} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

function SideBar() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filters, setFilters] = useState({
        q: '',
        //start_date: '',
        location_like: [],
        tags_like: [],
        //days: '',
        transportation_like: '',
        owner_is_verified_host: null
    });

    function handleFilterChange(e) {
        const {name:key, value, checked} = e.target;
        setFilters((prev) => {
            let newValue = structuredClone(filters[key]);

            switch (key) {
                case 'location_like':
                case 'tags_like':
                    if (newValue.includes(value)) {
                        newValue.splice(newValue.indexOf(value), 1);
                    }
                    else {
                        newValue.push(value);
                    }
                    break;
                case 'owner_is_verified_host':
                    newValue = Number(checked);
                    break;
                default:
                    newValue = value;
                    break;
            }

            return {
                ...prev,
                [key]: newValue
            }
        });
    }

    function onUpdateFilter() {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            switch (typeof(value)) {
                case 'string':
                case 'boolean':
                case 'number':
                    if (value || typeof(value) === 'boolean') {
                        params.set(key, value);
                    }
                    break;
                case 'object':
                    if (Array.isArray(value) && value) {
                        value.forEach((item) => params.append(key, item));
                    }
                    break;
            }
            // if (Array.isArray(value)) {
            //     value.forEach((item) => params.append(key, item));
            // }
            // else {
            //     if (value) {
            //         params.set(key, value)
            //     }
            // }
        });
        setSearchParams(params);
    }

    return (
        <>
        <div className="tripsSreach-sideBar">
            <div className="filter-group">
                <label className="filter-label trip-text-m">搜尋關鍵字</label>
                <input type="text" className="input w-100"
                    name="q"
                    onChange={(e) => handleFilterChange(e)}/>
            </div>
            <div className="filter-group">
                <label className="filter-label trip-text-m">旅遊日期</label>
                <input type="text" className="input w-100"/>
            </div>
            <div className="filter-group">
                <label className="filter-label trip-text-m">出發地</label>
                <Selector
                    data={[{text:"台北市", value: "台北市"}, {text:"台中市", value:"台中市"}, {text:"高雄市", value:"高雄市"}]}
                    placeholder={filters.location_like.join(',') || "請選擇"}
                    name={"location_like"}
                    onChange={(e) => handleFilterChange(e)}
                    className="selector" />
            </div>
            <div className="filter-group">
                <label className="filter-label trip-text-m">類別</label>
                <Selector
                    data={Categories}
                    name={"tags_like"}
                    placeholder={filters.tags_like.join(',') || "請選擇"}
                    onChange={(e) => handleFilterChange(e)}
                    className="selector" />
            </div>
            <div className="filter-group">
                <label className="filter-label trip-text-m">旅程天數</label>
                <Selector
                    data={[{text:"單日", value: "單日"}, {text:"多日", value:"多日"}]}
                    name={"days"}
                    placeholder={"請選擇"}
                    onChange={(e) => handleFilterChange(e)}
                    className="selector" />
            </div>
            <div className="filter-group">
                <label className="filter-label trip-text-m">交通方式</label>
                <Selector
                    data={Transports}
                    name={"transport_like"}
                    placeholder={filters.transportation_like || "請選擇"}
                    onChange={(e) => handleFilterChange(e)}
                    className="selector" />
            </div>
            <div className="filter-group">
                <label className="filter-label trip-text-m">其他</label>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="certifiedHost"
                        name="owner_is_verified_host"
                        onChange={(e) => handleFilterChange(e)}/>
                    <label className="form-check-label trip-text-m" htmlFor="certifiedHost">真安心團主認證</label>
                </div>
            </div>
            <div className="updateBtn-container">
                <button className="btn trip-btn-primary trip-btn-l" type="button"
                    onClick={(e) => onUpdateFilter(e)}>更新搜尋</button>
            </div>
        </div>
        </>
    );
}

function TripCard({data: trip}) {
    const handleDisplayDate = ({start_date, end_date}) => {
        const days = ['一', '二', '三', '四', '五', '六', '日'];
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        const startStr = `${startDate.getFullYear()}/${startDate.getMonth() + 1}/${startDate.getDate()}(${days[startDate.getDay()]})`;
        const endStr = `${endDate.getFullYear()}/${endDate.getMonth() + 1}/${endDate.getDate()}(${days[endDate.getDay()]})`;

        if (startDate.getTime() === endDate.getTime()) {
            return startStr;
        }

        return `${startStr}-${endStr}`;
    }

    const handleDisplayVacancy = ({max_people, current_participants}) => {
        const vacancy = max_people - current_participants;

        if (vacancy <= 0) {
            return (
                <div className="status-box status-full d-flex align-items-center">
                    <span className="text-title-m">已成團</span>
                </div>
            )
        }
        return (<div className="status-box status-available d-flex align-items-center flex-shrink-0">
            <span className="text-title-m trip-text-primary-1000 text-nowrap">{`剩餘 ${vacancy} 個座位`}</span>
            </div>
        );
    }

    const handleDisplayCertifiedHost = (isCertified) => {
        if (!isCertified) return null;
        
        return (
            <div className="position-absolute certified-host">
                <div className="d-flex align-items-center h-100">
                    <img src={Icon_Certified} className="icon-certified" />
                    <span>真安心團主</span>
                </div>
            </div>
        );
    }

    return (
        <>
        <div className="g-col-4 tripCard position-relative">
        <Link to={`/trips/${trip.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {handleDisplayCertifiedHost(trip.owner_is_verified_host)}
            <div className="imgBox">
                <img src={trip.image_url} alt={trip.title} />
            </div>
            <div className="contentBox">
                <div className="tags-container d-flex">
                    {trip.tags.map((tag, index) => <Tag text={tag} key={`${trip.id}_${index}_${tag}`}/>)}
                </div>
                <h5 className="h5">{trip.title}</h5>
                <div className="trip-info-container">
                    <div className="d-flex align-items-center">
                        <img src={Icon_Location} className="icon"/>
                        <span className="trip-text-s">{trip.location}</span>
                    </div>
                    <div className="d-flex align-items-center">
                        <img src={Icon_Time} className="icon"/>
                        <span className="trip-text-s">{handleDisplayDate({start_date: trip.start_date, end_date: trip.end_date})}</span>
                    </div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                    <div className="host-info-container d-flex align-items-center flex-grow-1">
                        <div className="host-photo">
                            <img src={trip.owner_avatar}/>
                        </div>
                        <div className="host-name text-title-m">{trip.owner_name}</div>
                    </div>
                    <div>{handleDisplayVacancy({max_people: trip.max_people, current_participants: trip.current_participants})}</div>
                </div>
            </div>
        </Link>
        </div>
        </>
    );
}

function Tag({text}) {
    return (
        <div className="trip-tag d-flex justify-content-center align-items-center"><span className="">{text}</span></div>
    )
}

function Pagination({currentPage, setPage, totalCount, limit}) {
    const totalPages = Math.ceil(totalCount / limit);
    return (
        <>
        <div className="pagination-container">
            <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
                    <li className="page-item"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) {
                                setPage(currentPage - 1);
                            }
                        }}>
                    <a className="page-link trip-text-primary-1000" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                    </li>
                    {
                        Array.from({ length: totalPages }, (_, i) => i + 1).map((idx) => {
                            return (
                                <li className="page-item"
                                    key={`page_${idx}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setPage(idx);
                                    }}
                                ><a className="page-link trip-text-primary-1000" href="#">{idx}</a></li>
                            )
                        })
                    }
                    <li className="page-item"
                        onClick={(e) => {
                                e.preventDefault();
                                if (totalPages > currentPage) {
                                    setPage(currentPage + 1);
                                }
                            }}>
                    <a className="page-link trip-text-primary-1000" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                    </li>
                </ul>
            </nav>
        </div>
        </>
    )
}



export default TripsSearch