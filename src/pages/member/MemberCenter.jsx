import CenterNotifications from './CenterNotifications';
import MyGroups from './MyGroups';
import MyJoinedTrips from './MyJoinedTrips-v7';  // ← 用這邊調整版本
function MemberCenter() {
  return (
    <>{/* 右側內容區 */}

      <CenterNotifications />
      <MyGroups />
      <MyJoinedTrips />   {/* ← 加這行 */}

    </>
  )

}
export default MemberCenter