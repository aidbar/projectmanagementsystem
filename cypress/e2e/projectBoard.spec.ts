/// <reference types="cypress" />

describe('Project Board Page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('button[aria-label="Login"]').click();
    cy.get('input[id="email-input"]').type('cypress@example.com');
    cy.get('input[id="password-input"]').type('Passwd123!');
    cy.get('button[aria-label="Login button"]').click();
    cy.url().should('include', '/dashboard');
    cy.visit('/project-board/e5353bda-9873-4992-a0ad-8533daf125ce'); // Adjust the URL as needed
  });

  it('should display project board details', () => {
    cy.get('h1').should('contain', 'Project Board Name');
    cy.get('p').should('contain', 'Created at:');
    cy.get('p').should('contain', 'Last updated:');
    cy.get('p').should('contain', 'Visibility:');
  });

  it('should toggle edit mode for project board name', () => {
    cy.get('button[aria-label="Edit Project Board Name"]').click();
    cy.wait(1000);
    cy.get('input[name="name"]').should('exist');
    cy.wait(1000);
    cy.get('input[name="name"]').clear();
    cy.wait(1000);
    cy.get('input[name="name"]').type('New Project Board Name{enter}');
    cy.get('body').click(0, 0);
    cy.get('h1').should('contain', 'New Project Board Name');
  });

  it('should toggle edit mode for project board description', () => {
    cy.get('button[aria-label="Edit Project Board Description"]').click();
    cy.get('input[name="description"]').should('exist');
    cy.get('input[name="description"]').clear();
    cy.get('input[name="description"]').type('New Description{enter}');
    cy.get('body').click(0, 0);
    cy.get('div.italic').should('contain', 'New Description');
  });

  it('should toggle edit mode for project board visibility', () => {
    cy.get('button[aria-label="Edit Project Board Visibility"]').click();
    cy.get('button[aria-label="Project Board Visibility"]').click();
    cy.get('button[role="combobox"]'); //.contains('Private').click();
    cy.get('p').should('contain', 'Visibility: Private');
  });

  it('should display kanban board', () => {
    cy.get('div[id="kanban-board"]').should('exist');
  });
});
