export default function ReviewCard({ className, avatar, name, content, age }) {
  return (
    <div className={` ${className}`}>
       
      <div className="rev-card-content relative">
        <img src={avatar} alt="User Avatar" className="z-1 relative" />
        
        <p className="rev-name mt-12 trip-text-l relative z-1">
          {name}｜{age}
        </p>
        <p className="trip-text-m mt-12 relative z-1">{content}</p>
         <div className="white-bg"></div>

      </div>
    </div>
  );
}


