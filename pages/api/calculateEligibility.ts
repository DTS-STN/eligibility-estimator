import type { NextApiRequest, NextApiResponse } from 'next'
import {
  ResponseError,
  ResponseSuccess,
} from '../../utils/api/definitions/types'
import MainHandler from '../../utils/api/mainHandler'

// this is a simple entrypoint for api requests
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseSuccess | ResponseError>
) {
  const result = new MainHandler(req.query).results
  if ('error' in result) res.status(400).json(result)
  else res.status(200).json(result)
}
