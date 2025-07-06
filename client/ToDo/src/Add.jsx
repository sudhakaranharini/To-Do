import React from 'react'
import Server from './Server'
import { useEffect,useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
function Add() {
    const navigate=useNavigate();
    const [title,setTitle]=useState("");
    const [description,setDescription]=useState("");
    const handleOnClick=async()=>{
            const token=localStorage.getItem('token')
            await axios.post('https://to-do-ctkd.onrender.com/todos',{title,description},{headers:{Authorization:`Bearer ${token}`}})
            .then(()=>{navigate('/view'),alert("Todo Added")})
            .catch(err=>console.log(err.message))
    }

  return (
    <>
    <Server/>
    <div className="add-field">
    <input type="text" placeholder='Title' name='Title' onChange={(e)=>setTitle(e.target.value)}/>
    <input type="text" placeholder='Description' name='Description'  onChange={(e)=>setDescription(e.target.value)}/>
    <button onClick={handleOnClick}>Submit</button>
    </div>
    </>
  )
}

export default Add