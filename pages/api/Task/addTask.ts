import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/prisma";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST": {
      return addUserTask(req, res);
    }
  }
}

async function addUserTask(req: NextApiRequest, res: NextApiResponse) {
  const { userId, heading, description, startDate, endDate } = req.body;
  await prisma.todos
    .create({
      data: {
        userId,
        heading,
        description,
        startDate,
        endDate,
      },
    })
    .then((data) => res.status(200).json(data))
    .catch((e) => res.status(500).json(e.message));
}
