import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import axios from 'axios'


const allUsersAPIURL = `https://617fa530055276001774fb89.mockapi.io/users/`;



export default function DeleteBusiness() {
    const [listOfBusinesses, setListOfBusinesses] = useState(null)
    const [listOfUsers, setListOfUsers] = useState(null)
    const [selectedUser, setSelectedUser] = useState(null)
    const [selectedBusiness, setSelectedBusiness] = useState(null)
    const [loggedInUser] = useState(JSON.parse(localStorage.getItem("userLoggedIn")));
    const history = useHistory();
    const businessesOfUserAPIURL = `https://617fa530055276001774fb89.mockapi.io/users/${selectedUser}/businesses`; //eslint-disable-line

    useEffect(() => {
        const getUsersFromDB = async () => {
            const response = await axios.get(allUsersAPIURL)
            if(response.status === 200){
                setListOfUsers(response.data);
            }
            else {
                console.log('Error, ',response);
            }
        }
        getUsersFromDB();
    }, [])

    useEffect(() => {
        const getBusinessesForUser = async () => {
            const response = await axios.get(businessesOfUserAPIURL)
            if(response.status === 200){
                setListOfBusinesses(response.data);
            }
            else {
                console.log('Error, ',response);
            }
        }
        if(selectedUser) getBusinessesForUser()
    }, [selectedUser]) //eslint-disable-line

    const handleUsersChange = (e) => {
        setSelectedUser(e.target.value)
    }
    const handleBusinessChange = (e) => {
        setSelectedBusiness(e.target.value)
    }
    const deleteBusiness = async (e) => {
        const deleteAPIURl = `https://617fa530055276001774fb89.mockapi.io/users/${selectedUser}/businesses/${selectedBusiness}`
        const response = await axios.delete(deleteAPIURl)
        if(response.status === 200) {
            alert(`Deleted business with id=${selectedBusiness} successfully`)
            history.push('/AdminPanel/')
        }
        else {
            console.log('Error, ',response);
        }
    }
    if (!loggedInUser || loggedInUser.authority !== 1337) {
        history.push("/");
    }
    return ( listOfUsers ? 
        <div id='deleteBusiness' className="floater">
            <div>Which user: <br/><select id='users-select' onChange={handleUsersChange}> 
                <option key={-1} value={-1} disabled selected>Select a user</option>
                {listOfUsers.map(user => {
                    return <option key={user.id} value={user.id}>{user.username}</option>
                })}
            </select>
            </div>
            { selectedUser ?
                (listOfBusinesses ? 
                (<>Which business: <select id='businesses-select' onChange={handleBusinessChange}>
                    <option key={-1} value={-1} disabled selected>Select a business</option>
                    {listOfBusinesses.map(business => {
                        return <option key={business.id} value={business.id}>{business.businessName}</option>
                    })}
                </select>
                {selectedBusiness ? <div><input type='button' value='Delete' onClick={deleteBusiness} /></div> : ''}
                </>) : <div class="loader">Loading...</div>)
                : ''

            }
        </div> : <div class="loader">Loading...</div>
    )
}
