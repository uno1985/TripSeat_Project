import CenterNotifications from './CenterNotifications';
import MyGroups from './MyGroups';
function MemberCenter() {
    return (
      <>{/* 右側內容區 */}
        <div className="col-lg-9 col-12">
          <CenterNotifications />
          <MyGroups />
        </div>
      </>
    )

}
export default MemberCenter