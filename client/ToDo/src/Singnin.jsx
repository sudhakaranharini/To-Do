import React from 'react'
import {useNavigate} from 'react-router-dom'
import {useState,useEffect} from 'react'
import axios from 'axios'
function Singnin() {
    const [username,setUsername]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const navigate=useNavigate()
    const handleClick=()=>{
        axios.post('http://localhost:8000/signup',{username,email,password})
        .then((res)=>{console.log(res.data.message);
            alert(res.data.message);
            localStorage.setItem('token', res.data.token);
            navigate('/View');
        })
        .catch(err=>{
            console.log(err.message);
            alert(err.response?.data?.message||"SignUp Failed")
        })

    }
  return (
    <>
    <h1 className='todo'>TO-DO SIGNUP</h1>
   <div className='Login-Main'>
   <div className='Login'>
    
    <input type="text" placeholder='UserName' onChange={(e)=>setUsername(e.target.value)}/>
    <input type="email" placeholder='Email' onChange={(e)=>setEmail(e.target.value)}/>
    <input type="password" placeholder='Password' onChange={(e)=>setPassword(e.target.value)}/>
    <button onClick={handleClick}>SignUp</button>
   </div>
   <div className='Span'>
   <span onClick={()=>navigate('/')}>Login?</span>
   </div>
   </div>
   </>
  )
}

export default Singnin