import { useState } from "react";
import AdminHeader from "../../components/AdminHeader"
import "./Dashboard.css";
import { useEffect } from "react";
function Dashboard(){
    const [data,setData]=useState({
        totalStudents:0,
        totalTeachers:0,
        totalSubjects:0,
        totalClasses:0
    })
    useEffect(()=>{
        async function getData() {
            const res=await fetch(`http://localhost:4400/school/dashboard/${localStorage.getItem("userId")}`)
            const response=await res.json();
            setData(response?.data);
        }
        getData();
    },[])
    return <>
    <AdminHeader/>
    <div id="dashboard-cards">
        <div style={{justifyContent:"center",fontSize:"32px"}}><h1>Welcome Admin</h1></div>
        <div>
            <div>
                <h1>Total Teachers</h1>
                <h1>{data.totalTeachers}</h1>
            </div>
            <div>
                <h1>Total Students</h1>
                <h1>{data.totalStudents}</h1>
            </div>
            <div>
                <h1>Total Classes</h1>
                <h1>{data.totalClasses}</h1>
            </div>
            <div>
                <h1>Total Subjects</h1>
                <h1>{data.totalSubjects}</h1>
            </div>
        </div>
    </div>
    </>
}

export default Dashboard;