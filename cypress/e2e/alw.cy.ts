//====
// UI Regression test to validate ALW variations
// for widowed scenarios and ineligible individuals.
//
// Author: Curtis Underwood, Maxim Lam
//====

import testData from '../fixtures/alwCases'
import {
  ResponseError,
  ResponseSuccess,
} from '../../utils/api/definitions/types'
import MainHandler from '../../utils/api/mainHandler'
import { InputHelper } from '../../client-state/InputHelper'
import { Language } from '../../utils/api/definitions/enums'
import en from '../../i18n/api/en'
import fr from '../../i18n/api/fr'

/* eslint-disable */
// Disable ESLint to prevent failing linting inside the Next.js repo.
// If you're using ESLint on your project, we recommend installing the ESLint Cypress plugin instead:
// https://github.com/cypress-io/eslint-plugin-cypress
beforeEach(() => {
  const username = 'ep-be'
  const password = 'estimator'
  cy.loginAndSaveSession(username, password)
  cy.visit('/en/questions')
  cy.viewport(1000, 1000)
})

/**
 * ALW Benefit Card Edge Case Results
 */
describe('ALW Benefit Card Results', () => {
  testData.forEach((item) => {
    it(`Test  ${item.testId}`, () => {
      //Fill Form
      cy.fillQuestionsForm(item)

      // Results Testing - English
      cy.window()
        .its('sessionStorage.inputs')
        .then((inputsData) => {
          // Perform assertions on the inputs data
          expect(inputsData).to.exist // Ensure data is being successfully passed and navigation successful
          cy.url().should('contains', '/results')

          // Get Expected Results
          const inputHelper = new InputHelper(
            JSON.parse(inputsData),
            null,
            Language.EN
          )
          const mainHandler = new MainHandler(inputHelper.asObjectWithLanguage)
          const response: ResponseSuccess | ResponseError = mainHandler.results

          // Perform checks on the English response
          checkALWResults(response, item, Language.EN)
        })

      // Switch to French version of the page and re-run checks
      cy.getByData('lang1').click()
      cy.wait(1000)

      // Results Testing - French
      cy.window()
        .its('sessionStorage.inputs')
        .then((inputsData) => {
          // Perform assertions on the inputs data
          expect(inputsData).to.exist // Ensure data is being successfully passed and navigation successful
          cy.url().should('contains', '/resultats')

          // Get Expected Results (French)
          const inputHelper = new InputHelper(
            JSON.parse(inputsData),
            null,
            Language.FR
          )
          const mainHandler = new MainHandler(inputHelper.asObjectWithLanguage)
          const response: ResponseSuccess | ResponseError = mainHandler.results

          // Perform checks on the French response
          checkALWResults(response, item, Language.FR)
        })
    })
  })
})

function removeHtmlContent(text) {
  text = text.replace(/&nbsp;|\xA0/g, ' ')
  text = text.replace(/<[^>]+>/g, '')
  text = text.replace(/<\/?[^>]+>/g, '')

  return text
}

// Function to perform checks on ALW Benefit Card Results
function checkALWResults(response, item, language) {
  const alw = response.results.alw
  const lang = language === Language.FR ? fr : en

  //Title
  cy.getByData('alw')
    .find('[data-cy="benefit-title"]')
    .should('exist')
    .contains(lang.benefit.alw)

  //Flag
  cy.getByData('alw')
    .find('[data-cy="eligibility-flag"]')
    .should('exist')
    .contains(removeHtmlContent(item.alwEligible[language]))

  //Detail
  item.alwDetail[language].forEach((index) => {
    cy.getByData('alw')
      .find('[data-cy="benefit-detail"]')
      .should('exist')
      .contains(removeHtmlContent(index))
  })

  //Detail Estimate
  if (item.alwDetail.estimate) {
    cy.getByData('alw').find('[data-cy="benefit-estimate"]').should('exist')
  }

  //Next Steps
  if (item.nextSteps) {
    cy.getByData('alw')
      .find('[data-cy="next-step-title"]')
      .should('exist')
      .contains(lang.nextStepTitle)
    //Content
    item.nextSteps[language].forEach((index) => {
      cy.getByData('alw')
        .find('[data-cy="next-step-content"]')
        .should('exist')
        .contains(removeHtmlContent(index))
    })
    //Check Income Limit Display
    if (item.nextSteps.limit) {
      cy.getByData('alw').find('[data-cy="next-step-limit"]').should('exist')
    }
  }

  //Links
  cy.getByData('alw')
    .find('[data-cy="benefit-links"]')
    .children()
    .should('have.length', alw.cardDetail.links.length)
  alw.cardDetail.links.forEach((link) => {
    cy.getByData('alw').find('[data-cy="benefit-links"]').contains(link.text)
  })
}

// Prevent TypeScript from reading file as legacy script
export {}
