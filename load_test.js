/* 
To run load test:
1. Install k6 (https://k6.io/docs/get-started/installation/)
2. Run command: `k6 run load_test.js` from main directory
*/

import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '30s', target: 25 },
    { duration: '1m', target: 100 },
    { duration: '20s', target: 20 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<300'], // 95% of requests should be below 300ms
  },
}

export default function () {
  const pages = ['/', '/eligibility', '/results']

  const headers = {
    'upgrade-insecure-requests': '1',
    'sec-ch-ua':
      '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Linux"',
  }

  for (const page of pages) {
    const res = http.get(
      'https://ep-be-staging.bdm-dev-rhp.dts-stn.com' + page,
      { headers }
    )

    check(res, {
      'status was 200': (r) => r.status == 200,
      'duration was <=': (r) => r.timings.duration <= 300,
    })
    sleep(1)
  }
}
