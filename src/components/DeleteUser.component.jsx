import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import axios from 'axios'

const usersAPIURL = `https://617fa530055276001774fb89.mockapi.io/users`;

export default function DeleteUser() {
    const [loggedInUser] = useState(JSON.parse(localStorage.getItem("userLoggedIn")));
    const [listOfUsers, setList] = useState(null)
    const [selectedUser, setSelected] = useState(null)
    const history = useHistory()

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

    const handleSelect = (e) => {
        setSelected(e.target.value);
    }

    const deleteUser = async () => {
        const response = await axios.delete(`${usersAPIURL}/${selectedUser}`)
        if (response.status === 200) {
            alert(`User with id=${selectedUser} deleted`)
            history.push("/AdminPanel/");
        }
        else {
            console.log('Error, ', response);
        }
    }

    if (!loggedInUser || loggedInUser.authority !== 1337) {
        history.push("/");
    }
    return (
        listOfUsers ?
            (<div id='deleteUserContainer' className="floater">
                <div style={{ display: "flex", flexDirection: "column" }}>
                    Select user to delete: <select defaultValue={-1} id='users-select' onChange={handleSelect}>
                        <option key={-1} value={-1} disabled>Select a user</option>
                        {listOfUsers.map(user => {
                            return <option key={user.id} value={user.id}>{user.username}</option>
                        })}
                    </select>
                    {selectedUser ? <input type='button' value='Delete' onClick={deleteUser} /> : ''}
                </div>
            </div>) : <div className="loader">Loading...</div>
    )
}
