import React from 'react'
import {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Forgot() {
    const navigate=useNavigate()
    const [email,setEmail]=useState("")
    const handleSubmit=async()=>{
        await axios.post('https://to-do-ctkd.onrender.com/forgot-password',{email})
        .then((res)=>{alert(res.data.message);
            navigate('/Reset')
        })
        .catch(err=> alert(err.response?.data?.message || "Error"))

    }
  return (
    <>
    <h2 className='heading'>Forgot Password</h2>
    <div className="forgot-input">
    <input type="email" placeholder='Enter Your Email' onChange={(e)=>setEmail(e.target.value)} />
    <button onClick={handleSubmit}>Send OTP</button>
    </div>
    </>
  )
}

export default Forgot