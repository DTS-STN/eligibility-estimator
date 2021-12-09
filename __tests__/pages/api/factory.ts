import { createMocks } from 'node-mocks-http'
import handler from '../../../pages/api/calculateEligibility'
import {
  CalculationInput,
  ResponseError,
  ResponseSuccess,
} from '../../../utils/api/definitions/types'

interface MockResponseObject<T extends ResponseSuccess | ResponseError> {
  status: number
  body: T
}

async function mockGetRequestGeneric<T extends ResponseSuccess | ResponseError>(
  params: CalculationInput
): Promise<MockResponseObject<T>> {
  const { req, res } = createMocks({ method: 'GET', query: params })
  handler(req, res)
  return { status: res.statusCode, body: res._getJSONData() }
}

export async function mockGetRequest(
  params: CalculationInput
): Promise<MockResponseObject<ResponseSuccess>> {
  return mockGetRequestGeneric<ResponseSuccess>(params)
}

export async function mockGetRequestError(
  params: CalculationInput
): Promise<MockResponseObject<ResponseError>> {
  return mockGetRequestGeneric<ResponseError>(params)
}
