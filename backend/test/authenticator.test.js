const request = require('supertest');
const express = require('express');
const authenticator = require('../middleware/authenticator');
const Token = require('../models/Token');
const app = express();

// Mock Token.getOneByToken for testing
jest.mock('../models/Token');
Token.getOneByToken = jest.fn();

// Apply the authenticator middleware to a sample route
app.get('/test', authenticator, (req, res) => {
    res.status(200).json({ user: req.user });
});

describe('Authenticator Middleware', () => {
    test('should pass authentication and set user ID', async () => {
        const validToken = 'valid_token';

        // Mock Token.getOneByToken to resolve with user ID
        Token.getOneByToken.mockResolvedValue({ user_id: 123 });

        const response = await request(app)
            .get('/test')
            .set('Authorization', `Bearer ${validToken}`);

        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({ user: 123 });
    });

    test('should fail authentication and return 401', async () => {
        const invalidToken = 'invalid_token';

        // Mock Token.getOneByToken to reject with an error
        Token.getOneByToken.mockRejectedValue(new Error('User not authenticated'));

        const response = await request(app)
            .get('/test')
            .set('Authorization', `Bearer ${invalidToken}`);

        expect(response.statusCode).toEqual(401);
        expect(response.body).toEqual({ error: 'User not authenticated' });
    });
});
