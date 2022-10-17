import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST": {
      return showTaskByUserId(req, res);
    }
  }
}

async function showTaskByUserId(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.body;
  await prisma.todos
    .findMany({
      where: {
        userId,
      },
      orderBy: {
        importance: "desc",
      },
    })
    .then((data) => res.status(200).json(data))
    .catch((e) => res.status(500).json(e.message));
}
