import React, { useCallback, useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
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

const EventColors = [
  "#039be5",
  "#7986cb",
  "#33b679",
  "#8e24aa",
  "#e67c73",
  "#f6c026",
  "#f5511d",
  "#039be5",
  "#616161",
  "#3f51b5",
  "#0b8043",
  "#d60000",
];

const CalendarComponent = () => {
  const { data: session } = useSession();
  const [initialEvents, setInitialEvents] = useState([]);
  const calendarRef = useRef();
  const dispatch = useDispatch();
  const eventModalState = useSelector(
    (state) => state.eventModal.eventModalState
  );

  useEffect(() => {
    if (eventModalState == true) {
      return;
    }
    if (eventModalState == false) {
      let calendarApi = calendarRef.current.getApi();
      calendarApi.refetchEvents();
    }
  }, [eventModalState]);

  const addEvents = async ({
    event_title,
    event_description,
    start,
    end,
    colorId,
  }) => {
    console.log(colorId);
    const refresh_token = session?.user.refreshToken;
    const response = await fetch("/api/Calendar/addEvents", {
      method: "POST",
      body: JSON.stringify({
        refresh_token,
        event_title,
        event_description,
        start,
        end,
        colorId,
      }),
      headers: { "Content-type": "application/json" },
    });
    const data = await response.json();
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
      const temp_event = {
        id: event.id,
        title: event?.summary,
        start: event?.start?.dateTime,
        end: event?.end?.dateTime,
        description: event?.description,
        backgroundColor: event.colorId
          ? EventColors[event.colorId]
          : EventColors[0],
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
    colorId,
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
        colorId,
      }),
      headers: { "Content-type": "application/json" },
    });
  };

  const handleDoneTask = async (id) => {
    await fetch("/api/Task/doneTask", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ taskId: id }),
    });
  };

  // ------- Full calendar Functions ----

  const handleDateClick = (info) => {
    console.log("Date click handling");
  };
  const handleChange = (event) => {
    console.log(event);
    const background_color = event.event.backgroundColor;
    const colorId = EventColors.findIndex(
      (color) => background_color === color
    );
    console.log(colorId);
    const event_prop = {
      id: event.event._def.publicId,
      event_title: event.event.title,
      event_description: event.event.extendedProps.description,
      start: event.event.start,
      end: event.event.end,
      colorId,
    };
    console.log(event_prop);
    updateEvent(event_prop);
  };
  const handleEventClick = (event) => {
    const background_color = event.event.backgroundColor;
    const colorId = EventColors.findIndex(
      (color) => background_color === color
    );
    const payload = {
      title: event.event.title,
      description: event.event.extendedProps.description,
      start: event.event.start,
      end: event.event.end,
      id: event.event.id,
      colorId,
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
      colorId: event.event.extendedProps.colorId,
    };
    addEvents(event_prop).then((data) => {
      let calendarApi = calendarRef.current.getApi();
      calendarApi.refetchEvents();

      event.event.remove();
      handleDoneTask(event.event.id);
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
          center: "title",
          left: "today prev,next",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
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
