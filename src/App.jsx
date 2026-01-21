import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Router from './router'



function App() {
  return (
    <div className='App'>
      <Navbar />
      <main className="container">
        <Router />
      </main>

      <Footer />

    </div>
  )
}

export default App
