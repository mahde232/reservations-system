import React, { useEffect, useState } from 'react'
import { Link, useHistory } from "react-router-dom";
import axios from 'axios'
import './MyBusinesses.style.css'

export default function MyBusinesses() {
    const history = useHistory();
    const [listOfBusinesses, setList] = useState([])
    const [loggedInUser] = useState(JSON.parse(localStorage.getItem("userLoggedIn")));

    const myBusinessesAPIURL = loggedInUser ? `https://617fa530055276001774fb89.mockapi.io/users/${loggedInUser.id}/businesses` : '';

    useEffect(() => {
        const getMyBusinessesFromDB = async () => {
            const response = await axios.get(myBusinessesAPIURL)
            if(response.status === 200){
                setList(response.data);
            }
            else {
                console.log('Error, ',response);
            }
        }
        getMyBusinessesFromDB();
    }, []) //eslint-disable-line
    if( !loggedInUser)
        history.push('/')
    return (
        <div id="myBusinessContainer">
            <h2>רשימת העסקים שלי</h2>
            <div id='listOfBusinesses'>
            { listOfBusinesses.length !== 0 ? 
                <>{listOfBusinesses.map(item => {
                    return (<><Link key={item.id} to={{pathname: `/BusinessPage/?user=${item.owner}&business=${item.id}`}} className='linktag'><div key={item.id} className='businessDiv'>
                        <h3>{item.businessName}</h3>
                        <h6>שעות פתיחה</h6>
                        <h4>{item.morningHours} / {item.eveningHours}</h4>
                        <h5>{item.businessType}</h5>
                    </div></Link></>)
                })
                }</> :
                <div class="loader">Loading...</div>
            }
            </div>
        </div>
    )
}
