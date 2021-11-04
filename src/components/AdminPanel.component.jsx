import React , {useState} from 'react'
import { Link, useHistory } from "react-router-dom";
import './AdminPanel.style.css'

export default function AdminPanel() {
    const history = useHistory();
    const [loggedInUser] = useState(JSON.parse(localStorage.getItem("userLoggedIn")));
    if (!loggedInUser || loggedInUser.authority !== 1337) {
        history.push("/");
    }
    return (
        <div id='adminPanelContainer' className="floater">
            <div> Add Operations
                <div id='addOptions'>
                    <Link className="link" to="/AddBusiness"><div className='adminOption'>Add Business</div></Link>
                    <Link className="link" to="/AddBusinessType"><div className='adminOption'>Add Type</div></Link>
                    <Link className="link" to="/AddUser"><div className='adminOption'>Add User</div></Link>
                </div>
            </div>
            <div> Delete Operations
                <div id='deleteOptions'>
                    <Link className="link" to="/DeleteBusiness"><div className='adminOption'>Delete Business</div></Link>
                    <Link className="link" to="/DeleteBusinessType"><div className='adminOption'>Delete Type</div></Link>
                    <Link className="link" to="/DeleteUser"><div className='adminOption'>Delete User</div></Link>
                </div>
            </div>
            <div> Update Operations
                <div id='updateOptions'>
                    <Link className="link" to="/UpdateBusiness"><div className='adminOption'>Update Business</div></Link>
                    <Link className="link" to="/UpdateBusinessType"><div className='adminOption'>Update Type</div></Link>
                    <Link className="link" to="/UpdateUser"><div className='adminOption'>Update User</div></Link>
                </div>
            </div>
        </div>
    )
}
