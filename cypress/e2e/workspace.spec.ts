/// <reference types="cypress" />

describe('Workspace Page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('button[aria-label="Login"]').click();
    cy.get('input[id="email-input"]').type('cypress@example.com');
    cy.get('input[id="password-input"]').type('Passwd123!');
    cy.get('button[aria-label="Login button"]').click();
    cy.url().should('include', '/dashboard');
    cy.visit('/workspace/7e87aedb-f779-495b-b9c4-c8c5360410f4'); // Adjust the URL as needed
  });

  it('should display workspace details', () => {
    cy.get('h1').should('contain', 'New Workspace Name');
    cy.get('p').should('contain', 'Created by:');
    cy.get('p').should('contain', 'Created at:');
    cy.get('p').should('contain', 'Last updated:');
    cy.get('p').should('contain', 'Visibility:');
  });

  it('should toggle edit mode for workspace name', () => {
    cy.get('button[aria-label="Edit Workspace Name"]').click();
    cy.get('input[name="name"]').should('exist');
    cy.get('input[name="name"]').clear();
    cy.get('input[name="name"]').type('New Workspace Name{enter}');
    cy.get('body').click(0, 0);
    cy.get('h1').should('contain', 'New Workspace Name');
  });

  it('should toggle edit mode for workspace description', () => {
    cy.get('button[aria-label="Edit Workspace Description"]').click();
    cy.get('input[name="description"]').should('exist');
    cy.get('input[name="description"]').clear();
    cy.get('input[name="description"]').type('New Description{enter}');
    cy.get('body').click(0, 0);
    cy.get('div.italic').should('contain', 'New Description');
  });

  it('should toggle edit mode for workspace visibility', () => {
    cy.get('button[aria-label="Edit Workspace Visibility"]').click();
    cy.get('button[aria-label="Workspace Visibility"]').click();
    cy.get('button[role="combobox"]'); //.click();
    cy.get('p').should('contain', 'Visibility: Private');
  });

  it('should display project boards', () => {
    cy.get('button[aria-label="Create New Project Board"]').should('exist');
    cy.get('table').should('exist');
  });
});
