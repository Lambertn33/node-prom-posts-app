import { defineConfig } from "cypress";
import { cleanDatabase } from "./cypress/support/db";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        async clearDB() {
          await cleanDatabase();
          return null;
        },
      });
    },
  },
});
