import { getTransformedPayloadByName } from './excelReaderUtil'

describe('Excel Reader Utility Tests', () => {
  it('should extract payload by name', () => {
    const filePath =
      '__tests__/utils/ScenariosWith2023Q3RatesAndThresholds.xlsx'
    const desiredName = 'CALC-126' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)

    if (extractedPayload) {
      // console.log('Extracted Payload:', extractedPayload)
      // Add your assertions here
      //expect(extractedPayload.length).toBeGreaterThan(0)
      //expect(jsonPayload.length).toBeGreaterThan(0)
      // Add assertions or other actions based on the extracted payload
    } else {
      console.log('Payload not found for the desired name')
    }
  })
})
