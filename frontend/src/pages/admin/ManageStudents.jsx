import { useState } from "react";
import AdminHeader from "../../components/AdminHeader";
import "./ManageStudents.css";
import { useEffect } from "react";
import toast from "react-hot-toast";
function ManageStudents(){
    const [showPopUp,setShowPopUp]=useState(false);
    const [allClasses,setAllClasses]=useState([]);
    const [allStudents,setAllStudents]=useState([]);
    const [data,setData]=useState({
        name:"",
        fatherName:"",
        email:"",
        password:"",
        class:""
    })
    useEffect(()=>{
        async function getClasses() {
            const res=await fetch(`http://localhost:4400/class/${localStorage.getItem("userId")}`);
            const response=await res.json();
            setAllClasses(response.data);
        }
        async function getStudents() {
            const res=await fetch(`http://localhost:4400/student/all`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({userId:localStorage.getItem("userId")})
            })
            const response=await res.json();
            setAllStudents(response.data);
        }
        getStudents();
        getClasses();
    },[])

    async function handleSubmit() {
        const res=await fetch(`http://localhost:4400/student/add`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                ...data,
                userId:localStorage.getItem("userId")
            })
        })
        const response=await res.json();
        if(response.success){
            toast.success("Student Added Successfully");
            const temp=[...allStudents];
            temp.push({name:data.name,email:data.email,class:data.class,fatherName:data.fatherName})
            setData(temp);
        }
        else{
            toast.error(response.message);
        }
        setData({
            name:"",
        fatherName:"",
        email:"",
        password:"",
        class:""
        })
        setShowPopUp(false);
    }
    return <>
    <AdminHeader/>
    <section id="students-main">
        <div>
           {showPopUp? <div id="add-student-pop-up" onClick={()=>{setShowPopUp(false)}}>
            <form onClick={(e)=>e.stopPropagation()} onSubmit={(e)=>{
                e.preventDefault();
                handleSubmit();
            }}>
                <h1>Add Student</h1>
                <input type="text" placeholder="Enter Student Name" value={data.name} onChange={(e)=>{
                    const temp={...data};
                    temp.name=e.target.value;
                    setData(temp);
                }}/>
                <input type="text" placeholder="Enter Student's Father Name" value={data.fatherName} onChange={(e)=>{
                    const temp={...data};
                    temp.fatherName=e.target.value;
                    setData(temp);
                }}/>
                <input type="email" placeholder="Enter Student's Email" value={data.email} onChange={(e)=>{
                    const temp={...data};
                    temp.email=e.target.value;
                    setData(temp);
                }}/>
                <input type="password" placeholder="Enter Student's Password" value={data.password} onChange={(e)=>{
                    const temp={...data};
                    temp.password=e.target.value;
                    setData(temp);
                }}/>
                <select value={data.class} onChange={(e)=>{
                    const temp={...data};
                    temp.class=e.target.value;
                    setData(temp);
                }}>
                    <option value="" hidden>Select Class</option>
                    {allClasses.map((el,ix)=>{
                        return <option value={el.className} key={ix}>{el.className}</option>
                    })}
                </select>
                <div><input type="submit" value="Add Student" />
                <input type="reset" value="Reset" /></div>
            </form>
        </div>:""}
            <div id="student-top">
                <h1>Manage Students</h1>
                <button onClick={()=>{setShowPopUp(true)}}>Add Student</button>
            </div>
            <div id="students-cards">
                    {allStudents.map((el,ix)=>{
                        return <div className="student-card">
                            <h1>Name:{el.name}</h1>
                            <h1>Email:{el.email}</h1>
                            <h1>Father Name:{el.fatherName}</h1>
                            <h1>Class:{el.class}</h1>
                        </div>
                    })}
            </div>
        </div>
    </section>
    </>
}

export default ManageStudents;