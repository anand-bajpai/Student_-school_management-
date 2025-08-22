import { Link } from "react-router-dom";
import Header from "../components/Header"
import "./Register.css";
import {useState} from "react";
import {useNavigate} from "react-router-dom"
function Register(){
    const [data,setData]=useState({
        name:"",
        email:"",
        password:"",
        file:null
    });
    const navigate=useNavigate();
    async function handleSubmit(){
        const formData=new FormData();
        formData.append("name",data.name);
        formData.append("email",data.email);
        formData.append("password",data.password);
        formData.append("logo",data.file);
        const res=await fetch("http://localhost:4400/school/add",{
            method:"POST",
            body:formData
        })
        const response=await res.json();
        console.log(response);
        if(response.success){
            alert("Registered Scuccessfully")
            navigate("/login");
        }
        else{
            alert(response.message);
        }
        setData({
            name:"",
            email:"",
            password:"",
            file:null
        })
    }
    return <>
    <Header/>
    <section id="register">
        <form onSubmit={(e)=>{
            e.preventDefault();
            handleSubmit();
        }}>
            <h1>Register Your School</h1>
            <input type="text" placeholder="Enter School Name" className="inp1" value={data.name} onChange={(e)=>{
                const temp={...data};
                temp.name=e.target.value;
                setData(temp);
            }}/>
            <input type="email" placeholder="Enter Admin Email" className="inp1" value={data.email} onChange={(e)=>{
                const temp={...data};
                temp.email=e.target.value;
                setData(temp);
            }}/>
            <input type="password"  placeholder="Enter Admin Password" className="inp1" value={data.password} onChange={(e)=>{
                const temp={...data};
                temp.password=e.target.value;
                setData(temp);
            }}/>
            <input type="file" style={{margin:"auto"}} onChange={(e)=>{
                const temp={...data};
                temp.file=e.target.files[0];
                setData(temp);
            }}/>
            <p style={{width:"70%"}}>Existing User? <Link to="/login" style={{color:"blue",cursor:"pointer"}} >Login Here..</Link></p>
            <input type="submit" value="Register" id="btn1"/>
        </form>
    </section>
    </>
}

export default Register;