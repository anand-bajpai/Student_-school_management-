import "./Login.css";
import Header from "../components/Header"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {toast} from "react-hot-toast";
function Login(){
    const navigate=useNavigate();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    async function handleSubmit(){
        const res=await fetch("http://localhost:4400/auth/login",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({email,password})
        })
        const response=await res.json();
        console.log(response);
        if(response.success){
            toast.success("Login Successfully");
            localStorage.setItem("userId",response.data._id);
            if(response.data.role=="admin"){
            navigate("/admin");}
            else if(response.data.role=="teacher"){
                navigate("/teacher/mark-attendence");
            }
            else if(response.data.role=="student"){
                navigate("/student/attendence");
            }
        }
        else{
            toast.error(response.message);
        }
        setEmail("");
        setPassword("");
    }
    return <>
    <Header/>
    <div id="login">
        <form onSubmit={(e)=>{
            e.preventDefault();
            handleSubmit();
        }}>
            <h1>Login Page</h1>
            <input type="email" required  className="inp1" placeholder="Enter Email" value={email} onChange={(e)=>{
                setEmail(e.target.value);
            }}/>
            <input type="password"  required className="inp1" placeholder="Enter Password" value={password} onChange={(e)=>{
                setPassword(e.target.value);
            }}/>
            <p>New User? <span onClick={()=>{
                navigate("/register")
            }}>Register Here</span></p>
            <input type="submit" value="Login" className="btn1"/>
        </form>
    </div>
    </>
}

export default Login;