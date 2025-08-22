import React from 'react'
import "./StudentHeader.css"
import { Link, useNavigate } from 'react-router-dom'
function StudentHeader() {
  const navigate=useNavigate();
  return (
    <div style={{boxShadow:"0px 4px 8px rgba(0,0,0,0.2)"}}>
    <div id="student-header">
        <h1>StudentPanel</h1>
        <ul>
            <li><Link>Show Attendence</Link></li>
            <li style={{cursor:"pointer"}} onClick={()=>{
              localStorage.removeItem("userId");
              navigate("/login")
            }}>Logout</li>
        </ul>
    </div>
    </div>
  )
}

export default StudentHeader;