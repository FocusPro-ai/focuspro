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
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  addEventModal,
  changeEventModalSlice,
} from "../../slices/SelectCreateEvent/createEventModal";
import Analytics from "@june-so/analytics-node";
import { loginRequest } from "../../outlook-integration/authConfig";
import { useMsal } from "@azure/msal-react";
import { useIsAuthenticated } from "@azure/msal-react";
import { callCalendarEvents } from "../../outlook-integration/graph";

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
  const isAuthenticatedWithOutlook = useIsAuthenticated();
  const calendarRef = useRef();
  const dispatch = useDispatch();
  const { instance, accounts, inProgress } = useMsal();
  const [accessToken, setAccessToken] = useState(null);
  const name = accounts[0] && accounts[0].name;

  // Request Access Token .
  function RequestAcessToken() {
    const request = {
      ...loginRequest,
      account: accounts[0],
    };
    instance
      .acquireTokenSilent(request)
      .then((response) => {
        setAccessToken(response.accessToken);
        callCalendarEvents(response.accessToken).then((response) => {
          console.log(response.value);
          setInitialEvents(response.value);
          console.log(initialEvents);
        });
      })
      .catch((e) => {
        instance.acquireTokenPopup(request).then((response) => {
          setAccessToken(response.accessToken);

          callCalendarEvents(response.accessToken).then((response) => {
            setInitialEvents(response.value);
            console.log(initialEvents);
          });
        });
      });
  }
  const eventModalState = useSelector(
    (state) => state.eventModal.eventModalState
  );
  const createEventModalState = useSelector(
    (state) => state.createEventModal.eventModalSlice
  );
  const userData = useSelector((state) => state.user.user);

  useEffect(() => {
    if (eventModalState == true || createEventModalState == true) {
      return;
    }
    if (eventModalState == false || createEventModalState == false) {
      let calendarApi = calendarRef.current.getApi();
      calendarApi.refetchEvents();
    }
  }, [eventModalState]);

  useEffect(() => {
    if (isAuthenticatedWithOutlook) {
      RequestAcessToken();
    }
  }, [isAuthenticatedWithOutlook]);

  const getCalendarDB = async () => {
    const response = await fetch("/api/calendarDB/getCalendarDB", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ userId: userData?.id }),
    });
    return response.json();
  };
  const getCheckedTask = async () => {
    const response = await fetch("/api/calendarDB/checkedTask", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ userId: userData?.id }),
    });
    return response.json();
  };
  const { data: eventData } = useQuery(["calendar-events"], getCalendarDB, {
    refetchInterval: 5000,
  });
  const { data: checkedTask } = useQuery(["checked-events"], getCheckedTask, {
    refetchInterval: 5000,
  });
  const handleCheckbox = async (id) => {
    // const id = event.event.id;
    const response = await fetch("/api/calendarDB/checkTask", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ calendarId: id }),
    })
      .then(() => {
        toast.success("Hurray! Completed the task");
        const client = new Analytics("Kh1nkoO8kX6bKr2v");
        client.identify({
          userId: userData?.id,
          traits: {
            name: userData?.name,
            email: userData?.email,
          },
        });
        client.track({
          userId: userData?.id,
          event: "Checked a Task",
        });
        let calendarApi = calendarRef.current.getApi();
        calendarApi.refetchEvents();
      })
      .catch((e) => {
        toast.error("Something went wrong.");
      });
  };
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
    console.log(data);
    const dbResponse = await fetch("/api/calendarDB/addCalendar", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        userId: userData.id,
        calendarId: data.data.id,
        name: data.data.summary,
      }),
    });
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

    // Outlook Events
    // 1. Capturing the token .
    // 2. Get all outlook events.

    const events_list = data.data.items;

    const events = [];
    console.log("Intial-events", initialEvents);
    initialEvents.map((event) => {
      var startTime = new Date(event.start.dateTime);
      startTime.setHours(startTime.getHours() + 5);
      startTime.setMinutes(startTime.getMinutes() + 30);
      var endTime = new Date(event.end.dateTime);
      endTime.setHours(endTime.getHours() + 5);
      endTime.setMinutes(endTime.getMinutes() + 30);

      const tempEvent = {
        id: event.id,
        title: event.subject,
        start: startTime,
        end: endTime,
        description: event.bodyPreview,
        backgroundColor: "#097efa",
      };
      events.push(tempEvent);
    });
    events_list.map((event, index) => {
      const eventPresent = eventData.find((element) => {
        if (element?.calendarId === event.id) {
          return true;
        }
      });
      const checked = checkedTask.find((element) => {
        if (element?.calendarId === event.id) {
          return true;
        }
      });

      const eventTemplate = `<input type = "checkbox" ${
        checked ? "checked" : ""
      } /> `;
      // console.log("Google Events", event.start.dateTime);
      const temp_event = {
        id: event.id,
        title: `${eventPresent ? eventTemplate : ""}` + `${event?.summary}`,
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
    const title = String(event_title)
      .replaceAll('<input type = "checkbox"  />', "")
      .replaceAll('<input type = "checkbox" checked />', "");
    const response = await fetch("/api/Calendar/updateEvents", {
      method: "POST",
      body: JSON.stringify({
        event_id: id,
        refresh_token,
        event_title: title,
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
      title: String(event.event.title)
        .replaceAll('<input type = "checkbox"  />', "")
        .replaceAll('<input type = "checkbox" checked />', ""),
      description: event.event.extendedProps.description,
      start: event.event.start,
      end: event.event.end,
      id: event.event.id,
      colorId,
    };

    dispatch(addEventDescription(payload));
    dispatch(changeEventModalState());
  };
  const handleEventSelection = (info) => {
    console.log(info.start);
    const payload = {
      title: "",
      description: "",
      start: info.start,
      end: info.end,
    };
    dispatch(addEventModal(payload));
    dispatch(changeEventModalSlice());
  };
  const handleEventRecieve = (event) => {
    console.log(event);
    let calendarAPI = calendarRef.current.getApi();
    // calendarAPI.
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

  const handleEventContent = (info) => {
    return { html: info.event.title };
  };
  const fetchAllEvents = async (fetchInfo) => {
    const googleEvents = await getAllEvents(fetchInfo.start, fetchInfo.end);
    return googleEvents;
  };
  const handleEventDrop = (info) => {};
  const handleDoubleClick = (info) => {
    if (info.el.dblclick) return;
    info.el.dblclick = true;

    var timer = 0;
    var delay = 500;
    var prevent = false;
    info.el.addEventListener("click", (e) => {
      e.preventDefault();
      timer = setTimeout(function () {
        if (!prevent) {
          eventData.find((element) => {
            if (element?.calendarId === info.event.id) {
              console.log("This is checkbox");
              handleCheckbox(info.event.id);
            }
          });
        }
        prevent = false;
      }, delay);
    });

    info.el.addEventListener("dblclick", (e) => {
      e.preventDefault();
      clearTimeout(timer);
      prevent = true;
      handleEventClick(info);
    });
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
        displayEventTime={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        events={fetchAllEvents}
        ref={calendarRef}
        droppable={true}
        eventContent={handleEventContent}
        nowIndicator={true}
        dateClick={handleDateClick}
        eventChange={handleChange}
        eventDurationEditable={true}
        nowIndicatorClassNames={"now-indicator-line"}
        eventBackgroundColor="#097efa"
        // eventDrop={handleEventDrop}
        // when certain event get click;
        // eventClick={handleCheckbox}
        // drop={handleDropEvent}
        eventReceive={handleEventRecieve}
        eventDidMount={handleDoubleClick}
        eventClassNames={"calendar-event"}
        eventMinHeight={16}
        select={handleEventSelection}
      />
    </div>
  );
};

export default CalendarComponent;
