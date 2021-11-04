import React,{useEffect, useState} from 'react'
import {useHistory,useLocation} from 'react-router-dom';
import Reservation from './Reservation.component';
import axios from 'axios'
import './BusinessPage.style.css'

const usersAPIURL = 'https://617fa530055276001774fb89.mockapi.io/users/';

export default function BusinessPage() {
    const history = useHistory();
    const location = useLocation();
    const [loggedInUser] = useState(JSON.parse(localStorage.getItem("userLoggedIn")));
    const [business, setBusiness] = useState(null);
    const [reservation, setReservation] = useState({
        phone: '',
        name: '',
        time: ''
    })

    useEffect(() => {
        const getBusinessData = async () => {
            console.log('location ',location);
            const paramsArray = location.search.substring(1).split('&');
            const URLuserID = paramsArray[0].split('=')[1];
            const URLbusinessID = paramsArray[1].split('=')[1];
            console.log('URLuserID ',URLuserID);
            console.log('URLbusinessID ',URLbusinessID);
            const response = await axios.get(`https://617fa530055276001774fb89.mockapi.io/users/${URLuserID}/businesses/${URLbusinessID}`)
            if(response.status === 200) {
                setBusiness(response.data)
            }
            else {
                console.log('Error, ',response);
            }
        }
        getBusinessData();
    }, []) //eslint-disable-line

    const handleOnChange = (e) => { //inputs handler
        e.target.style.border = "";
        setReservation((prevState) => ({ ...prevState, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let isGoodToGo = true;

        Object.entries(reservation).forEach((item,index) => { //go over all the keys in the state object, check if any of them is empty
            if(item[1].length === 0){
                e.target[index].style.border = '2px solid red'
                isGoodToGo = false; //if empty, set isGoodToGo to false, to prevent the api call from having empty values
            }
        })
        if(isGoodToGo) {
            const tempReservations = [...business.reservations,reservation];
            tempReservations.sort((a,b)=> a.time.localeCompare(b.time));
            business.reservations = tempReservations;
            const response = await axios.put(`${usersAPIURL}${business.owner}/businesses/${business.id}`, business)
            if(response.status === 200){
                alert('תור נוצר בהצלחה')
                history.push("/")
            }
            else {
                console.log('Error occured, ',response);
                alert('Error check console')
            }
        }
    }

    const calculatePossibleReservations = () => {
        let arrayOfPossible = [];
        let hourNow = new Date(Date.now()).getHours(); //get current hour
        let minutesNow = new Date(Date.now()).getMinutes(); //get current minute

        for(let i = 0; i < business.morningHours.split('-')[1].split(':')[0]*60 - (business.morningHours.split('-')[0].split(':')[0])*60; i = i + business.timeBetweenReservations){
            arrayOfPossible.push(`${parseInt(business.morningHours.split('-')[0].split(':')[0])+Math.floor(i/60)}:${(i%60)>=10 ? (i%60) : ('0'+(i%60))}`)
        }
        for(let i = 0; i < business.eveningHours.split('-')[1].split(':')[0]*60 - (business.eveningHours.split('-')[0].split(':')[0])*60; i = i + business.timeBetweenReservations){
            arrayOfPossible.push(`${parseInt(business.eveningHours.split('-')[0].split(':')[0])+Math.floor(i/60)}:${(i%60)>=10 ? (i%60) : ('0'+(i%60))}`)
        }
        let filteredByCurrentTime = arrayOfPossible.filter(item=> {
            if(parseInt(item.split(':')[0]) > hourNow) //hour of reservation is bigger than current hour
                return true;
            if(parseInt(item.split(':')[0]) === hourNow && parseInt(item.split(':')[1]) > minutesNow) //hour is equal, minutes is greater then true
                return true;
            return false; 
        })
        let takenTimes = business.reservations.map(item=>{ //get all taken reservations
            return item.time;
        })
        let filterByTaken = filteredByCurrentTime.filter(item=>{ //filter possible reservations using taken reservations
            if(takenTimes.includes(item))
                return false;
            return true;
        })
        return filterByTaken; //final filtered possible reservations
    }

    const copyLinkToClipboard = () => {
        navigator.clipboard.writeText(`https://reservations-system.herokuapp.com/BusinessPage?user=${business.owner}&business=${business.id}`)
        alert('קישור לחנות הועתק, תעביר ללקוחות')
    }

    if(loggedInUser && business && loggedInUser.id === business.owner) {
        return (
            <div id='ownerViewContainer'>
                {business ? 
                (<div className='ownerbusinessContainer floater'>
                    <div className='businessLogo'><img src={business.businessBannerURL} alt='logo'/></div>
                    <h2>{business.businessName} <i className="fas fa-link businesslink" onClick={copyLinkToClipboard}></i></h2>
                    <h4>רשימת התורים להיום</h4>
                    <div className='reservationsList'>
                        {business.reservations.length > 0 ? business.reservations.map(item => {return <Reservation key={Math.random()*100000} reservationData={item}/>}): <div>רשימת התורים ריקה</div>}
                    </div>
                </div>): <div className="loader">Loading...</div>}
            </div>
        )
    }
    else{
        return (
            <div id='customerViewContainer'>
                {business ?
                (<div className='businessDiv'>
                    <div className='businessLogo'><img src={business.businessBannerURL} alt='logo'/></div>
                    <form id='createReservationForm' onSubmit={handleSubmit}>
                        <h2>{business.businessName}</h2>
                        <div>מספר פלאפון: <input type='text' name='phone' placeholder='05x-xxxxxxx' onChange={handleOnChange}/></div>
                        <div>שם לקוח: <input type='text' name='name' placeholder='פרטי ומשפחה' onChange={handleOnChange}/></div>
                        <div>איזה שעה: 
                            <select name='time' onChange={handleOnChange} defaultValue={-1}>
                                <option key={-1} value={-1} disabled>בחר שעת תור</option>
                                {calculatePossibleReservations().map(item => {
                                    return <option key={item} value={item}>{item}</option>
                                })}
                            </select>
                            <div>שעת פתיחה: {business.morningHours.split('-')[0]}, שעת סגירה: {business.eveningHours.split('-')[1]}</div>
                            <div>הפסקת צהריים: {business.morningHours.split('-')[1]} עד {business.eveningHours.split('-')[0]}</div>
                            <input type='submit' value='שריין תור'/>
                        </div>
                    </form>
                </div>) : <div className="loader">Loading...</div>
                }
            </div>
        )
    }
}