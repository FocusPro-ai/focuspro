import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/prisma";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST": {
      return addEventInCalendar(req, res);
    }
  }
}

async function addEventInCalendar(req: NextApiRequest, res: NextApiResponse) {
  const { userId, calendarId, name } = req.body;
  await prisma.taskToCalendar
    .create({
      data: {
        calendarId,
        name,
        userId,
      },
    })
    .then((data) => res.status(200).json(data))
    .catch((e) => res.status(500).json(e.message));
}
