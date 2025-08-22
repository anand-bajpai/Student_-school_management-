import Header from "../components/Header";
import "./Home.css"
import { MdDashboard } from "react-icons/md";
import { FaClock } from "react-icons/fa";
import { IoMdBookmarks } from "react-icons/io";
function Home(){
    return <>
    <Header/>
    <section id="section1">
        <div>
            <div>
            <h1>Welcome To School Management System</h1>
            <p>Manage Your school teachers,students,subjects and classes at one place</p>
            </div>
        <div>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRK9leUrQMMGsdATOC82VIQMB5tGeWodSGiQ&s" alt="Image of School Management System" />
        </div>
        </div>
    </section>
    <section id="section2">
        <div>
            <h1>Why Choose Us?</h1>
            <div>
                <div>
                    <MdDashboard style={{fontSize:"40px"}}/>
                    <h1>Manage Your Whole School</h1>
                </div>
                <div>
                    <FaClock style={{fontSize:"40px"}}/>
                    <h1>Mark attendence</h1>
                </div>
                <div>
                    <IoMdBookmarks style={{fontSize:"40px"}}/>
                    <h1>Upload marks of students</h1>
                </div>
            </div>
        </div>
    </section>
    </>
}

export default Home;