
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/basic.css'
import './assets/css/style.css'

import { createHashRouter, RouterProvider } from 'react-router';
import routes from './routes/router';

//全站登入狀態
import { AuthProvider } from './contexts/AuthContext';

const router = createHashRouter(routes)

createRoot(document.getElementById('root')).render(

  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>

)
