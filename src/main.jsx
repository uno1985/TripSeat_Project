import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.jsx'
import './assets/css/basic.css'
import './assets/css/style.css'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/TripSeat_Project">
      <App />
    </BrowserRouter>
  </StrictMode>
)
