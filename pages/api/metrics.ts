import type { NextApiRequest, NextApiResponse } from 'next'
import { register, collectDefaultMetrics } from 'prom-client'

collectDefaultMetrics({ prefix: 'omnidevfrontend_' })

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  res.setHeader('Content-type', register.contentType)
  res.send(register.metrics())
}
