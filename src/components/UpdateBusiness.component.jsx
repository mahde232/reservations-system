import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router';
import axios from 'axios'

export default function UpdateBusiness() {
    const [loggedInUser] = useState(JSON.parse(localStorage.getItem("userLoggedIn")));
    const [listOfUsers, setListOfUsers] = useState(null)
    const [listOfBusinesses, setListOfBusinesses] = useState([])
    const [listOfTypes, setListOfTypes] = useState(null)
    const [selectedBusiness, setSelected] = useState(null)
    const [newBusinessObj, setNewBusinessObj] = useState({
        id: '',
        businessName: '',
        owner: '',
        businessType: '',
        morningHours: '',
        eveningHours: '',
        timeBetweenReservations: ''
    })
    const history = useHistory();
    const usersAPIURL = `https://617fa530055276001774fb89.mockapi.io/users`;
    const typesAPIURL = `https://617fa530055276001774fb89.mockapi.io/businessTypes`;

    useEffect(() => {
        const getAllUsersFromDB = async () => {
            const response = await axios.get(usersAPIURL)
            if (response.status === 200) {
                setListOfUsers(response.data)
            }
            else {
                console.log('Error, ', response);
            }
        }
        const getAllTypesFromDB = async () => {
            const response = await axios.get(typesAPIURL)
            if (response.status === 200) {
                setListOfTypes(response.data)
            }
            else {
                console.log('Error, ', response);
            }
        }
        getAllUsersFromDB();
        getAllTypesFromDB();
    }, []) //eslint-disable-line

    useEffect(() => {
        const getAllBusinessesFromDB = () => {
            if (listOfUsers) {
                listOfUsers.forEach(async (user) => {
                    const response = await axios.get(`${usersAPIURL}/${user.id}/businesses`)
                    if (response.status === 200) {
                        setListOfBusinesses((prevState) => [...prevState, ...response.data])
                    }
                    else {
                        console.log('Error, ', response);
                    }
                })
            }
        }
        getAllBusinessesFromDB();
    }, [listOfUsers]) //eslint-disable-line

    const getOwnerNameByID = (idOfOwner) => {
        return listOfUsers.find(user => user.id === idOfOwner).username
    }

    const shallowObjectCopy = (obj1) => {
        return {
            id: obj1.id,
            businessName: obj1.businessName,
            owner: obj1.owner,
            businessType: obj1.businessType,
            morningHours: obj1.morningHours,
            eveningHours: obj1.eveningHours,
            timeBetweenReservations: obj1.timeBetweenReservations
        }
    }

    const handleSelect = (e) => {
        setSelected(e.target.value);
        // setNewBusinessObj(listOfBusinesses.find(business => business.id === e.target.value))
        setNewBusinessObj(shallowObjectCopy(listOfBusinesses.find(business => business.id === e.target.value)))
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        let isGoodToGo = true;

        Object.entries(newBusinessObj).forEach((item, index) => {
            //go over all the keys in the state object, check if any of them is empty
            if (item[1].length === 0) {
                e.target[index].style.border = "1px solid red";
                isGoodToGo = false; //if empty, set isGoodToGo to false, to prevent the api call from having empty values
            }
        });
        if (isGoodToGo) {
            //if all values are set, everything is good to go.
            const response = await axios.put(`${usersAPIURL}/${newBusinessObj.owner}/businesses/${selectedBusiness}`, newBusinessObj);
            if (response.status === 200) {
                alert(`Updated business with id=${selectedBusiness} successfully`)
                history.push("/AdminPanel/");
            }
            else {
                console.log("Error, ", response);
                alert('Error check console')
            }
        }
    }

    const handleOnChange = (e) => { //inputs handler
        e.target.style.border = "";
        setNewBusinessObj((prevState) => ({ ...prevState, [e.target.name]: (e.target.name === 'timeBetweenReservations' ? parseInt(e.target.value) : e.target.value) }));
    };

    if (!loggedInUser || loggedInUser.authority !== 1337) {
        history.push("/");
    }
    return (
        listOfBusinesses.length !== 0 ?
            (<div id='updateBusinessContainer' className="floater">
                <div>
                    Select business to update: <select id='business-select' defaultValue={-1} onChange={handleSelect}>
                        <option key={-1} value={-1} disabled>Select a business</option>
                        {listOfBusinesses.map(business => {
                            return <option key={business.id} value={business.id}>{business.businessName}-{getOwnerNameByID(business.owner)}</option>
                        })}
                    </select>
                    {selectedBusiness ?
                        <form id='editBusinessForm' onSubmit={handleUpdate}>
                            <div>Business ID: <input type='text' value={newBusinessObj.id} disabled /></div>
                            <div>Business Name: <input type='text' name='businessName' value={newBusinessObj.businessName} onChange={handleOnChange} /></div>
                            <div>Business Owner:
                                <select name='owner' onChange={handleOnChange} defaultValue={newBusinessObj.owner}>
                                    {listOfUsers.map(user => {
                                        return <option key={user.id} value={user.id}>{user.username}</option>
                                    })}
                                </select>
                            </div>
                            <div>Business Type:
                                <select name='businessType' onChange={handleOnChange} defaultValue={newBusinessObj.businessType}>
                                    {listOfTypes.map(type => {
                                        return <option key={type.id} value={type.typeName}>{type.typeName}</option>
                                    })}
                                </select>
                            </div>
                            <div>Morning Hours: <input type='text' name='morningHours' value={newBusinessObj.morningHours} onChange={handleOnChange} /></div>
                            <div>Evening Hours: <input type='text' name='eveningHours' value={newBusinessObj.eveningHours} onChange={handleOnChange} /></div>
                            <div>Time Between Reservations: <input type='number' name='timeBetweenReservations' value={newBusinessObj.timeBetweenReservations} onChange={handleOnChange} min={1} max={120} />(mins)</div>
                            <input type='submit' value='Update' />
                        </form> : ''
                    }
                </div>
            </div>) : <div className="loader">Loading...</div>
    )
}
