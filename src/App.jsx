import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Router from './Router'
import bearImage from './assets/images/bear.png';


function App() {
  return (
    <div className="container-fluid px-0">
      <Navbar />

        <Router />

      <Footer />
      <div className="bear">
        <img src={bearImage} alt="氣球小熊"/>
      </div>
    </div>
  )
}

export default App
