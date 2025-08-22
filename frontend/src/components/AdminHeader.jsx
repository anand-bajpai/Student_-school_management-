import { Link } from "react-router-dom"
import "./AdminHeader.css";
function AdminHeader(){
    return <div id="admin-header">
        <div>
        <h1>Admin Panel</h1>
        <ul>
            <li><Link to="/admin">Dashboard</Link></li>
            <li><Link to="/admin/manage-students">Manage Students</Link></li>
            <li><Link to="/admin/manage-teachers">Manage Teachers</Link></li>
            <li><Link to="/admin/manage-subjects">Manage Subjects</Link></li>
            <li><Link to="/admin/manage-classes">Manage Classes</Link></li>
            <li onClick={()=>{
                localStorage.removeItem("userId");
                window.location.reload();
            }}>Logout</li>
        </ul>
        </div>
    </div>
}

export default AdminHeader;