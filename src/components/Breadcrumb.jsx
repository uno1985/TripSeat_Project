import { Link } from 'react-router-dom';
import '../assets/css/breadcrumb.css';

/**
 * 通用麵包屑元件說明文，請自行取用，並請要記得導入本檔案喔
 *
 * @param {Array} items - 麵包屑項目陣列
 *   - label: 顯示文字
 *   - path: 連結路徑（最後一項不需要，會自動當作當前頁面）
 *
 * @example
 * // 基本用法
 * <Breadcrumb items={[
 *   { label: '首頁', path: '/' },
 *   { label: '旅程心得', path: '/thoughts' },
 *   { label: '心得詳情' }  // 最後一項不需要 path
 * ]} />
 *
 * @example
 * // 動態標題
 * <Breadcrumb items={[
 *   { label: '首頁', path: '/' },
 *   { label: '探索旅程', path: '/tripsSearch' },
 *   { label: trip.title }
 * ]} />
 */
function Breadcrumb({ items = [] }) {
  // 預設首頁
  const defaultItems = [{ label: '首頁', path: '/' }];
  const allItems = items.length > 0 && items[0].path === '/'
    ? items
    : [...defaultItems, ...items];

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb trip-breadcrumb trip-text-m  ">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;

          // 當前頁面（最後一項）- 粗體
          if (isLast || !item.path) {
            return (
              <li
                key={index}
                className="trip-text-m text-dark fw-bold breadcrumb-item"
                aria-current="page"
              >
                {item.label}
              </li>
            );
          }

          // 連結項目 - 一般字重
          return (
            <li key={index} className="breadcrumb-item">
              <Link to={item.path} className="trip-text-m pe-0 fw-normal">
                {item.label}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
