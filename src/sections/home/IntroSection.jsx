import Step1MainImg from '../../assets/images/home-step-37.svg'
import Step2MainImg from '../../assets/images/home-step-38.svg'
import Step3MainImg from '../../assets/images/home-step-39.svg'
import Step4MainImg from '../../assets/images/home-step-40.svg'
import Step1 from '../../assets/images/home-step-1.svg'
import Step2 from '../../assets/images/home-step-2.svg'
import Step3 from '../../assets/images/home-step-3.svg'
import Step4 from '../../assets/images/home-step-4.svg'
import BigCloud from '../../assets/images/big-cloud.svg'
import SmallCloud from '../../assets/images/small-cloud.svg'

const introData = [
    {
        step: 1,
        title: '註冊會員​',
        content: '輸入​基本​資料​並​完成​ E​mail ​驗證，​即可​加入​會員，​立即​開啟​你​的​旅程​探索。',
        stepImg: Step1,
        mainImg: Step1MainImg
    },
    {
        step: 2,
        title: '可以​搜尋​加入​',
        content: '透過關​鍵字​搜尋​你​感興趣​的​旅程，​立即​申請​加入！​待團主同​意後即​可​成功​報名、​準備​出發。​',
        stepImg: Step2,
        mainImg: Step2MainImg
    },
    {
        step: 3,
        title: '可以​創建​旅程​',
        content: '建立​你​的​旅程，​找到​願意​一起​同行​的​夥伴。​有​人​申請時，​你​也​有​權​可​審核​是否​加入。​',
        stepImg: Step3,
        mainImg: Step3MainImg
    },
    {
        step: 4,
        title: '快​樂出​發​',
        content: '準時​抵達​集合​地點，​享受​旅程。​結交​新​朋友，​分享沿途風景！​',
        stepImg: Step4,
        mainImg: Step4MainImg
    }]

function IntroSection() {

    return (
        <div className="introSection position-relative">
            <img className="position-absolute bigCloud" src={BigCloud}/>
            <img className="position-absolute smallCloud" src={SmallCloud}/>
            <div className="intro-container container mx-auto">
                <div className="row gx-5 align-items-start">
                    {
                        introData.map((data) => <IntroCard key={data.step} data={data}/>)
                    }
                </div>
            </div>
        </div>


    )
}

export default IntroSection

function IntroCard({data}) {
    return (
        <div className="introCard col-12 col-md-3 d-flex flex-wrap justify-content-center align-items-center">
            <div className="stepImg-box"><img src={data.stepImg} className="w-100" alt={`步驟${data.step}`} /></div>
            <div className="mainImg-box"><img src={data.mainImg} className="w-100" alt={data.title} /></div>
            <div className="text-box">
                <h4 className="h4 text-center">{data.title}</h4>
                <p className="trip-text-l text-center">{data.content}</p>
            </div>
        </div>
    );
}