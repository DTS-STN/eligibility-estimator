/* eslint-disable cypress/no-unnecessary-waiting */
//Cypress tests for the eligibility page

beforeEach(() => {
  cy.visit('/')
  cy.get('input[name="username"]').type('ep-be')
  cy.get('input[name="password"]').type('estimator')
  cy.get('button').click()
  cy.get('#btn1').first().click()
})

describe('form page loads without errors', () => {
  it('should have eligibility in the URL', () => {
    cy.location('pathname').should('equal', '/eligibility')
  })
})

describe('Age section behaviour', () => {
  it('should throw errors if nothing is entered', () => {
    cy.get('#step1-button').first().click()
    cy.wait(150)
    cy.get('.ds-errorText').should('be.visible')
  })

  it('should display the income section if information is valid', () => {
    cy.get('#age-birth-month').select('June')
    cy.get('#age-birth-year').type('1950')
    cy.get('#oasDefer-0').check()
    cy.wait(150)
    cy.get('#step1-button').click()
    cy.get('#step2-button').should('be.visible')
  })
})

describe('Income section behaviour', () => {
  it('should throw errors if nothing is entered', () => {
    cy.get('#age-birth-month').select('June')
    cy.get('#age-birth-year').type('1950')
    cy.get('#oasDefer-0').check()
    cy.wait(150)
    cy.get('#step1-button').click()
    cy.get('#step2-button').first().click()
    cy.wait(150)
    cy.get('.ds-errorText').should('be.visible')
  })

  it('should let a user enter income after checking provide income radio button', () => {
    cy.get('#age-birth-month').select('June')
    cy.get('#age-birth-year').type('1950')
    cy.get('#oasDefer-0').check()
    cy.wait(150)
    cy.get('#step1-button').click()
    cy.get('#incomeAvailable-0').check()
    cy.get('#enter-income').should('be.visible')
  })

  it('should display legal status if no income selected', () => {
    cy.get('#age-birth-month').select('June')
    cy.get('#age-birth-year').type('1950')
    cy.get('#oasDefer-0').check()
    cy.wait(150)
    cy.get('#step1-button').click()
    cy.get('#incomeAvailable-1').check()
    cy.get('#step2-button').click()
    cy.get('#step3-button').should('be.visible')
  })
})

describe('legal status section', () => {
  it('should throw errors if nothing is entered', () => {
    cy.get('#age-birth-month').select('June')
    cy.get('#age-birth-year').type('1950')
    cy.get('#oasDefer-0').check()
    cy.wait(150)
    cy.get('#step1-button').click()
    cy.wait(150)
    cy.get('#step2-button').first().click()
    cy.get('#incomeAvailable-1').check()
    cy.wait(150)
    cy.get('#step2-button').click()
    cy.wait(150)
    cy.get('#step3-button').click()
    cy.get('.ds-errorText').should('be.visible')
  })

  it('should display residence history if information is valid', () => {
    cy.get('#age-birth-month').select('June')
    cy.get('#age-birth-year').type('1950')
    cy.get('#oasDefer-0').check()
    cy.wait(150)
    cy.get('#step1-button').click()
    cy.wait(150)
    cy.get('#step2-button').first().click()
    cy.get('#incomeAvailable-1').check()
    cy.wait(150)
    cy.get('#step2-button').click()
    cy.get('#legalStatus-0').check()
    cy.wait(150)
    cy.get('#step3-button').click()
    cy.get('#step4-button').should('be.visible')
  })
})

describe('Residence History', () => {
  it('should throw errors if nothing is entered', () => {
    cy.get('#age-birth-month').select('June')
    cy.get('#age-birth-year').type('1950')
    cy.get('#oasDefer-0').check()
    cy.wait(150)
    cy.get('#step1-button').click()
    cy.wait(150)
    cy.get('#step2-button').click()
    cy.get('#incomeAvailable-1').check()
    cy.wait(150)
    cy.get('#step2-button').click()
    cy.get('#legalStatus-0').check()
    cy.wait(150)
    cy.get('#step3-button').click()
    cy.wait(150)
    cy.get('#step4-button').click()
    cy.get('.ds-errorText').should('be.visible')
  })

  it('should display marital status if valid', () => {
    cy.get('#age-birth-month').select('June')
    cy.get('#age-birth-year').type('1950')
    cy.get('#oasDefer-0').check()
    cy.wait(150)
    cy.get('#step1-button').click()
    cy.wait(150)
    cy.get('#step2-button').click()
    cy.get('#incomeAvailable-1').check()
    cy.wait(150)
    cy.get('#step2-button').click()
    cy.get('#legalStatus-0').check()
    cy.wait(150)
    cy.get('#step3-button').click()
    cy.get('#livedOnlyInCanada-0').check()
    cy.wait(150)
    cy.get('#step4-button').click()
    cy.get('#step5-button').should('be.visible')
  })
})

describe('Marital Status', () => {
  it('display errors if nothing is selected', () => {
    cy.get('#age-birth-month').select('June')
    cy.get('#age-birth-year').type('1950')
    cy.get('#oasDefer-0').check()
    cy.wait(150)
    cy.get('#step1-button').click()
    cy.wait(150)
    cy.get('#step2-button').click()
    cy.get('#incomeAvailable-1').check()
    cy.wait(150)
    cy.get('#step2-button').click()
    cy.get('#legalStatus-0').check()
    cy.wait(150)
    cy.get('#step3-button').click()
    cy.get('#livedOnlyInCanada-0').check()
    cy.wait(150)
    cy.get('#step4-button').click()
    cy.get('#step5-button').click()
    cy.get('.ds-errorText').should('be.visible')
  })
})

export {}
