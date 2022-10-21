import React, { useCallback, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
// The import order DOES MATTER here. If you change it, you'll get an error!
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useSession } from "next-auth/react";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import EventModalComponent from "../EventModal/EventModalComponent";
import { useDispatch } from "react-redux";
import {
  addEventDescription,
  changeEventModalState,
} from "../../slices/eventModalSlice";

const CalendarComponent = () => {
  const { data: session } = useSession();
  const [initialEvents, setInitialEvents] = useState([]);
  const dispatch = useDispatch();
  const getAllEvents = async (start, end) => {
    if (start == undefined && end == undefined) return;
    console.log(start);
    console.log(end);
    const refresh_token = session?.user.refreshToken;
    const calendarId = session.user.email;
    const response = await fetch("/api/getEvents", {
      method: "POST",
      body: JSON.stringify({
        refresh_token,
        calendarId,
        start,
        end,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);

    const events_list = data.data.items;
    const events = [];
    events_list.map((event, index) => {
      const temp_event = {
        id: index,
        title: event?.summary,
        start: event?.start?.dateTime,
        end: event?.end?.dateTime,
        description: event?.description,
        backgroundColor: "#097efa",
      };
      events.push(temp_event);
    });
    return events;
  };
  const handleEventAdd = (arg) => {
    alert(arg.dateStr);
  };

  const handleDateClick = (info) => {
    console.log("Date click handling");
  };
  const handleChange = (info) => {
    console.log(info);
    console.log("Change handling");
  };
  const handleEventClick = (event) => {
    const payload = {
      title: event.event.title,
      description: event.event.extendedProps.description,
      start: event.event.start,
      end: event.event.end,
      id: event.event.id,
    };

    dispatch(addEventDescription(payload));
    dispatch(changeEventModalState());
    console.log(event.event.id);
    console.log("Event Click");
  };
  const handleEventRecieve = (event) => {
    console.log(event);
    console.log("Event Recieive");
  };
  const fetchAllEvents = async (fetchInfo) => {
    const googleEvents = await getAllEvents(fetchInfo.start, fetchInfo.end);
    return googleEvents;
  };
  useEffect(() => {
    getAllEvents();
  });
  return (
    <div className="w-full shadow-xl ">
      <EventModalComponent />
      <FullCalendar
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "",
        }}
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          googleCalendarPlugin,
        ]}
        initialView="timeGridWeek"
        dayHeaderFormat={{
          weekday: "short",
          day: "2-digit",
        }}
        dayHeaderClassNames={"header-component"}
        // editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        events={fetchAllEvents}
        droppable={true}
        dateClick={handleDateClick}
        eventChange={handleChange}
        eventDurationEditable={true}
        eventBackgroundColor="#097efa"
        // when certain event get click;
        eventClick={handleEventClick}
        eventReceive={handleEventRecieve}
      />
    </div>
  );
};

export default CalendarComponent;
