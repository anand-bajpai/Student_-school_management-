import React from 'react'
import "./TeacherHeader.css";
import { Link, useNavigate } from 'react-router-dom';
function TeacherHeader() {
  const navigate=useNavigate();
  return (
    <div style={{boxShadow:"0px 4px 8px rgba(0,0,0,0.2)"}}>
    <div id="teacher-header">
            <h1>TeacherPanel</h1>
            <ul>
                <li><Link>Mark Attendence</Link></li>
                <li  style={{cursor:"pointer"}} onClick={()=>{
                  localStorage.removeItem("userId");
                  navigate("/login")
                }}>Logout</li>
            </ul>
        </div>
    </div>
  )
}

export default TeacherHeader