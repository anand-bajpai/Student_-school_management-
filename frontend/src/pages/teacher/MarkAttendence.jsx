import React from 'react'
import TeacherHeader from '../../components/TeacherHeader'
import "./MarkAttendence.css"
import { useState } from 'react'
import { useEffect } from 'react';
function MarkAttendence() {
    const [date,setDate]=useState("");
    const [allStudents,setAllStudents]=useState([]);
    const [allClasses,setAllClasses]=useState([]);
    const [selectedClass,setSelectedClass]=useState("");
    const [selectedSubject,setSelectedSubject]=useState("");
    useEffect(()=>{
        async function getData() {
            const res=await fetch("http://localhost:4400/teacher/getstudents",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({userId:localStorage.getItem("userId")})
            })
            const response=await res.json();
            setAllStudents(response.data);
        }
        async function getClasses() {
            const res=await fetch(`http://localhost:4400/teacher/classes/${localStorage.getItem("userId")}`);
            const response=await res.json();
            setAllClasses(response.data);
        }
        getClasses();
        getData();
    },[])

    async function MarkAttendence(action,id,className) {
        const res=await fetch("http://localhost:4400/student/mark-attendence",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                id:id,
                action:action,
                date:date,
                className:className,
                subject:selectedSubject
            })
        })
        const response=await res.json();
        if(response.success){
            const updatedStudentsData=allStudents.map((el,ix)=>{
                console.log(el._id,id)
                if(el.id==id){
                    el.attendence.push({action:action,
                date:date,
                className:className,
                subject:selectedSubject})
                }
                return el;
            })
            console.log(updatedStudentsData)
            setAllStudents(updatedStudentsData);
        }
    }
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

    function calculateAttendence(attendence){
        const presentActions=attendence.filter((el,ix)=>el.action=="p").length;
        return Math.round(presentActions/attendence.length*100);
    }
  return (
    <>
    <TeacherHeader/>
    <div id='mark-attendence-top'>
        <h1>Mark Attendence</h1>
        <div>
        <input type="date" value={date} onChange={(e)=>{
            setDate(e.target.value)
        }} />
        <select value={selectedClass} onChange={(e)=>{
            setSelectedClass(e.target.value)
        }}>
            <option value="" hidden>Select Class</option>
            {allClasses.map((el,ix)=>{
                return <option value={el.name} key={ix}>{el.name}</option>
            })}
        </select>
        <select value={selectedSubject} onChange={(e)=>{
            setSelectedSubject(e.target.value);
        }}>
            <option value="" hidden>Select Subject</option>
            {allClasses.filter((el,ix)=>{
                return el.name==selectedClass
            })[0]?.subject?.map((el2,ix2)=>{
                return <option value={el2} key={ix2}>{el2}</option>
            })}
        </select>
        </div>
    </div>
    {(date!="" && selectedClass!="" && selectedSubject!=="")?<table  id='mark-attendence-table'>
        <tr style={{fontSize:"22px",height:"40px",backgroundColor:"blue",color:"white"}}>
            <th>Name</th>
            <th>Email</th>
            <th>Father Name</th>
            <th>Class</th>
            <th>Total Attendence</th>
            <th>Action</th>
        </tr>
        {allStudents.map((el,ix)=>{
            if(el.class==selectedClass){
            return <tr key={ix} style={{fontSize:"18px",fontWeight:"bold",backgroundColor:"yellow"}}>
                <td>{el.name}</td>
                <td>{el.email}</td>
                <td>{el.fatherName}</td>
                <td>{el.class}</td>
                <td>{calculateAttendence(el.attendence)+"%"}</td>
                <td style={{display:"flex",gap:"10px",justifyContent:"center",height:"40px",alignItems:"center",border:"none"}}>
                   { el.attendence.filter((el2,ix2)=>{return el2.date==date&&el2.subject==selectedSubject}).length==0?
                    <><button onClick={()=>{
                        MarkAttendence("p",el.id,el.class)
                    }} style={{height:"30px",width:"30%",backgroundColor:"blue",color:"white",cursor:"pointer"}}>Present</button>
                    <button onClick={()=>{
                        MarkAttendence("a",el.id,el.class)
                    }} style={{height:"30px",width:"30%",backgroundColor:"red",color:"white",cursor:"pointer"}}>Absent</button>
                    <button onClick={()=>{
                        MarkAttendence("l",el.id,el.class)
                    }} style={{height:"30px",width:"30%",backgroundColor:"green",color:"white",cursor:"pointer"}}>Late</button>
                </>:showAttendence(el.attendence.filter((el2,ix2)=>{return el2.date==date&&el2.subject==selectedSubject})[0].action)}
                </td>
            </tr>}
        })}
    </table>:<div style={{display:'flex',justifyContent:"center"}}>
        <h1>Select Date, Class And Subject First</h1>
        </div>}
    </>
  )
}

export default MarkAttendence