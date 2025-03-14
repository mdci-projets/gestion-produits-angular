/// <reference types="cypress" />

context('Actions', () => {
    beforeEach(() => {
        cy.visit('/login'); // Charge la page login
    });

    describe('Authentification', () => {
        it('devrait permettre à l’utilisateur de se connecter', () => {
            // Simule une API de login réussie
            cy.intercept('POST', 'http://localhost:8080/auth/login', {
                statusCode: 200,
                body: { token: 'fake-jwt-token' }
            }).as('loginRequest');

            cy.wait(1000); // ✅ Attendre un peu
            cy.get('input[name="username"]').type('admin@test.com', { force: true });
            cy.get('input[name="password"]').type('password123', { force: true });

            cy.get('button[type="submit"]').click({ force: true });
            cy.wait('@loginRequest'); // Attendre que la requête API soit interceptée

            cy.wait(100); // Attendre la redirection
            cy.url().should('include', '/'); // Vérifier la redirection
        });

        it('devrait afficher une erreur en cas d’identifiants invalides', () => {
            // Simule une API qui retourne une erreur
            cy.intercept('POST', 'http://localhost:8080/auth/login', {
                statusCode: 400,
                body: {
                    error: 'Validation failed',
                    message: 'Invalid username or password'
                }
            }).as('loginFailed');

            cy.get('input[name="username"]').type('mauvais@test.com', { delay: 100 });
            cy.get('input[name="password"]').type('wrongpass', { delay: 100 });

            cy.get('button[type="submit"]').click();
            cy.wait('@loginFailed'); // Attendre que la requête API soit interceptée

            // Vérifie que le message s'affiche dans le MatSnackBar
            cy.get('.mat-mdc-snack-bar-container', { timeout: 5000 }).should('be.visible');
            cy.contains('.mat-mdc-snack-bar-container', 'Invalid username or password').should('be.visible');
        });
    });
});
