import React from 'react'
import { Link } from "react-router-dom";
import './Homepage.style.css'

export default function HomePage() {
    return (
        <div id={"home-page"}>
            <h1>מערכת ניהול תורים</h1>
            <h2>קביעת תור בקליק</h2>
            <div>מערכת המאפשרת לכל בעל עסק לנהל תורים לעסק שלו בצורה נוחה ופשוטה מכל מחשב או ממכשיר סלולרי</div>
            <div><Link style={{display:'inline-block'}} className="link" to="/"><p className='psuedoLink'>05x-xxxxxx ליצירת קשר</p></Link> ,בואו להירשם ולהתרשם</div>
        </div>
    )
}
