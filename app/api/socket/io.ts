import { NextApiRequest, NextApiResponse } from "next"
import SocketHandler from "@/lib/socketServer"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  SocketHandler(req, res)
}