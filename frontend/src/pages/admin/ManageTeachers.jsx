import { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader";
import "./ManageTeachers.css";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import {toast} from "react-hot-toast";
import { MdDelete } from "react-icons/md";
function ManageTeachers(){
    const [showPassword,setShowPassword]=useState(false);
    const [showPopUp,setShowPopUp]=useState(false);
    const [allClasses,setAllClasses]=useState([]);
    const [allTeachers,setAllTeachers]=useState([]);
    const [selectedTeacher,setSelectedTeacher]=useState(-1);
    const [data,setData]=useState({
        name:"",
        email:"",
        password:"",
        profile:null,
        classSubjects:[]
    })
    const [selectedClass,setSelectedClass]=useState({name:"",subject:""});
    useEffect(()=>{
        async function getClasses() {
            const res=await fetch(`http://localhost:4400/class/${localStorage.getItem("userId")}`);
            const response=await res.json();
            if(response.success){
                console.log(response.data);
                setAllClasses(response.data);
            }
        }
        async function getTeachers() {
            const res=await fetch(`http://localhost:4400/teacher/all`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({userId:localStorage.getItem("userId")})
            })
            const response=await res.json();
            setAllTeachers(response.data);
            // console.log(response.data);
        }
        getTeachers();
        getClasses();
    },[])

    function handleClear(){
        setData({
        name:"",
        email:"",
        password:"",
        profile:null,
        classSubjects:[]
        })
    }

    async function handleSubmit() { 
        const formData=new FormData();
        formData.append("userId",localStorage.getItem("userId"));
        for(let i in data){
            if(data[i]=="" || data[i]==null || data[i]==[]){
                toast.error(`${i} is required`);
                return;
            }
            if(i!="classSubjects"){
                formData.append(i,data[i])
            }
            else{
            formData.append(i,JSON.stringify(data[i]));}
        }
        const res=await fetch("http://localhost:4400/teacher/add",{
            method:"POST",
            body:formData
        })
        const response=await res.json();
        // console.log(response);
        if(response.success){
            toast.success("Teacher Added Successfully");
            const temp=[...allTeachers];
            temp.push({name:data.name,email:data.email,profile:response.data.teachers[(response.data.teachers.length)-1].profile,classSubjects:data.classSubjects})
            setAllTeachers(temp);
        }
        else{
            toast.error(response.message);
        }
        handleClear();
        setShowPopUp(false);
    }

    async function handleRemoveTeacher(index) {
        const res=await fetch("http://localhost:4400/teacher/remove",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({userId:localStorage.getItem("userId"),index:index})
        })
        const response=await res.json();
        if(response.success){
            toast.success("Teacher Deleted Successfully");
            const temp=allTeachers.filter((el,ix)=>ix!=index);
            setAllTeachers(temp);
            
        }
        else{
            toast.error(response.message);
        }
    }

    return <>
    <AdminHeader/>
    <section id="manage-teachers">
        {showPopUp?<div id="add-teacher-pop-up" onClick={()=>{
            setShowPopUp(false);
        }}>
            <div onClick={(e)=>e.stopPropagation()}>
                <div id="teacher-details-form">
                <h1>Add Teacher</h1>
                <input type="text" placeholder="Enter Teacher Name" value={data.name} onChange={(e)=>{
                    const temp={...data};
                    temp.name=e.target.value;
                    setData(temp);
                }}/>
                <input type="email" placeholder="Enter Teacher Email" value={data.email} onChange={(e)=>{
                    const temp={...data};
                    temp.email=e.target.value;
                    setData(temp);
                }}/>
                <div id="teacher-password"><input type={showPassword?"text":"password"} 
                 placeholder="Enter Teacher Password" value={data.password} onChange={(e)=>{
                    const temp={...data};
                    temp.password=e.target.value;
                    setData(temp);
                 }}/>
                    {showPassword?<FaEye id="password-eyes" onClick={()=>{
                        setShowPassword(false);
                    }}/>:<FaEyeSlash id="password-eyes" onClick={()=>{
                        setShowPassword(true);
                    }}/>}
                </div>
                <select value={selectedClass.name} onChange={(e)=>{
                    const temp={...selectedClass}; //{name:"",subject:""}
                    temp.name=e.target.value;
                    temp.subject="";
                    setSelectedClass(temp);
                }}>
                    <option value="" hidden>Select Class</option>
                    {allClasses.map((el,ix)=>{
                        return <option value={el.className} key={ix}>{el.className}</option>
                    })}
                </select> 
                <select value={selectedClass.subject} onChange={(e)=>{
                    const temp={...selectedClass};
                    temp.subject=e.target.value;
                    setSelectedClass(temp);
                }}>
                    <option value="" hidden>Select Subject</option>
                    {allClasses.filter((el)=>{
                        return el.className==selectedClass.name
                    })[0]?.subjects.map((el2,ix)=>{
                        return <option value={el2} key={ix}>{el2}</option>
                    })}
                </select>
                <div id="teacher-add-subject-btn"><button onClick={()=>{
    
                    if(selectedClass.name!="" && selectedClass.subject!=""){
                        const isClassExists=data.classSubjects.filter((el)=>{
                            return el.name==selectedClass.name
                        }).length>0
                        const temp={...data};
                        if(isClassExists){
                            temp.classSubjects=temp.classSubjects.map((el,ix)=>{
                                if(el.name==selectedClass.name && !el.subject.includes(selectedClass.subject)){
                                    el.subject.push(selectedClass.subject)
                                }
                                return el;
                            })
                        }
                        else{
                            temp.classSubjects.push({name:selectedClass.name,subject:[selectedClass.subject]})
                        }
                        setData(temp);
                        setSelectedClass({name:"",subject:""});
                    }
                }}>Add Class</button></div>
                <label>Profile Picture:<input type="file"  onChange={(e)=>{
                    const file=e.target.files[0];
                    const temp={...data};
                    temp.profile=file;
                    // console.log(temp);
                    setData(temp);
                }}/></label>
                <div id="teacher-form-btns">
                <button onClick={()=>{
                    handleSubmit();
                }}>Add Teacher</button>
                <button onClick={()=>{
                    handleClear();
                }}>Clear</button>
                </div>
                </div>
                <div id="teacher-subjects">
                    {data.classSubjects.map((el,ix)=>{
                        return <div className="teacher-subject" key={ix}>
                            <span id="remove-class" onClick={()=>{
                                const temp={...data};
                                temp.classSubjects=temp.classSubjects.filter((el2,ix2)=>{
                                    return ix!=ix2;
                                })
                                setData(temp);
                            }}>X</span>
                        <h1>{el.name}</h1>
                        <ul>
                            {el.subject.map((el2,ix2)=>{
                                return <li key={ix+""+ix2}>{el2}</li>
                            })}

                        </ul>
                    </div>
                    })}
                </div>
            </div>
        </div>:""}
    <div id="manage-teachers-main">
        <div id="manage-teachers-top">
            <h1>Manage Teachers</h1>
            <button onClick={()=>{
                setShowPopUp(true);
            }}>Add Teacher</button>
        </div>
        <div id="teachers-cards">
            {allTeachers.map((el,ix)=>{
                return <div key={ix} className="teacher-card" onClick={()=>{
                    setSelectedTeacher(ix==selectedTeacher?-1:ix);
                }}>
                    {selectedTeacher==ix?<div id="remove-teacher-card">
                        <MdDelete style={{color:"red",height:"30%",width:"50%",cursor:"pointer"}} onClick={()=>{
                            handleRemoveTeacher(ix);
                        }}/>
                    </div>:""}
                    <div>
                        <img src={"http://localhost:4400/"+el.profile} />
                    </div>
                    <div id="teacher-card-personal-details">
                        <h1><span>Name:</span>{el.name}</h1>
                        <h1><span>Email:</span>{el.email}</h1>
                    </div>
                    <div id="teacher-card-subject-details">
                        {el.classSubjects.map((el2,ix2)=>{
                            return <div key={ix+""+ix2}>
                                <h2>{el2.name}</h2>
                                <ul>
                                    {el2.subject.map((el3,ix3)=>{
                                        return <li key={ix+""+ix2+""+ix3} style={{color:"orange"}}>{el3}</li>
                                    })}
                                </ul>
                            </div>
                        })}
                    </div>
                </div>
            })}
        </div>
    </div>
    </section>
    </>
}

export default ManageTeachers;