describe('Liste des Produits - Test E2E avec Cypress et Angular Material MDC', () => {
    beforeEach(() => {
      // 1️⃣ Mock un faux token JWT bien formaté (Sans backend)
      const fakeToken = `${btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))}.${btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600, sub: "test-user" }))}.fake-signature`;
      // 2️⃣ Simule l'authentification
      localStorage.setItem('authToken', JSON.stringify({token: fakeToken}));
  
      // 3️⃣ Mock API : Intercepter et simuler la réponse de l'API des produits
      cy.intercept('GET', '**/api/products*', {
        statusCode: 200,
        delay: 500, // Simule une latence réseau
        body: {
          content: [
            { id: 1, name: 'Produit A', description: 'Description de Produit A', price: 19.99 },
            { id: 2, name: 'Produit B', description: 'Description de Produit B', price: 29.99 },
            { id: 3, name: 'Produit C', description: 'Description de Produit C', price: 39.99 },
            { id: 4, name: 'Produit D', description: 'Description de Produit D', price: 49.99 },
            { id: 5, name: 'Produit E', description: 'Description de Produit E', price: 59.99 }
          ],
          totalElements: 6,
          totalPages: 1,
          number: 0,
          size: 5
        },
      }).as('getProducts');
  
      // 4️⃣ Visiter la page des produits
      cy.visit('/products');
  
      // 5️⃣ Attendre que la requête des produits soit bien reçue
      cy.wait('@getProducts', { timeout: 5000 });

      // Mock API : Récupération d’un produit pour modification
      cy.intercept('GET', '**/api/products/1', {
        statusCode: 200,
        body: { id: 1, name: 'Produit A', description: 'Description de Produit A', price: 19.99 }
      }).as('getProduct');
  
      // 6️⃣ Vérifier que les lignes du tableau sont affichées
      cy.get('table.mat-mdc-table', { timeout: 500 }).should('exist');
      cy.get('tr.mat-mdc-row', { timeout: 500 }).should('have.length', 5);
    });
  
    it('Affiche la liste des produits avec prix', () => {
      // Vérifier que chaque produit contient un prix simulé
      cy.get('tr.mat-mdc-row').eq(0).find('td.mat-mdc-cell').eq(1).should('contain', '$19.99'); // Produit A
      cy.get('tr.mat-mdc-row').eq(1).find('td.mat-mdc-cell').eq(1).should('contain', '$29.99'); // Produit B
      cy.get('tr.mat-mdc-row').eq(2).find('td.mat-mdc-cell').eq(1).should('contain', '$39.99'); // Produit C
    });
  
    it('Teste la pagination', () => {
      cy.get('mat-paginator', { timeout: 500 }).should('be.visible');
  
      // Mock API pour la page suivante
      cy.intercept('GET', '**/api/products?page=1&size=5', {
        statusCode: 200,
        body: {
          content: [
            { id: 6, name: 'Produit F', description: 'Description de Produit F', price: 69.99 },
          ],
          totalElements: 6,
          totalPages: 2,
          number: 1,
          size: 5
        },
      }).as('getProductsPage2');
  
      // Cliquer sur le bouton "Suivant"
      cy.get('button[aria-label="Next page"]').click();
  
      // Attendre que la requête de la page 2 soit bien reçue
      cy.wait('@getProductsPage2', { timeout: 500 });
  
      // Vérifier que la nouvelle page affiche bien le produit
      cy.get('tr.mat-mdc-row', { timeout: 500 }).should('have.length', 1);
      cy.get('tr.mat-mdc-row').contains('Produit F');
    });
  
    it('Test le bouton Modifier', () => {
        // Vérifier que le bouton "Modifier" est bien visible avant de cliquer
        cy.get('tr.mat-mdc-row')
          .first()
          .find('button')
          .contains('Modifier')
          .should('be.visible')
          .click();
      
        // Attendre que la requête API soit bien interceptée
        cy.intercept('GET', '**/api/products/1').as('getProduct'); // <-- Ajout de l'alias ici
        cy.wait('@getProduct'); // <-- Attendre cette requête avant de continuer
      
        // Vérifier que l'URL a changé vers la page d'édition
        cy.location('pathname', { timeout: 5000 }).should('include', '/products/edit');
      
        // Vérifier que les champs du formulaire sont bien remplis avec les infos du produit
        cy.get('input[name="name"]').should('have.value', 'Produit A');
        cy.get('textarea[name="description"]').should('have.value', 'Description de Produit A');
        cy.get('input[name="price"]').should('have.value', '19.99');
      });
      
  
    it('Test le bouton Supprimer (Mock API)', () => {
        // Mock de la suppression d’un produit (Sans backend)
        cy.intercept('DELETE', '**/api/products/1', { statusCode: 200 }).as('deleteProduct');
      
        // Avant suppression, il y a bien 5 produits affichés
        cy.get('tr.mat-mdc-row').should('have.length', 5);
      
        // 🔥 Clic sur "Supprimer"
        cy.get('tr.mat-mdc-row').first().find('button').contains('Supprimer').click();
        cy.on('window:confirm', () => true);
      
        // Vérifier que la requête DELETE a bien été envoyée
        cy.wait('@deleteProduct');
      
        // Mock API après suppression (sans le premier produit)
        cy.intercept('GET', '**/api/products*', {
          statusCode: 200,
          body: {
            content: [
              { id: 2, name: 'Produit B', description: 'Description de Produit B', price: 29.99 },
              { id: 3, name: 'Produit C', description: 'Description de Produit C', price: 39.99 },
              { id: 4, name: 'Produit D', description: 'Description de Produit D', price: 49.99 },
              { id: 5, name: 'Produit E', description: 'Description de Produit E', price: 59.99 }
            ],
            totalElements: 4,
            totalPages: 1,
            number: 0,
            size: 4
          },
        }).as('getProductsAfterDelete');
      
        // Rafraîchir la liste des produits après suppression
        cy.reload();
        cy.wait('@getProductsAfterDelete');
      
        // Vérifier que le tableau a bien 4 lignes (Produit A supprimé)
        cy.get('tr.mat-mdc-row').should('have.length', 4);
      });      
  });
  