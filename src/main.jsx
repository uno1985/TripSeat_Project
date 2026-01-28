
import { createRoot } from 'react-dom/client'

// import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './assets/css/basic.css'
import './assets/css/style.css'

import { createHashRouter, RouterProvider } from 'react-router';
import routes from './routes/router';

const router = createHashRouter(routes)

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
