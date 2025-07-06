import React from 'react'
import Server from './Server'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
function View() {
  const navigate=useNavigate()
  const [todos,setTodos]=useState([])
  const [search,setSearch]=useState("")
     const token=localStorage.getItem('token');
  useEffect(()=>{
   
    axios.get('https://to-do-ctkd.onrender.com/todos',{headers: { Authorization: `Bearer ${token}`}})
    .then((res)=>setTodos(res.data))
    .catch(err=>console.log(err.message))
  },[])
  const handleClick=(id)=>{
    axios.delete(`https://to-do-ctkd.onrender.com/todos/${id}`,{headers: { Authorization: `Bearer ${token}` }})
    .then(()=>{alert("deleted");
            fetchTodos();})
    .catch(err=>console.log(err.message))
  }
const fetchTodos=()=>{
  axios.get('https://to-do-ctkd.onrender.com/todos',{headers: { Authorization: `Bearer ${token}` }})
    .then((res) => setTodos(res.data))
    .catch(err => console.log(err.message));
};
  return (
    <>
    <Server/>
    <div className="search-button">
    <input type="text" placeholder='Search By Title' className='search-field' onChange={(e)=>setSearch(e.target.value)} value={search}/>
    </div>
    { 
    (todos.length>0)?(
    <ul>
      {todos.filter((todo)=>todo.title.toLowerCase().includes(search.toLowerCase()))
      .map((todo)=>(
      
        <li key={todo._id}className='edit-delete'>
          <div>
          <h3>{todo.title}</h3>
          <p>{todo.description}</p>
           </div>
           <div>
          <div className="edit-change">
          <button  className='edit' onClick={()=>{navigate(`/Edit/${todo._id}`)}}>Edit</button>
          <button  className='delete' onClick={()=>{handleClick(todo._id)}}>Delete</button>
          </div>
          </div>
        </li>
     
      ))
      }
    </ul>
    ):(<div className='icon' onClick={()=>navigate('/Add')}><i className="bi bi-plus-circle"></i></div>)
    }

    </>
  )
}

export default View