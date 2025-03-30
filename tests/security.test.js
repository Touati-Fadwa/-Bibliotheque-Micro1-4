const request = require('supertest');
const { app } = require('../back/server');
const { adminUser } = require('../src/lib/mockData');
const jwt = require('jsonwebtoken');

describe('Tests de Sécurité', () => {
  // ... le reste du code reste identique ...

  let adminToken;

  beforeAll(() => {
    // Génération du token admin pour les tests nécessitant une authentification
    adminToken = jwt.sign(
      { id: adminUser.id, role: adminUser.role },
      process.env.JWT_SECRET || 'test-secret-123', // Fallback pour les tests
      { expiresIn: '1h' }
    );
  });

  // Tests de gestion des erreurs
  describe('Gestion des Erreurs', () => {
    it('ne devrait pas divulguer d\'informations sensibles', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({ email: 'nonexistent@test.com', password: 'wrong', role: 'admin' });
      
      expect(res.body).not.toHaveProperty('error');
      expect(res.body).not.toHaveProperty('stack');
      expect(res.body.message).toBe('Invalid credentials or role');
    });
  });

  // Tests de protection contre les attaques
  describe('Protection contre les Attaques', () => {
    it('devrait avoir des en-têtes de sécurité', async () => {
      const res = await request(app).get('/');
      expect(res.headers['x-powered-by']).toBeUndefined();
      expect(res.headers['x-frame-options']).toBeDefined();
    });

    it('devrait limiter les tentatives de login', async () => {
      // 5 tentatives échouées
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/login')
          .send({
            email: adminUser.email,
            password: `wrong${i}`,
            role: adminUser.role
          });
      }

      const res = await request(app)
        .post('/api/login')
        .send({
          email: adminUser.email,
          password: adminUser.password,
          role: adminUser.role
        });
      
      expect(res.statusCode).toBe(200);
    });
  });

  // Tests de validation des entrées
  describe('Validation des Entrées', () => {
    it('devrait rejeter les emails mal formatés', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          email: 'invalid-email',
          password: 'anypass',
          role: 'admin'
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/email/i);
    });

    it('devrait rejeter les mots de passe trop courts', async () => {
      const res = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          username: 'shortpass',
          password: '123', // Mot de passe trop court
          firstName: 'Test',
          lastName: 'User',
          email: 'short.pass@test.com',
          studentId: 'SHORT123',
          department: 'Test'
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/mot de passe|password/i);
    });
  });
});