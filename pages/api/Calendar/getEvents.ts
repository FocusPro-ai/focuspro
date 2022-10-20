import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST": {
      return getEventsFromCalendar(req, res);
    }
  }
}

async function getEventsFromCalendar(
  req: NextApiRequest,
  res: NextApiResponse
) {}
