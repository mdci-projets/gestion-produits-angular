import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4300',
    supportFile: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });
    },
    defaultCommandTimeout: 1000,  // Augmente le temps d'attente par défaut
    viewportWidth: 1280,           // Définit une taille standard
    viewportHeight: 800,
    video: false,                  // Désactive l'enregistrement vidéo pour plus de rapidité
  },

  component: {
    devServer: {
      framework: "angular",
      bundler: "webpack",
    },
    specPattern: "**/*.cy.ts",
  },
});
