// everything below is from here except the lines marked custom:
// https://github.com/vercel/next.js/tree/canary/examples/with-jest

// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'

// custom
import replaceAllInserter from 'string.prototype.replaceall'

replaceAllInserter.shim()
