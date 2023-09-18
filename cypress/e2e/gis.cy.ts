//====
// UI Regression test to validate GIS variations
// for widowed scenarios and ineligible individuals.
//
// Author: Curtis Underwood
//====

import testData from '../fixtures/gisCases'
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

/* eslint-disable */
// Disable ESLint to prevent failing linting inside the Next.js repo.
// If you're using ESLint on your project, we recommend installing the ESLint Cypress plugin instead:
// https://github.com/cypress-io/eslint-plugin-cypress
beforeEach(() => {
  const username = "ep-be";
  const password = "estimator";
  cy.loginAndSaveSession(username, password);
  cy.visit('/en/questions')
  cy.viewport(1000, 1000)
})

/**
 * GIS Benefit Card Edge Case Results
 */
describe('GIS Benefit Card Results', () => {
  testData.forEach((item) => {
    it(`Test  ${item.testId}`, () => {
      
      //Fill Form
      cy.fillQuestionsForm(item)

      // Results Testing - English
      cy.window()
        .its('sessionStorage.inputs')
        .then((inputsData) => {
          // Perform assertions on the inputs data
          expect(inputsData).to.exist; // Ensure data is being successfully passed and navigation successful
          cy.url().should('contains', '/results');

          // Get Expected Results
          const inputHelper = new InputHelper(JSON.parse(inputsData), null, Language.EN);
          const mainHandler = new MainHandler(inputHelper.asObjectWithLanguage);
          const response: ResponseSuccess | ResponseError = mainHandler.results;

          // Perform checks on the English response
          checkGISResults(mainHandler.handler, response, item, Language.EN);
        });

      // Switch to French version of the page and re-run checks
      cy.getByData('lang1').click();
      cy.wait(1000)

      // Results Testing - French
      cy.window()
        .its('sessionStorage.inputs')
        .then((inputsData) => {
          // Perform assertions on the inputs data
          expect(inputsData).to.exist; // Ensure data is being successfully passed and navigation successful
          cy.url().should('contains', '/resultats');

          // Get Expected Results (French)
          const inputHelper = new InputHelper(JSON.parse(inputsData), null, Language.FR);
          const mainHandler = new MainHandler(inputHelper.asObjectWithLanguage);
          const response: ResponseSuccess | ResponseError = mainHandler.results;

          // Perform checks on the French response
          checkGISResults(mainHandler.handler, response, item, Language.FR);
        });

    })
  })
})

function runTextReplacements(handler, benefitResult, inputString) {
    let processedString = inputString;
    for (const ruleKey in textReplacementRules) {
      if (textReplacementRules.hasOwnProperty(ruleKey)) {
        const placeholder = `{${ruleKey}}`;
        
        if (processedString.includes(placeholder)) {
          //GIS Eligibility Age 65
          if(placeholder=="{EARLIEST_ELIGIBLE_AGE}"){
            processedString=processedString.replace(placeholder, "65");
          }else{
            const replacement = textReplacementRules[ruleKey](handler, benefitResult);
            processedString = processedString.replace(placeholder, replacement);
          }
        }
      }
    }
    
    processedString = processedString.replace(/&nbsp;|\xA0/g, ' ');
    processedString = processedString.replace(/<[^>]+>/g, '');
    processedString = processedString.replace(/<\/?[^>]+>/g, '');
    return processedString;
  }
  

function removeHtmlContent(text) {
  text = text.replace(/&nbsp;|\xA0/g, ' ');
  text = text.replace(/<[^>]+>/g, '');
  text = text.replace(/<\/?[^>]+>/g, '');

  return text;
}

// Function to perform checks on GIS Benefit Card Results
function checkGISResults(handler, response, item, language) {
    const gis = response.results.gis
    const lang = language === Language.FR ? fr : en;

    //Title
    cy.getByData('gis')
      .find('[data-cy="benefit-title"]')
      .should('exist')
      .contains(lang.benefit.gis);
  
    //Flag
    cy.getByData('gis')
      .find('[data-cy="eligibility-flag"]')
      .should('exist')
      .contains(removeHtmlContent(item.gisEligible[language]));
  
    //Detail
    item.gisDetail[language].forEach((index) => {
        cy.getByData('gis').find('[data-cy="benefit-detail"]').should('exist').contains(runTextReplacements(handler,response,index))
      });


    //Detail Estimate
    if(item.gisDetail.estimate){
        cy.getByData('gis').find('[data-cy="benefit-estimate"]').should('exist').should('not.include.text', 'null')
    }

    //Collapsed Text
    if(item.collapsedText){
      //For Each Collapsed Accordion
      item.collapsedText[language].forEach((index, step) => {
        cy.getByData('gis').find(`[data-cy="collapse-gis-${step}"]`).should('exist').contains(removeHtmlContent(index.object.heading)).click()
        if(index.estimate){
          //Estimate exists and is non-null
          cy.getByData('gis').find(`[data-cy="benefit-estimate"]`).should('exist').should('not.include.text', 'null')
        }else{
          cy.getByData('gis').find(`[data-cy="collapse-gis-${step}"]`).should('exist').contains(removeHtmlContent(index.object.text))
        }
      });
    }
  
    //Next Steps
    if (item.nextSteps) {
      cy.getByData('gis')
        .find('[data-cy="next-step-title"]')
        .should('exist')
        .contains(lang.nextStepTitle);
      //Content
      item.nextSteps[language].forEach((index) => {
        cy.getByData('gis').find('[data-cy="next-step-content"]').should('exist').contains(runTextReplacements(handler, response, index))
      });
      //Check Income Limit Display
      if(item.nextSteps.limit){
        cy.getByData('gis').find('[data-cy="next-step-limit"]').should('exist').should('not.include.text', 'null')
      }
    }
    
    //Links
    cy.getByData('gis')
      .find('[data-cy="benefit-links"]')
      .children()
      .should('have.length', gis.cardDetail.links.length);
    gis.cardDetail.links.forEach((link) => {
      cy.getByData('gis').find('[data-cy="benefit-links"]').contains(link.text);
    });
}

// Prevent TypeScript from reading file as legacy script
export {}