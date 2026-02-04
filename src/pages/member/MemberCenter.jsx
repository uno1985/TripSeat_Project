import MemberSidebar from '../../components/MemberSidebar';
import CenterNotifications from './CenterNotifications';
import MyGroups from './MyGroups';
function MemberCenter() {
    return (
      <div className="row">
        {/* 左側選單：電腦版佔 3 欄，手機版佔全寬 */}
        <div className="col-lg-3 col-12 mb-4">
          <MemberSidebar />
        </div>

        {/* 右側內容區 */}
        <div className="col-lg-9 col-12">
          <CenterNotifications />
          <MyGroups />
        </div>
      </div>
    )

}
export default MemberCenter