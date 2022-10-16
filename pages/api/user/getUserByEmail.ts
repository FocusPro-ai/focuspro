import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/prisma";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST": {
      return getUserDetails(req, res);
    }
  }
}

async function getUserDetails(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;
  await prisma.user
    .findUnique({
      where: {
        email,
      },
    })
    .then((data) => res.status(200).json(data))
    .catch((e) => res.status(500).json(e.message));
}
