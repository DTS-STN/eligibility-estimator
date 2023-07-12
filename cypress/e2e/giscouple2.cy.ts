//====
// UI Regression test to validate GIS Calculations
// for couple who are both pensioners.
//
// Author: Imad A. Ansari
//====

import testData from '../fixtures/giscouple2data.json'
//import testData from '../fixtures/singletest.json'

/* eslint-disable */
// Disable ESLint to prevent failing linting inside the Next.js repo.
// If you're using ESLint on your project, we recommend installing the ESLint Cypress plugin instead:
// https://github.com/cypress-io/eslint-plugin-cypress
beforeEach(() => {
  cy.visit('/')
  cy.get('input[name="username"]').type('ep-be')
  cy.get('input[name="password"]').type('estimator')
  cy.get('button').click()
  cy.contains('Start benefits estimator').click()
  cy.viewport(1000, 1000)
})

/**
 * GIS for Couples 2 Pensioners test cases
 */
describe('GIS for Couples - 2 Pensioners', () => {
  testData.forEach((item) => {
    it(`Test  ${item.testId}`, () => {
      //
      // Age Section
      //
      const birthday = getBirthday(item.ageYears, item.ageMonths)
      cy.get('#age-birth-month').select(birthday.month)
      cy.get('#age-birth-year').type(`${birthday.year}`)
      cy.wait(3000)

      cy.contains('div', `${item.ageYears} years old`).should('exist')
      cy.get('#receiveOAS').should('be.visible')
      if (item.receiveOAS == true) {
        cy.get('#receiveOAS-0').check()
        cy.wait(1000)
        cy.get('#oasDeferDuration').should('exist')

        cy.get('#oasDeferDuration-years').select(item.delayYears)
        cy.get('#oasDeferDuration-months').select(item.delayMonths)
      } else {
        cy.get('#receiveOAS-1').check()
      }

      cy.get('#step1-button').click()
      cy.get('#income').should('be.visible')

      //
      // Income section
      //
      cy.get('#enter-income').type(`${item.netWorldIncome}`)
      cy.get('#step2-button').click()
      cy.wait(3000)

      //
      // Legal Status section
      //
      cy.get('#legalStatus').should('exist')
      if (item.legalStatus == true) {
        cy.get('#legalStatus-0').check()
      } else {
        cy.get('#legalStatus-1').check()
      }
      //
      // Residence History
      //
      cy.get('#step3-button').click()
      cy.wait(500)
      cy.get('#livingCountry').should('exist')
      cy.get('#livingCountry-select').type(`${item.countryResidence}\n`)
      cy.wait(500)
      if (item.inCanadaSince18 == true) {
        cy.get('#livedOnlyInCanada-0').check()
      } else {
        cy.get('#livedOnlyInCanada-1').check()
        cy.wait(500)
        cy.get('#enter-yearsInCanadaSince18').type(`${item.yearsResided}`)
        cy.wait(1000)
      }
      cy.get('#step4-button').click()
      cy.wait(500)

      //
      // Marital Status
      //
      cy.get('#maritalStatus').should('exist')
      if (item.marritalStatus == 'Married') {
        cy.get('#maritalStatus-1').check()
      }
      cy.wait(500)
      cy.get('#invSeparated').should('exist')
      if (item.invSeparate == true) {
        cy.get('#invSeparated-0').check()
      } else {
        cy.get('#invSeparated-1').check()
      }

      const partnerBirthday = getBirthday(
        item.partnerAgeYears,
        item.partnerAgeMonths
      )

      cy.get('#partnerAge-birth-month').select(partnerBirthday.month)
      cy.get('#partnerAge-birth-year').type(`${partnerBirthday.year}`)
      cy.wait(500)
      cy.get('#enter-partnerIncome').type(`${item.partnerWorldIncome}`)
      cy.get('#partnerLegalStatus-0').check()

      cy.get('#partnerLivingCountry-select').type(
        `${item.partnerCountryResidence}\n`
      )
      cy.wait(500)

      if (item.partnerInCanadaSince18 == true) {
        cy.get('#partnerLivedOnlyInCanada-0').check()
        cy.wait(500)
      } else {
        cy.get('#partnerLivedOnlyInCanada-1').check()
        cy.wait(500)
        cy.get('#enter-partnerYearsInCanadaSince18').type(
          `${item.partnerYearsResided}`
        )
        cy.wait(500)
      }

      if (item.partnerRecvOas == true) {
        cy.get('#partnerBenefitStatus-0').check()
      } else if (item.partnerRecvOas == false) {
        cy.get('#partnerBenefitStatus-1').check()
      } else {
        cy.get('#partnerBenefitStatus-2').check()
      }

      //
      // Estimate my benefits
      //
      cy.get('#step5-button').click()
      cy.wait(1000)

      // 
      // Results
      //
      cy.get('#estimate')
        .nextAll('div')
        .contains(item.userOasResult.toLocaleString())
        .should('exist')

      if (item.userGisResult > 0) {
        cy.get('#estimate')
          .nextAll('div')
          .contains(item.userGisResult.toLocaleString())
          .should('exist')
      }

      cy.get('#partnerEstimate')
        .nextAll('div')
        .contains(item.partnerOasResult.toLocaleString())
        .should('exist')

      if (item.partnerGisResult > 0) {
        cy.get('#partnerEstimate')
          .nextAll('div')
          .contains(item.partnerGisResult.toLocaleString())
          .should('exist')
      }

      if (item.oasEligible == true) {
        cy.get('#oas').next().contains('Eligible').should('exist')
      } else {
        cy.get('#oas').next().contains('Not eligible').should('exist')
      }

      if (item.oasDeferral) {
        // Check if the OAS deferral table exists
        cy.get('table[aria-label="Estimated deferral amounts Table"]').should(
          'exist'
        )
        // Check if the OAS deferral table contains the required data values
        cy.get('table[aria-label="Estimated deferral amounts Table"]').within(
          () => {
            item.oasDeferralAmounts.forEach((data) => {
              cy.contains(data.age)
              cy.contains(data.monthlyPayment.toFixed(2)) // Format the monthly payment to 2 decimal places for comparison
            })
          }
        )
      }

      if (item.gisEligible == true) {
        if (item.userGisResult > 0) {
          cy.get('#gis').next().contains('Eligible').should('exist')
        } else {
          cy.get('#gis').parent().parent()
            .contains('your income is too high')
            .should('exist')
        }
      } else {
        cy.get('#gis').next().contains('Not eligible').should('exist')
      }

      if (item.alwEligible) {
        cy.get('#alw').next().contains('Eligible').should('exist')
      } else {
        cy.get('#alw').next().contains('Not eligible').should('exist')
      }

      if (item.partnerAlwsEligible) {
        cy.get('#alws').next().contains('Eligible').should('exist')
      } else {
        cy.get('#alws').next().contains('Not eligible').should('exist')
      }
    })
  })
})

/**
 * Return month and year of birthday given the age.
 *
 * @param years
 * @returns
 */
const getBirthday = (years, months) => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  const totalMonths = years * 12 + months
  const birthYear = currentYear - Math.floor(totalMonths / 12)
  const birthMonth = currentMonth - (totalMonths % 12)

  const month = new Date();
  month.setMonth(birthMonth - 1);

  return {
    year: birthYear,
    month: month.toLocaleString('en-US', { month: 'long' })
  }
}

// Prevent TypeScript from reading file as legacy script
export {}
