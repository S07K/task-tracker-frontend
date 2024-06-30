import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import style from './CalendarContainer.module.css'
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_API_URL


let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: todayStr
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: todayStr + 'T16:50:00',
    end: todayStr + 'T17:00:00'
  }
]

export function createEventId() {
  return String(eventGuid++)
}

const CalendarContainer: React.FC = () => {

  const [currentEvents, setCurrentEvents] = useState<any[]>([])

  const fetchEvents = async () => {
    const res: any = await axios.get('/getAllEvents')
    if(res.data && res.data.events){
      setCurrentEvents(res.data.events)
    }
  }
  useEffect(() => {
    fetchEvents()
  }, [])

  function handleDateSelect(selectInfo: any) {
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar
  
    calendarApi.unselect() // clear date selection
  
    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
    }
  }

  function handleEventClick(clickInfo: any) {
    console.log(clickInfo.event._def)
  }

  function handleEvents(events: any) {
    console.log('Events updated', events)
  }

  return (
    <div className={style.calendarWrapper}>
      <div className={style.mainContainer}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          dayHeaderClassNames={style.dayHeader}
          dayCellClassNames={style.dayCell}
          initialView='dayGridMonth'
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          events={currentEvents}
          initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
          select={handleDateSelect}
          eventContent={renderEventContent} // custom render function
          eventClick={handleEventClick}
          eventsSet={handleEvents} // called after events are initialized/added/changed/removed
          // you can update a remote database when these fire:
          // eventAdd={function(){}}
          // eventChange={function(){
          //   console.log("eventChange")
          // }}
          // eventRemove={function(){}}
        />
      </div>
    </div>
  )
}

function renderEventContent(eventInfo: any) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <br />
      <i>{eventInfo.event.title}</i>
    </>
  )
}

export default CalendarContainer;