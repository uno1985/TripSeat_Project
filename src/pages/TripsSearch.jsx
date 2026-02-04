import React, { useState, useEffect } from 'react';
import axios from "axios";
import '../assets/css/tripsSearch.css'
import Selector from '../components/Selector'
import Icon_Location from '../assets/images/icon-location.svg'
import Icon_Time from '../assets/images/icon-time.svg'
import Icon_Certified from '../assets/images/icon-certified.svg'

function TripsSearch() {
    const [trips, setTrips] = useState([]);
    useEffect(() => {
        const getTrips = async () => {
            const response = await axios.get('https://tripseat-api-server.onrender.com/trips');
            if (!!response && !!response.data) {
                setTrips(response.data);
            }
        }
        getTrips();
    }, []);

    function handleTripsCount(num) {
        if (!num) {
            return 0;
        }
        return num > 999 ? '999+' : num;
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
                                    <span className="trip-text-m">{handleTripsCount(trips.length)}</span>
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
                            <div className="pagination-container">
                                <nav aria-label="Page navigation example">
                                    <ul className="pagination justify-content-center">
                                        <li className="page-item">
                                        <a className="page-link trip-text-primary-1000" href="#" aria-label="Previous">
                                            <span aria-hidden="true">&laquo;</span>
                                        </a>
                                        </li>
                                        <li className="page-item"><a className="page-link trip-text-primary-1000" href="#">1</a></li>
                                        <li className="page-item"><a className="page-link trip-text-primary-1000" href="#">2</a></li>
                                        <li className="page-item"><a className="page-link trip-text-primary-1000" href="#">3</a></li>
                                        <li className="page-item">
                                        <a className="page-link trip-text-primary-1000" href="#" aria-label="Next">
                                            <span aria-hidden="true">&raquo;</span>
                                        </a>
                                        </li>
                                    </ul>
                                    </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

function SideBar() {
    return (
        <>
        <div className="tripsSreach-sideBar">
            <div className="filter-group">
                <label className="filter-label trip-text-m">搜尋關鍵字</label>
                <input type="text" className="input w-100"/>
            </div>
            <div className="filter-group">
                <label className="filter-label trip-text-m">旅遊日期</label>
                <input type="text" className="input w-100"/>
            </div>
            <div className="filter-group">
                <label className="filter-label trip-text-m">出發地</label>
                <Selector
                    data={[{text:"台北市", value: "台北市"}, {text:"台中市", value:"台中市"}, {text:"高雄市", value:"高雄市"}]}
                    defaultValue={"台北市"}
                    className="selector" />
            </div>
            <div className="filter-group">
                <label className="filter-label trip-text-m">類別</label>
                <Selector
                    data={[{text:"跨年", value: "跨年"}, {text:"親子", value:"親子"}, {text:"露營", value:"露營"}, {text:"海邊", value:"海邊"}]}
                    defaultValue={"跨年"}
                    className="selector" />
            </div>
            <div className="filter-group">
                <label className="filter-label trip-text-m">旅程天數</label>
                <Selector
                    data={[{text:"單日", value: "單日"}, {text:"多日", value:"多日"}]}
                    defaultValue={"單日"}
                    className="selector" />
            </div>
            <div className="filter-group">
                <label className="filter-label trip-text-m">交通方式</label>
                <Selector
                    data={[{text:"自駕自乘", value: "自駕自乘"}, {text:"自行前往", value:"自行前往"}, {text:"大眾交通", value:"大眾交通"}, {text:"專人接送", value:"專人接送"}]}
                    defaultValue={"自行前往"}
                    className="selector" />
            </div>
            <div className="filter-group">
                <label className="filter-label trip-text-m">其他</label>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="certifiedHost" name="certifiedHost"/>
                    <label className="form-check-label trip-text-m" htmlFor="certifiedHost">真安心團主認證</label>
                </div>
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
        return (<div className="status-box status-available d-flex align-items-center">
            <span className="text-title-m trip-text-primary-1000">{`剩餘 ${vacancy} 個座位`}</span>
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
            {handleDisplayCertifiedHost(true)}
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
                    <div className="host-info-container d-flex align-items-center">
                        <div className="host-photo">
                            {/* {<img src=""/>} */}
                        </div>
                        <span className="text-title-m">UNO</span>
                    </div>
                    <div>{handleDisplayVacancy({max_people: trip.max_people, current_participants: trip.current_participants})}</div>
                </div>
            </div>
        </div>
        </>
    );
}

function Tag({text}) {
    return (
        <div className="trip-tag d-flex justify-content-center align-items-center"><span className="">{text}</span></div>
    )
}



export default TripsSearch