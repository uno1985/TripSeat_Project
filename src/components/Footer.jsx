import "../assets/css/footer.css";
import logo from "../assets/images/logo.svg";
import x from "../assets/images/X.png";
import line from "../assets/images/LINE.png";
import fb from "../assets/images/FB.png";
import ig from "../assets/images/IG.png";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <div className="footer container pt-52">
      <div className="d-flex justify-content-between pb-60 flex-md-row flex-column">
        <div>
          <div className="d-flex flex-column align-items-start gray-400">
            <img className="pb-12 footerLogo" src={logo} alt="TripSeat Logo" />
            <p className="fz-20">TripSeat | 共享旅程</p>
            <p className="fz-16 fw-400">
              電話<span className="ps-12">07-1314-1688</span>
            </p>
            <p className="fz-16 fw-400">
              地址<span className="ps-12">高雄市六角路168號</span>
            </p>
          </div>
        </div>
        <div className="">

          <Link to="/about" className="mr-8 footerLink">關於我們</Link>
          <Link to="/legal#terms" className="mr-8 footerLink">使用條款</Link>
          <Link to="/legal#privacy" className="mr-8 footerLink">隱私政策</Link>
          <Link to="/legal#faq" className="mr-8 footerLink">常見問題</Link>
        </div>
        <div className="text-start">
          <img className="footerContact mr-12" src={fb} alt="facebook" />
          <img className="footerContact mr-12" src={ig} alt="instagram" />
          <img className="footerContact mr-12" src={line} alt="line" />
          <img className="footerContact" src={x} alt="X" />
        </div>
      </div>
      <p className="copyright">2025© TripSeat | 共享旅程 All RIGHTS RESERVED.</p>
    </div>
  );
}
export default Footer;
