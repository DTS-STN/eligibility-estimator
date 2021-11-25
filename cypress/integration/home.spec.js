/// <reference types="cypress" />

describe('home page loads', () => {
    beforeEach(() => {
      cy.visit('/')
    //   cy.injectAxe();
    })
  
    it('displays the index page', () => {
        cy.url().should("contains", "/");
    })

    it('Has no detectable a11y violations on load', () => {
        // cy.checkA11y()
    })
  })
  