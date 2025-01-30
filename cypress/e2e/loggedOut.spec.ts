/// <reference types="cypress" />

describe('Logged Out Page', () => {
  beforeEach(() => {
    cy.visit('/logged-out');
  });

  it('should display logged out message', () => {
    cy.get('h1').should('contain', 'You have successfully logged out.');
  });

  it('should navigate back to homepage', () => {
    cy.get('button[aria-label="Back to homepage"]').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
  });
});
