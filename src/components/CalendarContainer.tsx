import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import style from "./CalendarContainer.module.css";
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_EVENTS_API_URL;
import EditForm from "./EditForm";
import AddEventForm from "./AddEventForm";
import { useDispatch } from "react-redux";
import { toggleCreateModal, toggleEditModal } from "../redux/eventActions";

function splitDateAndTime(dateString: string): { date: string; time: string } {
  console.log("Date String", dateString);
  if (!dateString) return { date: "", time: "" };
  const arr = dateString.split("T");
  return {
    date: arr[0],
    time: convertToHHMM(arr[1]),
  };
}

function convertToHHMM(timeString: string) {
  // Extract hours and minutes using a regular expression
  const match = timeString.match(/^(\d{2}):(\d{2})/);
  if (!match) {
    throw new Error("Invalid time format");
  }

  // Extract hours and minutes
  const hours = match[1];
  const minutes = match[2];

  // Format as HH:MM
  return `${hours}:${minutes}`;
}

const CalendarContainer: React.FC = () => {
  const [currentEditEvent, setCurrentEditEvent] = useState({});
  const [currentEvents, setCurrentEvents] = useState<any[]>([]);
  const [selectedDates, setSelectedDates] = useState<any>({});
  const dispatch = useDispatch();

  const formatEvents = (events: any) => {
    const formattedEvents = events.map((event: any) => {
      const start = splitDateAndTime(event.start);
      const end = splitDateAndTime(event.end);
      return {
        ...event,
        startTime: start.time,
        endTime: end.time,
      };
    });
    return formattedEvents;
  };

  const formatSingleEvent = (events: any, isNew: boolean) => {
    const formattedEvents = events.map((event: any) => {
      return {
        ...event,
        startTime: splitDateAndTime(isNew ? event.start.toISOString() : event.start).time,
        endTime: splitDateAndTime(isNew ? event.end.toISOString() : event.end).time,
      };
    });
    return formattedEvents;
  };

  const fetchEvents = async () => {
    const res: any = await axios.get("/getAllEvents");
    if (res.data && res.data.events) {
      console.log("Events fetched", res.data.events);
      setCurrentEvents(res.data.events);
    }
  };
  useEffect(() => {
    fetchEvents();
  }, []);

  function handleDateSelect(selectInfo: any) {
    dispatch(toggleCreateModal(true));
    console.log("Selected Dates", selectInfo);
    const formattedEvent = formatSingleEvent([selectInfo], true);
    console.log("Formatted Event", formattedEvent);
    setSelectedDates(formattedEvent[0]);
  }

  async function fetchSingleEvent(publicId: string) {
    if (publicId) {
      try {
        const res: any = await axios.get(`/searchEvent/${publicId}`);
        if (res.data && res.data.event) {
          console.log("Event fetched", res.data.event);
          return res.data.event;
        } else if (res.data && res.data.error) {
          console.log("Error fetching event details", res.data.error);
        } else {
          console.log("Error fetching event details");
        }
      } catch (error) {
        console.log("Error fetching event details", error);
      }
    }
  }

  async function handleEventClick(clickInfo: any) {
    console.log(clickInfo.event._def);
    dispatch(toggleEditModal(true));
    const event = await fetchSingleEvent(clickInfo.event._def.publicId);
    const formattedEvent = formatSingleEvent([event], false);
    console.log("Edit Event", formattedEvent);
    setCurrentEditEvent(formattedEvent[0]);
  }

  function handleEvents(events: any) {
    console.log("Events updated", events);
  }

  function renderEventContent(eventInfo: any) {
    console.log("Event Info", eventInfo);
    const event = eventInfo.event._def
    const publicId = event.publicId;
    const allDay = event.allDay;
    let formattedEvent: any = undefined
    let customMessage = eventInfo.timeText
    if(allDay) {
      customMessage = "All Day"
    } else {
      currentEvents.forEach((element) => {
        if (element.id === publicId) {
          // console.log("Element", element);
          formattedEvent = formatEvents([element])[0]
          console.log("Formatted Event", formattedEvent);
        }
      });
    }
    return (
      <>
        <i style={{ fontSize: "16px" }}>{eventInfo.event.title}</i>
        <br />
        {
          formattedEvent ? 
          <b style={{fontSize: '14px', color: '#cfc1c1'}}>{formattedEvent?.startTime} to {formattedEvent?.endTime}</b> :
          <b style={{fontSize: '14px', color: '#cfc1c1'}}>{customMessage}</b>
        }
      </>
    );
  }

  return (
    <div className={style.calendarWrapper}>
      <div className={style.mainContainer}>
        <FullCalendar
          validRange={
            {
              start: new Date(),
            }
          }
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            right: "prev,next today",
            center: "",
            // left: 'dayGridMonth,timeGridWeek,timeGridDay'
            left: "title",
          }}
          dayHeaderClassNames={style.dayHeader}
          dayCellClassNames={style.dayCell}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          events={currentEvents}
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
      <EditForm event={currentEditEvent} onEventAdd={fetchEvents} />
      <AddEventForm event={selectedDates} onEventAdd={fetchEvents} />
    </div>
  );
};

export default CalendarContainer;
