import { useState } from "react";
import AdminHeader from "../../components/AdminHeader";
import {toast} from "react-hot-toast"
import "./ManageSubjects.css"
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useEffect } from "react";
function ManageSubjects(){
    const [showpopup,setShowPopUp]=useState(false);
    const [subjectName,setSujbectName]=useState("");
    const [allSubjects,setAllSubjects]=useState([]);
    const [selected,setSelected]=useState(-1);
    const [isEditMode,setIsEditMode]=useState(false);
    const [editSubjectIndex,setEditSubjectIndex]=useState(-1);
    useEffect(()=>{
        async function getSubjects() {
            const res=await fetch(`http://localhost:4400/subject/${localStorage.getItem("userId")}`)
            const response=await res.json();
            // console.log(response);
            setAllSubjects(response.data);
        }
        getSubjects();
    },[])

    //Function to add subject
    async function handleSubmit() {
        if(subjectName!=""){
        const res=await fetch("http://localhost:4400/subject/add",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({subjectName:subjectName,userId:localStorage.getItem("userId")})
        })
        const response=await res.json();
        if(response.success){
            toast.success("Subject Added Successfully");
            const temp=[...allSubjects];
            temp.push(subjectName);
            setAllSubjects(temp);
        }
        else{
            console.log(response);
            toast.error(response.message);
        }
        setSujbectName("");
        setShowPopUp(false);
    }}

    //Delete Function to delete Subject
    async function handleDelete(subjectName) {
        const res=await fetch("http://localhost:4400/subject/delete",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({subjectName:subjectName,userId:localStorage.getItem("userId")})
        })
        const response=await res.json();
        if(response.success){
            toast.success("Subject Deleted Successfully");
            let temp=[...allSubjects];
            temp=temp.filter((el)=>el!=subjectName);
            setAllSubjects(temp);
        }
        else{
            toast.error(response.message);
        console.log(response);}
    }

    //Edit Function to edit Subject
    async function handleEdit() {
        const res=await fetch("http://localhost:4400/subject/edit",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                editIndex:editSubjectIndex,
                updatedName:subjectName,
                userId:localStorage.getItem("userId")
            })
        })
        const response=await res.json();
        if(response.success){
            toast.success("Subject Updated Successfully");
            setShowPopUp(false);
            const temp=[...allSubjects];
            temp[editSubjectIndex]=subjectName;
            setAllSubjects(temp);
        }
        else{
            toast.error(response.message);
        }
    }

    return <>
    <AdminHeader/>
    {showpopup?<div id="add-subject-pop-up" onClick={()=>{
        setShowPopUp(false)
    }}>
        <div id="add-subject-box" onClick={(e)=>{
            e.stopPropagation();
        }}>
            <h1 style={{color:"rgba(19, 43, 223, 0.9)",marginTop:"-40px"}}>{isEditMode?"Edit Subject":"Add New Subject"}</h1>
            <input type="text" placeholder="Enter Subject Name" value={subjectName} onChange={(e)=>{
                setSujbectName(e.target.value);
            }}></input>       
            <button onClick={()=>{
                if(isEditMode){
                    handleEdit();
                }
                else{
                handleSubmit();}
            }}>{isEditMode?"Save":"Add"}</button>
            </div>
    </div>:""}
    
    <div id="subjects-main">
        <div id="subejcts-top">
            <h1>Manage Subjects</h1>
            <button id="add-subject-btn" onClick={()=>{
                setSujbectName("");
                setIsEditMode(false);
                setShowPopUp(true)
            }}>Add Subject+</button>
            </div>
            <div id="subjects-container">
                {allSubjects.map((el,ix)=>{
                    return <div key={ix} onClick={()=>setSelected(selected==ix?-1:ix)} style={{height:selected!=ix?"100px":"auto"}}>
                        <div id="subject-card"><h1>{el}</h1></div>
                        {selected==ix?<div id="subject-actions">
                            <FaEdit id="edit-icon" onClick={()=>{
                                setEditSubjectIndex(ix);
                                setSujbectName(el);
                                setIsEditMode(true);
                                setShowPopUp(true);
                            }}/>
                            <MdDelete id="delete-icon" onClick={()=>{
                                handleDelete(el);
                            }}/>
                        </div>:""}
                    </div>
                })}
                
            </div>
        </div>
    </>
}

export default ManageSubjects;