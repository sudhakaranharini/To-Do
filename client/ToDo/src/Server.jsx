import React from 'react'
import {useNavigate,useLocation} from 'react-router-dom'
function Server() {
  const location=useLocation();
  const navigate=useNavigate();
  return (
    <>
    <div className='heading'>
    <h1>TO-DO</h1>
     <b className='h5' onClick={()=>{
       if(confirm("Do you wanna Logout")){ localStorage.removeItem('token');navigate('/')};
     
     }}>LogOut</b>
     </div>
    
    
    
    <div  className='Add'>
      <button  className={location.pathname==='/View'? 'Add-style active':'Add-style'} onClick={()=>{navigate('/View')}}>View</button>
      <button  className={location.pathname==='/Add'? 'Add-style active':'Add-style'} onClick={()=>{navigate('/Add')}}>Add</button>
    </div>
    </>
  )
}

export default Server