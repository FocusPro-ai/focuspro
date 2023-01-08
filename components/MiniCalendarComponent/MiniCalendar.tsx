import React from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const MiniCalendarComponent = () => {
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
  const { data: session } = useSession();
  const userData = useSelector((state: any) => state.user.user);
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
  const handleEventContent = (info: any) => {
    return { html: info.event.title };
  };
  const getAllEvents = async (start: any, end: any) => {
    if (start == undefined && end == undefined) return;
    const events: any = [];
    const refresh_token = session?.user?.refreshToken;
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
    const events_list = data.data.items;
    events_list?.map((event: any, index: any) => {
      const eventPresent = eventData.find((element: any) => {
        if (element?.calendarId === event.id) {
          return true;
        }
      });
      const checked = checkedTask.find((element: any) => {
        if (element?.calendarId === event.id) {
          return true;
        }
      });

      const eventTemplate = `<input type = "checkbox" ${
        checked ? "checked" : ""
      } /> `;

      const temp_event = {
        id: event.id,
        title: `${eventPresent ? eventTemplate : ""}` + `${event?.summary}`,
        start: event?.start?.dateTime,
        end: event?.end?.dateTime,
        description: event?.description,
        backgroundColor: event.colorId
          ? EventColors[event.colorId]
          : EventColors[0],
        completed: eventPresent && eventPresent?.completed,
        meetingLink: event.hangoutLink && event.hangoutLink,
      };
      events.push(temp_event);
    });

    return events;
  };
  const fetchAllEvents = async (fetchInfo: any) => {
    const googleEvents = await getAllEvents(fetchInfo.start, fetchInfo.end);
    return googleEvents;
  };
  return (
    <div className="h-auto min-w-[350px] ">
      <FullCalendar
        headerToolbar={{
          center: "",
          left: "today prev,next",
          right: "",
        }}
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          googleCalendarPlugin,
        ]}
        initialView="timeGridDay"
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
        // ref={calendarRef}
        droppable={true}
        eventContent={handleEventContent}
        nowIndicator={true}
        // dateClick={handleDateClick}
        // eventChange={handleChange}
        eventDurationEditable={true}
        nowIndicatorClassNames={"now-indicator-line"}
        eventBackgroundColor="#097efa"
        firstDay={1}
        // slotLabelInterval={"00:30"}
        // eventDrop={handleEventDrop}
        // when certain event get click;
        // eventClick={handleCheckbox}
        // drop={handleDropEvent}

        eventClassNames={"calendar-event"}
        eventMinHeight={16}
      />
    </div>
  );
};

export default MiniCalendarComponent;
