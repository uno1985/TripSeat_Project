import CenterNotifications from './CenterNotifications';
import MyGroups from './MyGroups';
import MyJoinedTrips from './MyJoinedTrips';  // ← 用這邊調整版本
function MemberCenter() {
  return (
    <>{/* 右側內容區 */}

      <CenterNotifications />
      <MyGroups />
      <MyJoinedTrips /> 

    </>
  )

}
export default MemberCenter