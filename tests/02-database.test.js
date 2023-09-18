const request = require('supertest');
const app = require('../app');
const client = require('../app/database/connexion');

afterAll(async () => {
    await client.quit();
});

describe('it should connect to database', () => {
    it('Should return PONG from redis', async () => {
        const data = await request(app)
            .get('/api/test')
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(data.body.message).toMatchObject({
            pong: 'PONG',
        });
    });
});
