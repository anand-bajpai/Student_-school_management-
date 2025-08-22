import Home from "./pages/Home"
import Register from "./pages/Register";
import Login from "./pages/Login";
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import AdminProtectedRoutes from "./ProtectedRoutes/AdminProtectedRoutes";
import ManageSubjects from "./pages/admin/ManageSubjects";
import ManageClasses from "./pages/admin/ManageClasses";
import ManageTeachers from "./pages/admin/ManageTeachers";
import ManageStudents from "./pages/admin/ManageStudents";
import MarkAttendence from "./pages/teacher/MarkAttendence";
import Attendence from "./pages/student/Attendence";
function App(){
  return <>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/admin" element={
        <AdminProtectedRoutes>
          <Dashboard/>
        </AdminProtectedRoutes>}/>
      <Route path="/admin/manage-subjects" element={
        <AdminProtectedRoutes>
          <ManageSubjects/>
        </AdminProtectedRoutes>
      }/>
      <Route path="/admin/manage-classes" element={
        <AdminProtectedRoutes>
          <ManageClasses/>
        </AdminProtectedRoutes>
      }/>
      <Route path="/admin/manage-teachers" element={
        <AdminProtectedRoutes>
          <ManageTeachers/>
        </AdminProtectedRoutes>
      }/>
      <Route path="/admin/manage-students" element={
        <AdminProtectedRoutes>
          <ManageStudents/>
        </AdminProtectedRoutes>
      }/>
      <Route path="/teacher/mark-attendence" element={
        <MarkAttendence/>
      }/>
      <Route path="/student/attendence" element={<Attendence/>}/>
    </Routes>
  </BrowserRouter>
  </>
}

export default App;