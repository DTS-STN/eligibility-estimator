import { register, collectDefaultMetrics } from 'prom-client'

collectDefaultMetrics({ prefix: 'omnidevfrontend_' })

export default function handler(req, res) {
  res.setHeader('Content-type', register.contentType)
  res.send(register.metrics())
}
