/// <reference types="cypress" />
// ***********************************************

Cypress.Commands.add("db_cleanup", () => {
  cy.task("clearDB");
});

Cypress.Commands.add("signup", (email, password) => {
  return cy.request({
    method: "POST",
    url: "/signup",
    body: { email, password },
    failOnStatusCode: false,
  });
});

Cypress.Commands.add("login", (email, password) => {
  return cy.request({
    method: "POST",
    url: "/signin",
    body: { email, password },
    failOnStatusCode: false,
  });
});
