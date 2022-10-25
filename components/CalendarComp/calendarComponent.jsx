import React, { useCallback, useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
// The import order DOES MATTER here. If you change it, you'll get an error!
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useSession } from "next-auth/react";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import EventModalComponent from "../EventModal/EventModalComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  addEventDescription,
  changeEventModalState,
} from "../../slices/eventModalSlice";

const CalendarComponent = () => {
  const { data: session } = useSession();
  const [initialEvents, setInitialEvents] = useState([]);
  const calendarRef = useRef();
  const dispatch = useDispatch();
  const eventModalState = useSelector(
    (state) => state.eventModal.eventModalState
  );

  useEffect(() => {
    let calendarApi = calendarRef.current.getApi();
    calendarApi.refetchEvents();
  }, [eventModalState]);

  const addEvents = async ({ event_title, event_description, start, end }) => {
    const refresh_token = session?.user.refreshToken;
    const response = await fetch("/api/Calendar/addEvents", {
      method: "POST",
      body: JSON.stringify({
        refresh_token,
        event_title,
        event_description,
        start,
        end,
      }),
      headers: { "Content-type": "application/json" },
    });
    const data = await response.json();
    console.log(data);
  };
  const getAllEvents = async (start, end) => {
    if (start == undefined && end == undefined) return;
    const refresh_token = session?.user.refreshToken;
    const response = await fetch("/api/Calendar/getEvents", {
      method: "POST",
      body: JSON.stringify({
        refresh_token,
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
      console.log(event);
      const temp_event = {
        id: event.id,
        title: event?.summary,
        start: event?.start?.dateTime,
        end: event?.end?.dateTime,
        description: event?.description,
        backgroundColor: "#2602f3",
      };
      events.push(temp_event);
    });
    return events;
  };
  const updateEvent = async ({
    id,
    event_title,
    event_description,
    start,
    end,
  }) => {
    const refresh_token = session?.user.refreshToken;
    const response = await fetch("/api/Calendar/updateEvents", {
      method: "POST",
      body: JSON.stringify({
        event_id: id,
        refresh_token,
        event_title,
        event_description,
        start,
        end,
      }),
      headers: { "Content-type": "application/json" },
    });
    const data = await response.json();
    console.log(data);
  };

  // ------- Full calendar Functions ----

  const handleDateClick = (info) => {
    console.log("Date click handling");
  };
  const handleChange = (event) => {
    console.log(event.event._def?.publicId);
    const event_prop = {
      id: event.event._def.publicId,
      event_title: event.event.title,
      event_description: event.event.extendedProps.description,
      start: event.event.start,
      end: event.event.end,
    };
    updateEvent(event_prop);
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
  };
  const handleEventRecieve = (event) => {
    console.log(event);
    const event_prop = {
      event_title: event.event.title,
      event_description: event.event.extendedProps.description,
      start: event.event.start,
      end: event.event.end,
    };
    addEvents(event_prop).then((data) => {
      console.log("added event");
      let calendarApi = calendarRef.current.getApi();
      calendarApi.refetchEvents();

      event.event.remove();
    });
  };

  const fetchAllEvents = async (fetchInfo) => {
    const googleEvents = await getAllEvents(fetchInfo.start, fetchInfo.end);
    return googleEvents;
  };
  const handleEventDrop = (info) => {
    console.log(info);
  };

  return (
    <div className="w-full shadow-xl ">
      <EventModalComponent />
      <FullCalendar
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
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
        editable={true}
        forceEventDuration={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        events={fetchAllEvents}
        ref={calendarRef}
        droppable={true}
        nowIndicator={true}
        dateClick={handleDateClick}
        eventChange={handleChange}
        eventDurationEditable={true}
        nowIndicatorClassNames={"now-indicator-line"}
        eventBackgroundColor="#097efa"
        // eventDrop={handleEventDrop}
        // when certain event get click;
        eventClick={handleEventClick}
        // drop={handleDropEvent}
        eventReceive={handleEventRecieve}
      />
    </div>
  );
};

export default CalendarComponent;
