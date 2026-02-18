import { Link } from 'react-router-dom';
import '../../assets/css/myJoinedTrips-v3.css';

const MyJoinedTrips = () => {
    const joinedTrips = [
        {
            id: 1,
            status: '即將出發',
            statusType: 'upcoming',
            title: '綠島石朗潛水團',
            date: '2026/01/15 - 01/17',
            location: '台東縣 綠島鄉',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&fit=crop',
            host: '潛水員阿強',
            hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
            participants: 4,
            maxPeople: 4,
        },
        {
            id: 2,
            status: '招募中',
            statusType: 'open',
            title: '台南美食散步 | 古蹟巡禮一日遊',
            date: '2026/02/20',
            location: '台南市 中西區',
            image: 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?q=80&w=800&fit=crop',
            host: '露營女孩艾琳',
            hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=irene',
            participants: 3,
            maxPeople: 8,
        },
        {
            id: 3,
            status: '已結束',
            statusType: 'ended',
            title: '2026 跨年 101 煙火團',
            date: '2025/12/31',
            location: '台北市 信義區',
            image: 'https://images.unsplash.com/photo-1505935428862-770b6f24f629?q=80&w=800&fit=crop',
            host: '小明愛旅行',
            hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ming',
            participants: 10,
            maxPeople: 10,
        },
    ];

    return (
        <div className="my-joined-section my-5">
            <div className="d-flex justify-content-between align-items-center mb-4 mx-2">
                <h3 className="h3 mb-0">我參加的旅程</h3>
                <Link to="/member/trips" className="trip-text-m link-m link-underline-gray-600">查看更多</Link>
            </div>

            <div className="joined-list">
                {joinedTrips.map((trip) => (
                    <Link
                        to={`/trips/${trip.id}`}
                        key={trip.id}
                        className={`joined-card ${trip.statusType === 'ended' ? 'joined-card-ended' : ''}`}
                    >
                        {/* 左側圖片 */}
                        <div className="joined-card-img-wrapper">
                            <img src={trip.image} alt={trip.title} className="joined-card-img" />
                            <span className={`joined-status-dot joined-status-${trip.statusType}`}></span>
                        </div>

                        {/* 中間資訊 */}
                        <div className="joined-card-body">
                            <div className="joined-card-top">
                                <span className={`joined-status-tag joined-tag-${trip.statusType}`}>
                                    {trip.status}
                                </span>
                                <h5 className="joined-card-title">{trip.title}</h5>
                            </div>

                            <div className="joined-card-meta">
                                <span><i className="bi bi-calendar3 me-1"></i>{trip.date}</span>
                                <span><i className="bi bi-geo-alt me-1"></i>{trip.location}</span>
                            </div>

                            <div className="joined-card-bottom">
                                {/* 團主 */}
                                <div className="joined-host">
                                    <img src={trip.hostAvatar} alt={trip.host} className="joined-host-avatar" />
                                    <span>{trip.host}</span>
                                </div>

                                {/* 人數進度條 */}
                                <div className="joined-progress-wrapper">
                                    <div className="joined-progress-bar">
                                        <div
                                            className="joined-progress-fill"
                                            style={{ width: `${(trip.participants / trip.maxPeople) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="joined-progress-text">
                                        {trip.participants}/{trip.maxPeople} 人
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 右側箭頭 */}
                        <div className="joined-card-arrow">
                            <i className="bi bi-chevron-right"></i>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default MyJoinedTrips;
