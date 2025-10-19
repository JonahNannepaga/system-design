import request from 'supertest';
import app from '../../services/api-gateway/src/app'; // Adjust the path as necessary

describe('Username Availability Flow', () => {
    it('should return available for a new username', async () => {
        const response = await request(app)
            .get('/api/username/check')
            .query({ username: 'newuser123' });
        
        expect(response.status).toBe(200);
        expect(response.body.available).toBe(true);
    });

    it('should return taken for an existing username', async () => {
        const response = await request(app)
            .get('/api/username/check')
            .query({ username: 'existinguser' });
        
        expect(response.status).toBe(200);
        expect(response.body.available).toBe(false);
    });

    it('should suggest alternative usernames for a taken username', async () => {
        const response = await request(app)
            .get('/api/username/suggest')
            .query({ username: 'existinguser' });
        
        expect(response.status).toBe(200);
        expect(response.body.suggestions).toBeDefined();
        expect(response.body.suggestions.length).toBeGreaterThan(0);
    });

    it('should register a new username successfully', async () => {
        const response = await request(app)
            .post('/api/username/register')
            .send({ username: 'newuser123' });
        
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Username registered successfully');
    });
});