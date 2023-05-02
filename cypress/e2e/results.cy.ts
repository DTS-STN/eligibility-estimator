/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(() => {
  cy.visit('/')
  cy.get('input[name="username"]').type('ep-be')
  cy.get('input[name="password"]').type('estimator')
  cy.get('button').click()
  cy.get('#btn1').first().click()
})

describe('results page load', () => {
  it('should redirect to /result', () => {
    //Age section
    cy.get('#age-birth-month').select('June')
    cy.get('#age-birth-year').type('1950')
    cy.get('#oasDefer-0').check()
    cy.wait(150)
    cy.get('#step1-button').click()
    //Income section
    cy.get('#incomeAvailable-0').check()
    cy.get('#enter-income').type('4000')
    cy.wait(150)
    cy.get('#step2-button').first().click()
    //Legal Status section
    cy.get('#legalStatus-0').check()
    cy.wait(150)
    cy.get('#step3-button').first().click()
    //Lived in Canada section
    cy.get('#livedOnlyInCanada-0').check()
    cy.wait(150)
    cy.get('#step4-button').first().click()
    //Marital Status Section
    cy.get('#maritalStatus-0').check()
    cy.wait(150)
    cy.get('#step5-button').first().click()
    //Results
    cy.location('pathname').should('equal', '/results')
  })
})

describe('OAS eligibility', () => {
  it('should display eligible for OAS, GIS', () => {
    //Age section
    cy.get('#age-birth-month').select('June')
    cy.get('#age-birth-year').type('1950')
    cy.get('#oasDefer-0').check()
    cy.wait(150)
    cy.get('#step1-button').click()
    //Income section
    cy.get('#incomeAvailable-0').check()
    cy.get('#enter-income').type('4000')
    cy.wait(150)
    cy.get('#step2-button').first().click()
    //Legal Status section
    cy.get('#legalStatus-0').check()
    cy.wait(150)
    cy.get('#step3-button').first().click()
    //Lived in Canada section
    cy.get('#livedOnlyInCanada-0').check()
    cy.wait(150)
    cy.get('#step4-button').first().click()
    //Marital Status Section
    cy.get('#maritalStatus-0').check()
    cy.wait(150)
    cy.get('#step5-button').first().click()
    //Results
    cy.get('a[href*="oas"]').should('contain.text', 'Eligible')
    cy.get('a[href*="gis"]').should('contain.text', 'Eligible')
    cy.get('a[href*="alw"]').should('contain.text', 'Not')
    cy.get('a[href*="afs"]').should('contain.text', 'Not')
  })
})
