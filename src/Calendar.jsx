 import Calendar from 'react-calendar' 
 import './Calendar.css'
import { useState } from 'react'

export default function MyCalendarApp(props){

    return (
    <div>
        <Calendar 
        value={props.date}
        onChange={props.setDate}
        onClickDay={props.setCalendar}
        />
        
    </div>
    )

}