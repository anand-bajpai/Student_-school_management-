import React from 'react'
import StudentHeader from '../../components/StudentHeader'
import { useState } from 'react'
import { useEffect } from 'react';

function Attendence() {
  const [attendence,setAttendence]=useState([]);
  useEffect(()=>{
    async function getData() {
      const res=await fetch(`http://localhost:4400/student/attendence/${localStorage.getItem("userId")}`)
      const response=await res.json();
      console.log(response.data)
      setAttendence(response.data);
    }

    getData();
  },[])
   function showAttendence(action){
        if(action=="p"){
            return <span style={{color:"rgba(42, 155, 7, 1)",fontSize:"20px",fontWeight:"bolder"}}>Present</span>
        }
        else if(action=="l"){
            return <span style={{color:"purple",fontSize:"20px",fontWeight:"bolder"}}>Late</span>
        }
        else{
            return <span style={{color:"red",fontSize:"20px",fontWeight:"bolder"}}>Absent</span>
        }
    }
  return (
    <>
    <StudentHeader/>
    <div style={{height:"100vh",display:"flex",alignItems:"center",marginTop:"100px",flexDirection:"column",gap:"20px"}}>
      <div style={{width:"80%",fontSize:"25px"}}><h1>Attendence</h1></div>
    <table style={{border:"5px solid black",width:"80%",borderCollapse:"collapse"}}>
      <tbody>
        <tr style={{fontSize:"25px",backgroundColor:'blue',height:"40px",color:"white"}}>
          <th>Date</th>
          <th>Subject</th>
          <th>Teacher</th>
          <th>Action</th>
        </tr>
        {attendence.map((el,ix)=>{
          return <tr key={ix} style={{border:"5px solid black",textAlign:"center",fontSize:'20px',backgroundColor:"yellow",fontWeight:"bold"}}>
            <td style={{border:"5px solid black"}}>{el.date}</td>
            <td style={{border:"5px solid black"}}>{el.subject}</td>
            <td style={{border:"5px solid black"}}>{el.teacher}</td>
            <td style={{border:"5px solid black",textAlign:"center"}}>{showAttendence(el.action)}</td>
          </tr>
        })}
      </tbody>
    </table>
    </div>
    </>
  )
}

export default Attendence