import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState,useEffect } from 'react';
import View from './View';
import axios from 'axios'
function Home() {
    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")
    const navigate=useNavigate();
    const handleClick=()=>{
        axios.post('http://localhost:8000/login',{username,password})
        .then((res)=>{console.log(res.data.message);
    alert(res.data.message);
    localStorage.setItem('token', res.data.token);
     navigate('/View')})
        .catch(err=>{console.log(err.message);
            alert(err.response?.data?.message||"Login Failed")
        })
    }
  return (
    <>
   <h1 className='todo'>TO-DO LOGIN</h1>
   <div className='Login-Main'>
   <div className='Login'>
    <input type="text" placeholder='UserName' onChange={(e)=>setUsername(e.target.value)}/>
    <input type="password" placeholder='Password' onChange={(e)=>setPassword(e.target.value)}/>
    <button onClick={handleClick}>Login</button>
   </div>
   <div className='Span'>
   <span onClick={()=>navigate('/Forgot')}>Forgot Password?</span>
   <span onClick={()=>navigate('/Signin')}>SignUp?</span>
   </div>
   </div>
   </>
  )
}

export default Home