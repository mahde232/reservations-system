//React node modules
import React from "react";
import { Link } from "react-router-dom";
//css and images
import "./Navbar.style.css";
import logo from "../img/logo3.png"
const Navbar = ({logoutCallback, loggedInUser}) => {

  const handleLogout = () => {
    logoutCallback();
  }
// {process.env.PUBLIC_URL + '/icon.jpg'}
  return (
    <div className="navbar">
      <Link to="/">
        <img id='navbarlogo' src={logo} alt="meaw"></img>
      </Link>
      <div className="nav">
        {loggedInUser ? ( //if logged in, show these
          loggedInUser.authority === 1337 ? ( //logged in and admin
          <>
            <div style={{ color: "black", marginRight:'10px',fontWeight:"600"}}>Hello "{loggedInUser.username}"</div>
            <Link className="link" to="/">
            <div className="linkDiv">דף ראשי</div>
            </Link>
            <Link className="link" to="/AdminPanel">
            <div className="linkDiv">Admin Panel</div>
            </Link>
            <div className="linkDiv" onClick={handleLogout}>Logout</div>
          </>
          ) : ( //logged in but not admin
            <>
            <div  style={{ color: "black", marginRight:'10px',fontWeight:"600"}}>"{loggedInUser.username}" שלום</div>
            <Link className="link" to="/">
            <div className="linkDiv">דף ראשי</div>
            </Link>
            <Link className="link" to="/MyBusinesses">
            <div className="linkDiv">העסקים שלי</div>
            </Link>
            <div className="linkDiv" onClick={handleLogout}>יציאה</div>
          </>
          )
        ) : ( //not logged in
          <>
            <Link className="link" to="/">
            <div className="linkDiv">דף ראשי</div>
            </Link>
            <Link className="link" to="/login">
            <div className="linkDiv">כניסה</div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
export default Navbar;
