import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Add from './Add.jsx'
import Edit from './Edit.jsx'
import Delete from './Delete.jsx'
import View from './View.jsx'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Singnin from './Singnin.jsx'
import Forgot from './Forgot.jsx'
import Reset from './Reset.jsx'
const router=createBrowserRouter([
  {
    path:'/',
    element:<App/>
  },
  {
    path:'/Add',
    element:<Add/>
  },{
    path:'/Edit/:id',
    element:<Edit/>
  },
  {
  path:'/Delete',
    element:<Delete/>
  },
  {
    path:'/View',
    element:<View/>
  },
  {
    path:'/Signin',
    element:<Singnin/>
  },
  {
    path:'/Forgot',
    element:<Forgot/>
  },
  {
    path:'/Reset',
    element:<Reset/>
  }
])
createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)

