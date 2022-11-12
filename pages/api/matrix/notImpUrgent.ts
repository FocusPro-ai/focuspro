import { prisma } from "../../../prisma/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST": {
      return getAllTodo(req, res);
    }
  }
}

async function getAllTodo(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.body;
  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const deadline_date = new Date();
  deadline_date.setDate(today.getDate() + 3);
  const response = await prisma.todos
    .findMany({
      where: {
        userId,

        completed: false,

        AND: [
          {
            deadline: {
              gte: yesterday,
              lte: deadline_date,
            },
          },
          {
            importance: {
              lte: 5,
              gte: 1,
            },
          },
        ],
      },
      take: 3,
    })
    .then((data) => res.status(200).json(data))
    .catch((e) => res.status(500).json(e.message));
}
