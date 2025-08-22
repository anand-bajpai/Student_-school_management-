import "./Header.css";
import {Link} from "react-router-dom";
function Header(){
    return <>
    <header id="header1">
        <nav>
            <h1>SchoolManagemt</h1>
            <ul>
                <li><Link to="/" style={{textDecoration:"none",color:"black"}}>Home</Link></li>
                <li><Link to="/login" style={{textDecoration:"none",color:"black"}}>Login</Link></li>
                <li><Link to="/register" style={{textDecoration:"none",color:"black"}}>Register</Link></li>
                <li><Link to="/about" style={{textDecoration:"none",color:"black"}}>About</Link></li>
                <li><Link to="/contact" style={{textDecoration:"none",color:"black"}}>Contact</Link></li>
            </ul>
        </nav>
    </header>
    </>
}

export default Header;