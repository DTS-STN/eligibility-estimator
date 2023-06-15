/* eslint-disable */
// Disable ESLint to prevent failing linting inside the Next.js repo.
// If you're using ESLint on your project, we recommend installing the ESLint Cypress plugin instead:
// https://github.com/cypress-io/eslint-plugin-cypress



beforeEach(() => {
  cy.visit('/')
  cy.get('input[name="username"]').type('ep-be')
  cy.get('input[name="password"]').type('estimator')
  cy.get('button').click()
})

describe('app page loads', () => {
  it('displays the index page', () => {
    cy.location('pathname').should('equal', '/')
  })

  it('redirects to / when accessing /fr', () => {
    cy.visit('/fr')
    cy.location('pathname').should('equal', '/fr')
  })

  it('has no detectable a11y violations on load', () => {
    cy.injectAxe()
    cy.wait(500)
    cy.checkA11y()
  })
})

// Prevent TypeScript from reading file as legacy script
export {}
