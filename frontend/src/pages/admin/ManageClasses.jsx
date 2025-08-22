import { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "./ManageClasses.css";
import {toast} from "react-hot-toast"
function ManageClasses(){
    const [allSubjects,setAllSubjects]=useState([]);
    const [className,setClassName]=useState("");
    const [classSubjects,setClassSubjects]=useState([]);
    const [showPopUp,setShowPopUp]=useState(false);
    const [allClasses,setAllClasses]=useState([]);
    const [isEditMode,setIsEditMode]=useState(false);
    const colors=["rgba(0, 157, 255, 0.774)","rgba(0, 255, 76, 0.774)","rgba(255, 196, 0, 0.774)","rgba(255, 0, 217, 0.774)","rgba(255, 0, 93, 0.774)"];
    const [showEditDelete,setShowEditDelete]=useState(-1);
    const [editClassIndex,setEditClassIndex]=useState(-1);
    useEffect(()=>{
       
        async function getSubjects() {
           const res=await fetch(`http://localhost:4400/subject/${localStorage.getItem("userId")}`)
            const response=await res.json();
            setAllSubjects(response.data);
        }

        async function getClasses() {
            const res=await fetch(`http://localhost:4400/class/${localStorage.getItem("userId")}`);
            const response=await res.json();
            setAllClasses(response.data);
        }

        getClasses();
        getSubjects();
    },[])

    async function handleSubmit() {
        const res=await fetch("http://localhost:4400/class/add",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                className:className,
                classSubjects:classSubjects,
                userId:localStorage.getItem("userId")
            })
        })
        const response=await res.json();
        if(response.success){
            toast.success("Class Added Successfully");
            const temp=[...allClasses];
            temp.push({className:className,subjects:classSubjects});
            setAllClasses(temp);
        }
        else{
            toast.error(response.message);
        }
        setClassName("");
        setClassSubjects([])
        setShowPopUp(false);
    }

    async function handleDelete(index) {
        const res=await fetch(`http://localhost:4400/class/delete`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                userId:localStorage.getItem("userId"),
                index:index
            })
        })
        const response=await res.json();
        if(response.success==true){
            toast.success("Class Deleted Successfully");
            const temp=allClasses.filter((el,ix)=>{
                return ix!=index
            })
            setAllClasses(temp);

        }
        else{
            toast.error(response.message)
        }
    }

    async function handleEdit() {
        const res=await fetch("http://localhost:4400/class/edit",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                userId:localStorage.getItem("userId"),
                index:editClassIndex,
                updatedClassName:className,
                updatedClassSubjects:classSubjects
            })
        })
        const response=await res.json();
        if(response.success){
            toast.success("Class Updated Successfully");
            const temp=[...allClasses];
            temp[editClassIndex]={className:className,subjects:classSubjects};
            setAllClasses(temp);
        }
        else{
            toast.error(response.message);
        }
        setShowPopUp(false);
    }

    return <>
    <AdminHeader/>
    <section id="manage-classes">
        {showPopUp?<div id="add-class-pop-up" onClick={()=>{
            setShowPopUp(false);
        }}>
            <div onClick={(e)=>e.stopPropagation()}>
                <h1>{isEditMode?"Edit Class":"Add Class"}</h1>
                <input type="text" placeholder="Enter Class Name" value={className} onChange={(e)=>{
                    setClassName(e.target.value)
                }}/>
                <div id="pop-up-class-subjects">
                {allSubjects.map((el)=>{
                    return <label key={el}>
                    <input type="checkbox" checked={
                        classSubjects.includes(el)
                    } onChange={()=>{
                        if(classSubjects.includes(el)){
                            //Remove el (Subject)
                            const temp=classSubjects.filter((el2)=>el!=el2);
                            setClassSubjects(temp);
                        }
                        else{
                            //Add el (Subject)
                            const temp=[...classSubjects];
                            temp.push(el);
                            setClassSubjects(temp);
                        }
                    }}/>
                    <span>{el}</span>
                </label>
                })}
                
                </div>
                <button id="btn-class" onClick={()=>{
                    if(isEditMode){
                        handleEdit();
                    }
                    else{
                    handleSubmit();}
                }}>{isEditMode?"Update":"Add"}</button>
            </div>
        </div>:""}
        <div id="main-classes" style={{maxHeight:"80vh",overflow:"auto"}}>
            <div id="classes-header">
                <h1>Manage Classes</h1>
                <button onClick={()=>{
                    setClassName("");
                    setClassSubjects([]);
                    setIsEditMode(false);
                    setShowPopUp(true)
                }}>Add Class+</button>
            </div>
            <div id="classes-card">
                
                {allClasses.map((el,ix)=>{
                    return <div key={ix} style={{backgroundColor:colors[ix%colors.length],position:"relative"}} onClick={()=>{
                        setShowEditDelete(showEditDelete==ix?-1:ix)
                    }}>
                        {showEditDelete==ix?<div id="edit-delete-class">
                            <FaRegEdit id="edit-class-icon" onClick={()=>{
                                setEditClassIndex(ix);
                                setClassName(el.className);
                                setClassSubjects(el.subjects)
                                setIsEditMode(true);
                                setShowPopUp(true);
                            }}></FaRegEdit>
                            <MdDelete id="delete-class-icon" onClick={()=>{
                                handleDelete(ix);
                            }}></MdDelete>
                        </div>:""}
                    <div id="class-name">
                        <h1>{el.className}</h1>
                    </div>
                    <ul id="class-subjects">
                        {el.subjects.map((el2,ix2)=>{
                            return <li key={ix+""+ix2}>{el2}</li>
                        })}
                    </ul>
                </div>
                })}
            </div>
        </div>
    </section>
    </>
}

export default ManageClasses;




