import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/prisma";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST": {
      return addUserEmail(req, res);
    }
  }
}

async function addUserEmail(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;
  await prisma.waitlist
    .create({
      data: {
        email,
      },
    })
    .then((data) => res.status(200).json(data))
    .catch((e) => res.status(500).json(e.message));
}
