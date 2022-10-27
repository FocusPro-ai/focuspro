import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/prisma";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST": {
      return doneTask(req, res);
    }
  }
}

async function doneTask(req: NextApiRequest, res: NextApiResponse) {
  const { taskId } = req.body;
  await prisma.todos
    .update({
      where: {
        id: taskId,
      },
      data: {
        completed: true,
      },
    })
    .then((data) => res.status(200).json(data))
    .catch((e) => res.status(500).json(e.message));
}
