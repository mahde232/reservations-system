import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import axios from 'axios'

const usersAPIURL = `https://617fa530055276001774fb89.mockapi.io/users`;

export default function UpdateUser() {
    const [loggedInUser] = useState(JSON.parse(localStorage.getItem("userLoggedIn")));
    const [listOfUsers, setList] = useState(null)
    const [selectedUser, setSelected] = useState(null)
    const [newUserObj, setNewUserObj] = useState({
        id: '',
        username: '',
        password: ''
    })
    const history = useHistory();

    useEffect(() => {
        const getAllUsersFromDB = async () => {
            const response = await axios.get(usersAPIURL)
            if (response.status === 200) {
                setList(response.data)
            }
            else {
                console.log('Error, ', response);
            }
        }
        getAllUsersFromDB();
    }, [])

    useEffect(() => {
        if (selectedUser) {
            const getSpecificUserFromDB = async () => {
                const response = await axios.get(`${usersAPIURL}/${selectedUser}`)
                if (response.status === 200) {
                    setNewUserObj({
                        id: response.data.id,
                        username: response.data.username,
                        password: response.data.password
                    })
                }
                else {
                    console.log('Error, ', response);
                }
            }
            getSpecificUserFromDB();
        }
    }, [selectedUser])

    const handleSelect = (e) => {
        setSelected(e.target.value);
    }

    const handleOnChange = (e) => { //inputs handler
        e.target.style.border = "";
        setNewUserObj((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
    };

    const updateUser = async (e) => {
        e.preventDefault(); //prevent default form submitting
        let isGoodToGo = true;

        Object.entries(newUserObj).forEach((item, index) => {
            //go over all the keys in the state object, check if any of them is empty
            if (item[1].length === 0) {
                e.target[index].style.border = "1px solid red";
                isGoodToGo = false; //if empty, set isGoodToGo to false, to prevent the api call from having empty values
            }
        });
        if (isGoodToGo) {
            //if all values are set, everything is good to go.
            const response = await axios.put(`${usersAPIURL}/${selectedUser}`, newUserObj);
            if (response.status === 200) {
                alert(`Updated user with id=${selectedUser} successfully`)
                history.push("/AdminPanel/");
            }
            else {
                console.log("Error, ", response);
                alert('Error check console')
            }
        }
    }

    if (!loggedInUser || loggedInUser.authority !== 1337) {
        history.push("/");
    }
    return (
        listOfUsers ?
            (<div id='updateUserContainer' className="floater">
                <div>
                    Select user to delete: <select id='users-select' onChange={handleSelect}>
                        <option key={-1} value={-1} selected disabled>Select a user</option>
                        {listOfUsers.map(user => {
                            return <option key={user.id} value={user.id}>{user.username}</option>
                        })}
                    </select>
                    {selectedUser ?
                        <div id='updateDiv'>
                            <form id='updateForm' onSubmit={updateUser}>
                                <div>User ID: <input type='text' value={newUserObj.id} disabled /></div>
                                <div>Username: <input type='text' autoComplete='new-password' name='username' value={newUserObj.username} onChange={handleOnChange} /></div>
                                <div>Password: <input autoComplete='new-password' type='password' name='password' value={newUserObj.password} onChange={handleOnChange} /></div>
                                <input type='submit' value='Update' />
                            </form>
                        </div>
                        : ''}
                </div>
            </div>) : <div class="loader">Loading...</div>

    )
}
