import React from 'react'
import Server from './Server'
import { useNavigate,useParams } from 'react-router-dom';
import { useState,useEffect } from 'react';
import axios from 'axios'
function Edit() {
  const{id}=useParams();
  const navigate=useNavigate();
  const [title,setTitle]=useState("");
  const [description,setDescription]=useState("");
  const token = localStorage.getItem('token')
  useEffect(()=>{
      axios.get(`http://localhost:8000/todos/${id}`,{headers: { Authorization: `Bearer ${token}` }})
      .then((res)=>{
        setTitle(res.data.title);
        setDescription(res.data.description)
      })
      .catch(err=>console.log(err.message))
  },[])
  const handleOnClick=async()=>{
    await axios.put(`http://localhost:8000/todos/${id}`,{title,description},{headers: { Authorization: `Bearer ${token}` }})
    .then(()=>{navigate('/view'),alert("Todo updated")})
    .catch(err=>console.log(err.message))
  }
  return (
    <>
    <Server/>
    <div className="add-field">
    <input type="text"  name='Title' onChange={(e)=>setTitle(e.target.value)} value={title}/>
    <input type="text"  name='Description'  onChange={(e)=>setDescription(e.target.value)} value={description}/>
    <button onClick={()=>handleOnClick()}>Submit</button>
    </div>
    </>
  )
}

export default Edit