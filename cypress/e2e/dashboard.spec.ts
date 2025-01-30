/// <reference types="cypress" />

describe('Dashboard Page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('button[aria-label="Login"]').click();
    cy.get('input[id="email-input"]').type('cypress@example.com');
    cy.get('input[id="password-input"]').type('Passwd123!');
    cy.get('button[aria-label="Login button"]').click();
    cy.url().should('include', '/dashboard');
    cy.visit('/dashboard');
  });

  it('should display welcome message', () => {
    cy.get('h1').should('contain', 'Welcome,');
  });

  it('should display workspaces table', () => {
    cy.get('table').should('exist');
  });

  it('should open workspace popup', () => {
    cy.get('button[aria-label="Create New Workspace"]').click();
    cy.get('div[aria-label="Workspace Popup"]').should('exist');
  });

  it('should show toast message on workspace creation', () => {
    cy.get('button[aria-label="Create New Workspace"]').click();
    cy.get('input[id="workspace-name-input"]').type('New Workspace');
    cy.get('button[type="submit"]').click();
    cy.get('li[role="alert"]').should('contain', 'Workspace created');
  });
});
