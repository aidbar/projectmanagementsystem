/// <reference types="cypress" />

describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display welcome message', () => {
    cy.get('h1').should('contain', 'Welcome to the Project Management System!');
  });

  it('should open login popup', () => {
    cy.get('button[aria-label="Login"]').click();
    cy.get('div[aria-label="Login Popup"]').should('exist');
  });

  it('should open signup popup', () => {
    cy.get('button[aria-label="Sign Up"]').click();
    cy.get('div[aria-label="Signup Popup"]').should('exist');
  });

  it('should navigate to dashboard after login', () => {
    cy.get('button[aria-label="Login"]').click();
    cy.get('input[id="email-input"]').type('cypress@example.com');
    cy.get('input[id="password-input"]').type('Passwd123!');
    cy.get('button[aria-label="Login button"]').click();
    cy.url().should('include', '/dashboard');
  });
});
