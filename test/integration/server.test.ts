import request from 'supertest';
import { app, Shutdown } from '../../src/server';

describe('The Server File', () => {
    afterAll((done) => {
        Shutdown(done);
    });

    it('Starts and has the proper test environment', async () => {
        expect(process.env.NODE_ENV).toBe('test');
        expect(app).toBeDefined();
    }, 1000);

    it('Returns all options allowed when called from the HTTP method options', async () => {
        const response = await request(app).options('/');
        expect(response.status).toBe(200);
        expect(response.headers['access-control-allow-methods']).toBe('PUT, POST, PATCH, DELETE, GET');
    });
});
