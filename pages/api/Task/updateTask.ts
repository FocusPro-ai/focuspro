import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/prisma";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST": {
      return updateTask(req, res);
    }
  }
}

async function updateTask(req: NextApiRequest, res: NextApiResponse) {
  const { id, heading, description, importance } = req.body;
  await prisma.todos
    .update({
      where: {
        id,
      },
      data: {
        heading,
        description,
        importance,
      },
    })
    .then((data) => res.status(200).json(data))
    .catch((e) => res.status(500).json(e.message));
}
