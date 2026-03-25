import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import '../../assets/css/hotTripSection.css';
import location from '../../assets/images/location.svg';
import time from '../../assets/images/time.svg';
import fallbackTripImage from '../../assets/images/triprow01.png';

const API_URL = import.meta.env.VITE_API_BASE;
const LIST_LIMIT = 3;

function formatDate(dateString) {
  if (!dateString) return '日期待定';
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '日期待定';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

function formatMonthDay(dateString) {
  if (!dateString) return '最新開團';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '最新開團';
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}/${day} 開團`;
}

function buildDateText(trip) {
  const dateText = formatDate(trip.start_date);
  if (!trip.meeting_time) return dateText;
  return `${dateText} ${trip.meeting_time}`;
}

function getRemainingText(trip) {
  const remain = Number(trip.max_people || 0) - Number(trip.current_participants || 0);
  return remain > 0 ? `剩餘 ${remain} 位` : '已成團';
}

function HotTripList({ title, trips, desktopMeta, mobileMeta }) {
  return (
    <div className="bg-white p-4 tripRow">
      <h2 className="h2 mb-4">{title}</h2>
      {trips.map((trip, index) => (
        <div key={trip.id}>
          <div className="d-flex pt-3 position-relative">
            <div className="flex-shrink-0">
              <div className="tripImg">
                <img src={trip.image_url || fallbackTripImage} alt={trip.title} />
              </div>
            </div>

            <div className="flex-grow-1 ms-3">
              <div className="d-flex justify-content-between align-items-start">
                <Link to={`/trips/${trip.id}`} className="h4 mb-2 text-decoration-none">
                  {trip.title}
                </Link>
                <span className="trip-text-m trip-text-gray-400 desktop-show">
                  {desktopMeta(trip)}
                </span>
              </div>

              <div className="mb-1">
                <p className="trip-text-m mb-1 d-flex align-items-center">
                  <img src={location} className="me-2 icon-location" alt="" />
                  <span>{trip.meeting_point || trip.location || '地點待定'}</span>
                </p>
                <p className="trip-text-m mb-0">
                  <img src={time} className="me-2" alt="" />
                  <span>{buildDateText(trip)}</span>
                </p>
              </div>

              <div className="d-flex align-items-center justify-content-end flex-row px-2 py-1">
                <span className="trip-text-m trip-text-gray-400 me-3 mobile-show">
                  {mobileMeta(trip)}
                </span>
                <span className="lastSeat trip-text-m px-2 py-1">{getRemainingText(trip)}</span>
              </div>
            </div>
          </div>
          {index < trips.length - 1 && <hr />}
        </div>
      ))}
    </div>
  );
}

function HotTripSection() {
  const [popularTrips, setPopularTrips] = useState([]);
  const [latestTrips, setLatestTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchTrips = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const [popularRes, latestRes] = await Promise.all([
          axios.get(`${API_URL}/trips`, {
            signal: controller.signal,
            params: {
              status: 'open',
              _sort: 'views',
              _order: 'desc',
              _limit: LIST_LIMIT,
            },
          }),
          axios.get(`${API_URL}/trips`, {
            signal: controller.signal,
            params: {
              status: 'open',
              _sort: 'created_at',
              _order: 'desc',
              _limit: LIST_LIMIT,
            },
          }),
        ]);

        // [AI修改開始 2026-03-10] 首頁熱門/最新開團只顯示未刪除且正式公開的旅程
        setPopularTrips(
          (popularRes.data || []).filter((trip) => !trip.deleted_at && trip.status === 'open')
        );
        setLatestTrips(
          (latestRes.data || []).filter((trip) => !trip.deleted_at && trip.status === 'open')
        );
        // [AI修改結束 2026-03-10]
      } catch (error) {
        if (error?.name !== 'CanceledError' && error?.code !== 'ERR_CANCELED') {
          setIsError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchTrips();

    return () => controller.abort();
  }, []);

  const showEmpty = useMemo(
    () => !isLoading && !isError && popularTrips.length === 0 && latestTrips.length === 0,
    [isLoading, isError, popularTrips.length, latestTrips.length]
  );

  return (
    <div className="hotTripSection">
      <div className="container-xl">
        <div className="main">
          <div className="row">
            <div className="col-md-6 mb-4">
              <HotTripList
                title="熱門開團"
                trips={popularTrips}
                desktopMeta={(trip) => `${Number(trip.views || 0)}人瀏覽`}
                mobileMeta={(trip) => `${Number(trip.views || 0)}人瀏覽`}
              />
            </div>

            <div className="col-md-6 mb-4">
              <HotTripList
                title="最新開團"
                trips={latestTrips}
                desktopMeta={(trip) => formatMonthDay(trip.created_at)}
                mobileMeta={(trip) => formatMonthDay(trip.created_at)}
              />
            </div>
          </div>

          {isLoading && <p className="text-center trip-text-m mt-2">載入熱門開團中...</p>}
          {isError && <p className="text-center trip-text-m mt-2">熱門開團載入失敗，請稍後再試</p>}
          {showEmpty && <p className="text-center trip-text-m mt-2">目前尚無可顯示的開團資料</p>}
        </div>

        <div className="text-center more-btn">
          <Link to="/trips" className="btn trip-btn-primary trip-btn-l">
            更多揪團
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HotTripSection;
