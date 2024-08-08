/// <reference types="cypress" />

describe("Authentication tests", () => {
  beforeEach(() => {
    cy.db_cleanup();
  });
  it("should sign up the user", () => {
    cy.request("POST", "/signup", {
      email: "testuser@gmail.com",
      password: "testuser",
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property("user");
      expect(response.body.user).to.have.property(
        "email",
        "testuser@gmail.com"
      );
    });
  });
});
