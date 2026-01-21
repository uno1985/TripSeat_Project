import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Router from './router'



function App() {
  return (
    <div className="container-fluid px-0">
      <Navbar />

        <Router />

      <Footer />

    </div>
  )
}

export default App
