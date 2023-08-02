/* eslint-disable cypress/no-unnecessary-waiting */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Prevent TypeScript from reading file as legacy script

declare global {
  namespace Cypress {
    interface Chainable {
      loginAndSaveSession(
        username: string,
        password: string
      ): Chainable<JQuery<HTMLElement>>
      fillQuestionsForm(item: any): Chainable<JQuery<HTMLElement>>
      getByData(dataTestAttribute: string): Chainable<JQuery<HTMLElement>>
    }
  }
}

Cypress.Commands.add('loginAndSaveSession', (username, password) => {
  cy.session([username, password], () => {
    cy.visit('/')
    cy.get('input[name="username"]').type(username)
    cy.get('input[name="password"]').type(password)
    cy.get('button').click()
    cy.contains('Start benefits estimator').click()
    cy.viewport(1000, 1000)
  })
})

Cypress.Commands.add('getByData', (selector) => {
  return cy.get(`[data-cy=${selector}]`)
})

Cypress.Commands.add('fillQuestionsForm', (item) => {
  const getBirthday = (years, months) => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1

    const totalMonths = years * 12 + months
    const birthYear = currentYear - Math.floor(totalMonths / 12)
    const birthMonth = currentMonth - (totalMonths % 12)

    const month = new Date()
    month.setMonth(birthMonth - 1)

    return {
      year: birthYear,
      month: month.toLocaleString('en-US', { month: 'long' }),
    }
  }

  cy.get('#age-birth-month').select(
    getBirthday(item.ageYears, item.ageMonths).month
  )
  cy.get('#age-birth-year').type(
    `${getBirthday(item.ageYears, item.ageMonths).year}`
  )
  cy.wait(1000)

  cy.contains('div', `${item.ageYears} years old`).should('exist')

  if (item.ageYears >= 65) {
    cy.get('#receiveOAS').should('be.visible')
    if (item.receiveOAS === true) {
      cy.get('#receiveOAS-0').check()
      cy.wait(1000)
      cy.get('#oasDeferDuration').should('exist')
      cy.get('#oasDeferDuration-years').select(item.delayYears)
      cy.get('#oasDeferDuration-months').select(item.delayMonths)
    } else {
      cy.get('#receiveOAS-1').check()
    }
  }

  cy.get('#step1-button').click()
  cy.get('#income').should('be.visible')

  cy.get('#enter-income').type(`${item.netWorldIncome}`)
  cy.get('#step2-button').click()
  cy.wait(1000)

  cy.get('#legalStatus').should('exist')
  if (item.legalStatus === true) {
    cy.get('#legalStatus-0').check()
  } else {
    cy.get('#legalStatus-1').check()
  }

  cy.get('#step3-button').click()
  cy.wait(500)
  cy.get('#livingCountry').should('exist')
  cy.get('#livingCountry-select').type(`${item.countryResidence}\n`)
  cy.wait(500)
  if (item.inCanadaSince18 === true) {
    cy.get('#livedOnlyInCanada-0').check()
  } else {
    cy.get('#livedOnlyInCanada-1').check()
    cy.wait(500)
    cy.get('#enter-yearsInCanadaSince18').type(`${item.yearsResided}`)
    cy.wait(1000)
  }
  cy.get('#step4-button').click()
  cy.wait(500)

  cy.get('#maritalStatus').should('exist')
  switch (item.marritalStatus) {
    case 'Single':
      cy.get('#maritalStatus-0').check()
      break
    case 'Married':
      cy.get('#maritalStatus-1').check()
      break
    case 'Widowed':
      cy.get('#maritalStatus-2').check()
      break
  }

  cy.get('#step5-button').click()
  cy.wait(1000)
})

export {}
