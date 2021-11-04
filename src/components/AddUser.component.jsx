import React, {useState} from 'react';
import { useHistory} from "react-router-dom";
import axios from 'axios';
import './AddUser.style.css';

const usersAPIURL = 'https://617fa530055276001774fb89.mockapi.io/users/';

export default function AddUser() {
    const history = useHistory();
    const [loggedInUser] = useState(JSON.parse(localStorage.getItem("userLoggedIn")));
    const [userObj, setObj] = useState({
        username: '',
        password: '',
        authority: 1
    });

    const handleOnChange = (e) => { //inputs handler
        e.target.style.border = "";
        setObj((prevState) => ({ ...prevState, [e.target.name]: e.target.value}));
    };

    const onFormSubmit = async (e)=>{
        e.preventDefault();
        let isGoodToGo = true;

        Object.entries(userObj).forEach((item,index) => { //go over all the keys in the state object, check if any of them is empty
            if(item[1].length === 0){
                e.target[index].style.border = '2px solid red'
                isGoodToGo = false; //if empty, set isGoodToGo to false, to prevent the api call from having empty values
            }
        })
        if(isGoodToGo) {
            const response = await axios.post(`${usersAPIURL}`, userObj)
            if(response.status === 201){
                alert('Added new user')
                history.push("/AdminPanel")
            }
            else {
                console.log('Error occured, ',response);
                alert('Error check console')
            }
        }
    }
    
    if (!loggedInUser || loggedInUser.authority !== 1337) {
        history.push("/");
    }
    return (
        <div id='addUserContainer' className="floater">
            <form id='addUserForm' onSubmit={onFormSubmit}>
                <div>Username: <input type='text' autoComplete='new-password' name='username' onChange={handleOnChange} /></div>
                <div>Password: <input autoComplete='new-password' type='password' name='password' onChange={handleOnChange} /></div>
                <input type='submit' value='Create'/>
            </form>
        </div>
    )
}
