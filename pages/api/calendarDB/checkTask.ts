import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/prisma";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST": {
      return getCalendarDB(req, res);
    }
  }
}

async function getCalendarDB(req: NextApiRequest, res: NextApiResponse) {
  const { calendarId } = req.body;
  await prisma.taskToCalendar
    .update({
      where: {
        calendarId,
      },
      data: {
        completed: true,
      },
    })
    .then((data) => res.status(200).json(data))
    .catch((e) => res.status(500).json(e.message));
}
