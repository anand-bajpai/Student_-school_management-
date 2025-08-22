import { Navigate } from "react-router-dom";
function AdminProtectedRoutes({children}){
    const userId=localStorage.getItem("userId");
    if(userId){
        async function getData(){
            const res=await fetch(`http://localhost:4400/auth/me/${userId}`);
            const response=await res.json();
            console.log(response);
            if(response.success){
                return true;
            }
        }
        const isAdmin=getData();
        if(isAdmin){
            return children;
        }
    }
    return <Navigate to="/login"/>
}

export default AdminProtectedRoutes;