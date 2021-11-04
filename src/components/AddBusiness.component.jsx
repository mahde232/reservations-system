import React, {useState,useEffect} from 'react';
import { useHistory, Link } from "react-router-dom";
import axios from 'axios';
import './AddBusiness.style.css';

const ownersAPIURL = 'https://617fa530055276001774fb89.mockapi.io/users/';
const typesAPIURL = 'https://617fa530055276001774fb89.mockapi.io/businessTypes';

export default function AddBusiness() {
    const history = useHistory();
    const [loggedInUser] = useState(JSON.parse(localStorage.getItem("userLoggedIn")));
    const [owners, setOwners] = useState(null);
    const [types, setTypes] = useState(null);
    const [businessObj, setObj] = useState({
        businessName: '',
        owner: '',
        morningHours: '',
        eveningHours: '',
        timeBetweenReservations: '',
        businessType: ''
    });
    useEffect(() => {
        const getOwnersFromDB = async () => {
            const response = await axios.get(ownersAPIURL)
            if(response.status === 200){
                setOwners(response.data);
            }
            else {
                console.log('Error, ',response);
            }
        }
        const getTypesFromDB = async () => {
            const response = await axios.get(typesAPIURL)
            if(response.status === 200){
                setTypes(response.data);
            }
            else {
                console.log('Error, ',response);
            }
        }
        getOwnersFromDB()
        getTypesFromDB()
    }, [])

    const handleOnChange = (e) => { //inputs handler
        e.target.style.border = "";
        if(e.target.name === 'timeBetweenReservations')
            e.target.value = e.target.value.replace(/[^\d]/gi, '')
        setObj((prevState) => ({ ...prevState, [e.target.name]: (e.target.name === 'timeBetweenReservations' ? parseInt(e.target.value) : e.target.value)}));
    };

    const onFormSubmit = async (e)=>{
        e.preventDefault();
        let isGoodToGo = true;

        Object.entries(businessObj).forEach((item,index) => { //go over all the keys in the state object, check if any of them is empty
            if(item[1].length === 0){
                e.target[index].style.border = '2px solid red'
                isGoodToGo = false; //if empty, set isGoodToGo to false, to prevent the api call from having empty values
            }
        })
        if(isGoodToGo) {
            const response = await axios.post(`${ownersAPIURL}${businessObj.owner}/businesses`, businessObj)
            if(response.status === 201){
                alert('Added new business')
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
    return ( owners && types ? 
        <div id='addBusinessContainer' className="floater">
            <form id='addBusinessForm' onSubmit={onFormSubmit}>
                <div>Business Name: <input type='text' name='businessName' onChange={handleOnChange} /></div>
                <div>Business Owner: 
                    <select name='owner' onChange={handleOnChange}>
                        <option value={-1} disabled selected>Choose an owner</option>
                        {owners.map(owner => {
                            return <option value={owner.id}>{owner.username}</option>
                        })}
                    </select>
                </div>
                <div>Don't see the owner? add him first <Link className='link' to="/AddUser">Add User</Link></div>
                <div>Business Type: 
                    <select name='businessType' onChange={handleOnChange}>
                        <option value={-1} disabled selected>Choose a type</option>
                        {types.map(type => {
                            return <option value={type.typeName}>{type.typeName}</option>
                        })}
                    </select>
                </div>
                <div>Don't see the correct type? add it <Link className='link' to="/AddBusinessType">Add Type</Link></div>
                <div>Morning Hours: <input type='text' name='morningHours' onChange={handleOnChange} /></div>
                <div>Evening Hours: <input type='text' name='eveningHours' onChange={handleOnChange} /></div>
                <div>Time Between Reservations: <input type='number' name='timeBetweenReservations' onChange={handleOnChange} min={1} max={120} />(mins)</div>
                <input type='submit' value='Create'/>
            </form>
        </div> : <div class="loader">Loading...</div>
    )
}
