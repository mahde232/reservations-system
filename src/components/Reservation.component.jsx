import React from 'react'
import './Reservation.style.css'

export default function Reservation({reservationData, informFatherOfCompletion}) {
    return (
        // <div className='reservation'>
        <div className='floater reservation'>
            <div>שם הלקוח: {reservationData.name}</div>
            <div>מספר פלאפון: {reservationData.phone}</div>
            <div>תור לשעה: {reservationData.time}</div>
        </div>
    )
}
