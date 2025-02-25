//====
// UI Regression test to validate OAS variations
// for widowed scenarios and ineligible individuals.
//
// Author: Curtis Underwood
//====

import testData from '../fixtures/oasCases'
import {
  ResponseError,
  ResponseSuccess,
} from '../../utils/api/definitions/types'
import MainHandler from '../../utils/api/mainHandler'
import { InputHelper } from '../../client-state/InputHelper'
import { Language } from '../../utils/api/definitions/enums'
import en from '../../i18n/api/en'
import fr from '../../i18n/api/fr'
import { textReplacementRules } from '../../utils/api/definitions/textReplacementRules'
import { numberToStringCurrency } from '../../i18n/api'

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
 * OAS Benefit Card Edge Case Results
 */
describe('OAS Benefit Card Results', () => {
  testData.forEach((item) => {
    if (item.testId == 'CASE-B-O16') {
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
            const mainHandler = new MainHandler(
              inputHelper.asObjectWithLanguage
            )
            const response: ResponseSuccess | ResponseError =
              mainHandler.results

            // Perform checks on the English response
            checkOASResults(mainHandler.handler, response, item, Language.EN)
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
            const mainHandler = new MainHandler(
              inputHelper.asObjectWithLanguage
            )
            const response: ResponseSuccess | ResponseError =
              mainHandler.results

            // Perform checks on the French response
            checkOASResults(mainHandler.handler, response, item, Language.FR)
          })
      })
    }
  })
})

function runTextReplacements(handler, benefitResult, inputString) {
  let processedString = inputString
  for (const ruleKey in textReplacementRules) {
    if (textReplacementRules.hasOwnProperty(ruleKey)) {
      const placeholder = `{${ruleKey}}`

      if (processedString.includes(placeholder)) {
        //OAS Eligibility Age 65
        if (placeholder == '{EARLIEST_ELIGIBLE_AGE}') {
          processedString = processedString.replace(placeholder, '65')
        } else {
          const replacement = textReplacementRules[ruleKey](
            handler,
            benefitResult
          )
          processedString = processedString.replace(placeholder, replacement)
        }
      }
    }
  }

  processedString = processedString.replace(/&nbsp;|\xA0/g, ' ')
  processedString = processedString.replace(/<[^>]+>/g, '')
  processedString = processedString.replace(/<\/?[^>]+>/g, '')
  return processedString
}

function removeHtmlContent(text) {
  text = text.replace(/&nbsp;|\xA0/g, ' ')
  text = text.replace(/<[^>]+>/g, '')
  text = text.replace(/<\/?[^>]+>/g, '')

  return text
}

// Function to perform checks on OAS Benefit Card Results
function checkOASResults(handler, response, item, language) {
  const oas = response.results.oas
  const oasFuture = response.futureClientResults
  const lang = language === Language.FR ? fr : en

  //Title
  cy.getByData('oas')
    .find('[data-cy="benefit-title"]')
    .should('exist')
    .contains(lang.benefit.oas)

  //Flag
  cy.getByData('oas')
    .find('[data-cy="eligibility-flag"]')
    .should('exist')
    .contains(removeHtmlContent(item.oasEligible[language]))

  //Detail
  item.oasDetail[language].forEach((index) => {
    cy.getByData('oas')
      .find('[data-cy="benefit-detail"]')
      .should('exist')
      .contains(runTextReplacements(handler, response, index))
  })

  //Detail Estimate
  if (item.oasDetail.estimate) {
    cy.getByData('oas')
      .find('[data-cy="benefit-estimate"]')
      .should('exist')
      .should('not.include.text', 'null')
  }

  //Collapsed Text
  if (item.collapsedText) {
    //For Each Collapsed Accordion
    item.collapsedText[language].forEach((index, step) => {
      cy.getByData('oas')
        .find(`[data-cy="collapse-oas-${step}"]`)
        .should('exist')
        .contains(removeHtmlContent(index.object.heading))
        .click()
      if (index.estimate) {
        //Estimate exists and is non-null
        cy.getByData('oas')
          .find(`[data-cy="benefit-estimate"]`)
          .should('exist')
          .should('not.include.text', 'null')
      } else {
        cy.getByData('oas')
          .find(`[data-cy="collapse-oas-${step}"]`)
          .should('exist')
          .contains(removeHtmlContent(index.object.text))
      }
    })
  }

  //OAS Deferral
  if (item.oasDeferral) {
    //Detail
    cy.getByData('oas')
      .find('[data-cy="benefit-detail"]')
      .should('exist')
      .contains(lang.detail.yourDeferralOptions)
    item.oasDeferral[language].forEach((index) => {
      cy.getByData('oas')
        .find('[data-cy="benefit-detail"]')
        .should('exist')
        .contains(runTextReplacements(handler, response, index))
    })

    //Table Data Check
    if (item.oasDeferral.table) {
      //Table Heading Check
      cy.getByData('oas')
        .find('[data-cy="deferral-title"]')
        .should('exist')
        .contains(lang.oasDeferralTable.title)

      cy.getByData('oas')
        .find('[data-cy="deferral-heading"]')
        .should('exist')
        .contains(lang.oasDeferralTable.headingAmount)
      if (
        item.oasEligible[language] == 'Eligible' ||
        item.oasEligible[language] == 'Admissible'
      ) {
        cy.getByData('oas')
          .find('[data-cy="deferral-heading"]')
          .should('exist')
          .contains(lang.oasDeferralTable.headingAge)
      } else {
        cy.getByData('oas')
          .find('[data-cy="deferral-heading"]')
          .should('exist')
          .contains(lang.oasDeferralTable.futureHeadingAge)
      }

      //Deferral Based On Age
      console.dir(response)
      const deferralTableResults =
        item.ageYears < 65
          ? oasFuture[0][65].oas.cardDetail.meta.tableData
          : oasFuture[0][item.ageYears + 1].oas.cardDetail.meta.tableData

      deferralTableResults.forEach((index) => {
        cy.getByData('oas')
          .find('[data-cy="deferral-table"]')
          .should('exist')
          .contains(index.age)
        cy.getByData('oas')
          .find('[data-cy="deferral-table"]')
          .should('exist')
          .contains(
            removeHtmlContent(numberToStringCurrency(index.amount, language))
          )
      })
    }
  }

  //Next Steps
  if (item.nextSteps) {
    cy.getByData('oas')
      .find('[data-cy="next-step-title"]')
      .should('exist')
      .contains(lang.nextStepTitle)
    //Content
    item.nextSteps[language].forEach((index) => {
      cy.getByData('oas')
        .find('[data-cy="next-step-content"]')
        .should('exist')
        .contains(runTextReplacements(handler, response, index))
    })
    //Check Income Limit Display
    if (item.nextSteps.limit) {
      cy.getByData('oas')
        .find('[data-cy="next-step-limit"]')
        .should('exist')
        .should('not.include.text', 'null')
    }
  }

  //Links
  const oasLinks =
    item.ageYears < 65
      ? oasFuture[0][65].oas.cardDetail.links
      : oas.cardDetail.links

  cy.getByData('oas')
    .find('[data-cy="benefit-links"]')
    .children()
    .should('have.length', oasLinks.length)
  oasLinks.forEach((link) => {
    cy.getByData('oas').find('[data-cy="benefit-links"]').contains(link.text)
  })
}

// Prevent TypeScript from reading file as legacy script
export {}
