import { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import { ideahub } from "googleapis/build/src/apis/ideahub";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET;

const oauth2 = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST": {
      return updateEvent(req, res);
    }
  }
}

async function updateEvent(req: NextApiRequest, res: NextApiResponse) {
  const {
    refresh_token,
    event_title,
    event_description,
    start,
    end,
    event_id,
  } = req.body;
  oauth2.setCredentials({ refresh_token: refresh_token });
  const calendar = google.calendar({ version: "v3", auth: oauth2 });

  // const response = await calendar.events.get({
  //   calendarId,
  //   eventId: "",
  //   key: "AIzaSyDRabaMUH-qeH37jEE8-g62GNCNTD9oNN8",
  // });

  const response = await calendar.events
    .update({
      eventId: event_id,
      calendarId: "primary",
      requestBody: {
        start: {
          dateTime: start,
        },
        end: {
          dateTime: end,
        },
        summary: event_title,
        description: event_description,
      },
    })

    .then((data) => res.status(200).json(data))
    .catch((e) => res.status(500).json(e.message));
}
