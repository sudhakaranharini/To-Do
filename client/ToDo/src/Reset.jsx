import React from 'react'
import {useState} from 'react';
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
function Reset() {
    const navigate=useNavigate()
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleSubmit = async () => {
            await axios.post('https://to-do-ctkd.onrender.com/reset-password', { email, otp, newPassword})
            .then((res)=>{
                alert(res.data.message);
                navigate('/')})
            .catch((err)=> 
                {
                    alert(err.response?.data?.message || "Error")
                })
        }
  return (
    <>
    <h2 className='heading'>Reset Password</h2>
    <div className="forgot-input">
            <input
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />
            <input
                type="text"
                placeholder="Enter OTP"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
            />
            <input
                type="password"
                placeholder="Enter new password"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
            />
            <button onClick={handleSubmit}>Reset Password</button>
        </div>
    </>
  )
}

export default Reset