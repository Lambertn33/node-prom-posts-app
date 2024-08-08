declare namespace Cypress {
  interface Chainable<Subject> {
    login(email: string, password: string): Chainable<any>;
  }

  interface Chainable<Subject> {
    signup(email: string, password: string): Chainable<any>;
  }

  interface Chainable<Subject> {
    db_cleanup(): Chainable<any>;
  }
}
