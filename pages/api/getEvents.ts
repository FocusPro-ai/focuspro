import { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET;

const oauth2 = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST": {
      return getAllEvents(req, res);
    }
  }
}

async function getAllEvents(req: NextApiRequest, res: NextApiResponse) {
  const { refresh_token, calendarId, start, end } = req.body;
  oauth2.setCredentials({ refresh_token: refresh_token });
  const calendar = google.calendar({ version: "v3", auth: oauth2 });

  // const response = await calendar.events.get({
  //   calendarId,
  //   eventId: "",
  //   key: "AIzaSyDRabaMUH-qeH37jEE8-g62GNCNTD9oNN8",
  // });
  const month = new Date().getMonth();

  const response = await calendar.events.list({
    calendarId: "primary",
    timeMin: start,
    timeMax: end,
  });
  res.status(200).json(response);
}
