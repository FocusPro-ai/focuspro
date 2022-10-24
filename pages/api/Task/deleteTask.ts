import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/prisma";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST": {
      return deleteTask(req, res);
    }
  }
}

async function deleteTask(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.body;
  await prisma.todos
    .delete({
      where: {
        id,
      },
    })
    .then((data) => res.status(200).json(data))
    .catch((e) => res.status(500).json(e.message));
}
