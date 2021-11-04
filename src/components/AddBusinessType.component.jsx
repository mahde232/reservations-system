import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import './AddBusinessType.style.css';

const typesAPIURL = 'https://617fa530055276001774fb89.mockapi.io/businessTypes';

export default function AddBusinessType() {
    const history = useHistory();
    const [loggedInUser] = useState(JSON.parse(localStorage.getItem("userLoggedIn")));
    const [typeObj, setObj] = useState({
        typeName: ''
    });

    const handleOnChange = (e) => { //inputs handler
        e.target.style.border = "";
        setObj((prevState) => ({ ...prevState, [e.target.name]: e.target.value}));
    };

    const onFormSubmit = async (e)=>{
        e.preventDefault();
        let isGoodToGo = true;

        Object.entries(typeObj).forEach((item,index) => { //go over all the keys in the state object, check if any of them is empty
            if(item[1].length === 0){
                e.target[index].style.border = '2px solid red'
                isGoodToGo = false; //if empty, set isGoodToGo to false, to prevent the api call from having empty values
            }
        })
        if(isGoodToGo) {
            const response = await axios.post(`${typesAPIURL}`, typeObj)
            if(response.status === 201){
                alert('Added new business type')
                history.push("/AdminPanel")
            }
            else {
                console.log('Error occured, ',response);
                alert('Error check console')
            }
        }
    }
    if (!loggedInUser || loggedInUser.authority !== 1337) { //handle non-admin attempts
        history.push("/");
    }
    return (
        <div id='addBusinessTypeContainer' className="floater">
            <form id='addBusinessTypeForm' onSubmit={onFormSubmit}>
                <div>Business Type Name:</div>
                <div><input type='text' name='typeName' onChange={handleOnChange} /></div>
                <div><input type='submit' value='Create'/></div>
            </form>
        </div>
    )
}
