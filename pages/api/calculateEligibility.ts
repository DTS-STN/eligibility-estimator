import type { NextApiRequest, NextApiResponse } from 'next'
import {
  ResponseError,
  ResponseSuccess,
} from '../../utils/api/definitions/types'
import MainHandler from '../../utils/api/mainHandler'
import { InputHelper } from '../../client-state/InputHelper'
import { Language } from '../../utils/api/definitions/enums'

// this is a simple entrypoint for api requests
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseSuccess | ResponseError>
) {
  const inputHelper = new InputHelper(req.query, null, Language.EN)

  const result = new MainHandler(inputHelper.asObjectWithLanguage).results
  if ('error' in result) res.status(400).json(result)
  else res.status(200).json(result)
}
