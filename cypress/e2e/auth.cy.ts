/// <reference types="cypress" />

describe("Authentication tests", () => {
  before(() => {
    cy.db_cleanup();
  });

  it("should sign up the user", () => {
    cy.signup("testuser@gmail.com", "testuser").then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property("user");
      expect(response.body.user).to.have.property(
        "email",
        "testuser@gmail.com"
      );
    });
  });

  it("should give an error if the user already exists", () => {
    cy.signup("testuser@gmail.com", "testuser").then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property(
        "message",
        "user with such email exists"
      );
    });
  });

  it("should sign in the user", () => {
    cy.login("testuser@gmail.com", "testuser").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("token");
      expect(response.body).to.have.property("user");
    });
  });

  it("should give an error on wrong credentials", () => {
    cy.login("testuser@gmail.com", "testuser2").then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property(
        "message",
        "Invalid email or password"
      );
      expect(response.body).to.not.have.property("token");
    });
  });
});
