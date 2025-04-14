// Import des dépendances nécessaires
const bcrypt = require('bcrypt'); // Pour le hachage des mots de passe
const jwt = require('jsonwebtoken'); // Pour la génération de tokens JWT
const { pool } = require('../back/server.js'); // Import de la connexion pool (sera mocké)
const { adminUser, studentUsers, books, borrowedBooks } = require('../src/lib/mockData');


/**
 * Mock de server.js pour isoler les tests
 * - Remplace la vraie connexion DB par un mock
 * - Mock aussi l'application Express pour éviter les conflits de port
 */
jest.mock('../back/server.js', () => ({
  pool: {
    // Mock de la méthode query qui retourne une promesse résolue avec des données fictives
    query: jest.fn().mockResolvedValue({
      rows: [{ now: new Date().toISOString() }] // Données simulées de la DB
    })
  },
  app: {
    // Mock de la méthode listen pour éviter de démarrer un vrai serveur
    listen: jest.fn((port, cb) => cb()) // Appelle immédiatement le callback
  }
}));

// Suite de tests unitaires
describe('Tests Unitaires', () => {
  
  // Configuration avant tous les tests
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret-123'; // Définit un secret pour JWT
  });

  // Tests de hachage de mot de passe
  describe('Password Hashing', () => {
    it('valide mot de passe', async () => {
      // 1. Hash du mot de passe
      const hashed = await bcrypt.hash(adminUser.password, 10);
      // 2. Vérification que le mot de passe correspond au hash
      expect(await bcrypt.compare(adminUser.password, hashed)).toBe(true);
    });
  });

  // Tests de génération de token JWT
  describe('JWT', () => {
    it('génère token valide', () => {
      // Génération d'un token avec l'id admin
      const token = jwt.sign({ id: adminUser.id }, process.env.JWT_SECRET);
      // Vérification que le token est bien généré
      expect(token).toBeDefined();
    });
  });

  // Tests de connexion à la base de données (mockée)
  describe('Database', () => {
    it('simule connexion', async () => {
      // Exécution d'une requête mockée
      const res = await pool.query('SELECT NOW()');
      // Vérification que la réponse contient bien des données
      expect(res.rows).toBeDefined();
    });
  });
});