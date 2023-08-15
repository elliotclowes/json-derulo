const request = require('supertest');
const app = require("../api");
const db = require("../database/db");
const Token = require("../models/Token");
const User = require("../models/Users");

describe("TokenController", () => {
    jest.mock("../models/Token");
    Token.getOneByToken = jest.fn();

    jest.mock("../models/Users");
    User.getById = jest.fn();

    // Test should return user by token
    test('GET / should return user by token', async () => {
        console.log('Test case is being executed');
        const token = "valid_token";
        const userObj = { id: 1, username: "testuser" };
        Token.getOneByToken.mockResolvedValue({ user_id: userObj.id });
        User.getById.mockResolvedValue(userObj);

        console.log(`Requesting with token: ${token}`);

        const res = await request(app)
            .get(`/token/get/${token}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ token: token });

        expect(res.statusCode).toEqual(200);

        // Extract the user id from the response
        const userId = res.body.user_id;

        // Mock the getById function to return the userObj
        User.getById.mockResolvedValue(userObj);

        // Fetch the userObj using the retrieved userId
        const retrievedUser = await User.getById(userId);

        expect(retrievedUser).toEqual(userObj);

        console.log('Response', res.body);
    });

    // Test should handle token not found
    test('GET / should handle token not found', async () => {
        const invalidToken = "invalid_token";

        Token.getOneByToken.mockRejectedValue(new Error("Token not found."));

        const res = await request(app)
            .get(`/token/get/${invalidToken}`)
            .set('Authorization', `Bearer ${invalidToken}`)
            .send({ token: invalidToken });

        expect(res.statusCode).toEqual(404);
    });


    // Test for getAllToken
    test('GET / should return all tokens', async () => {
        const mockTokens = [
            new Token({ token_id: 1, user_id: 1, token: "token_1" }),
            new Token({ token_id: 2, user_id: 2, token: "token_2" })
        ];
        Token.getAll = jest.fn().mockResolvedValue(mockTokens);

        const res = await request(app).get('/token');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockTokens);
    });

    // Test for getTokenById
    test('GET /:id should return token by ID', async () => {
        const tokenId = 1;
        const mockToken = new Token({ token_id: tokenId, user_id: 1, token: "token_1" });
        Token.getOneById = jest.fn().mockResolvedValue(mockToken);

        const res = await request(app).get(`/token/${tokenId}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockToken);
    });

    // Test for getOneByToken
    test('GET /get/:token should return token by token', async () => {
        const tokenValue = "valid_token";
        const mockToken = new Token({ token_id: 1, user_id: 1, token: tokenValue });
        Token.getOneByToken = jest.fn().mockResolvedValue(mockToken);

        const res = await request(app).get(`/token/get/${tokenValue}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockToken);
    });

    // Test for handling token not found
    test('GET /get/:token should handle token not found', async () => {
        const invalidToken = "invalid_token";
        Token.getOneByToken = jest.fn().mockRejectedValue(new Error("Token not found."));

        const res = await request(app).get(`/token/get/${invalidToken}`);

        expect(res.statusCode).toEqual(404);
    });
});

afterEach(() => {
    jest.clearAllMocks();
});






describe("Token model", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test getting a token by ID
    test('getOneById should return a token by ID', async () => {
        const tokenId = 1;
        const fakeResponse = {
            rows: [{
                token_id: tokenId,
                user_id: 1,
                token: "fake_token"
            }]
        };
        db.query = jest.fn().mockResolvedValue(fakeResponse);

        const retrievedToken = await Token.getOneById(tokenId);

        expect(retrievedToken).toBeDefined();
        expect(retrievedToken.token_id).toEqual(tokenId);
        expect(retrievedToken.user_id).toEqual(1);
        expect(retrievedToken.token).toEqual("token_1");
    });

    // Test getting a token by invalid token value
    test('getOneByToken should throw an error for invalid token value', async () => {
        const invalidToken = "invalid_token";
        const fakeResponse = {
            rows: []
        };
        db.query = jest.fn().mockResolvedValue(fakeResponse);

        try {
            await Token.getOneByToken(invalidToken);
        } catch (error) {
            expect(error.message).toEqual("Token not found.");
        }
    });

    // Test deleting a token
    test('deleteByToken should delete a token', async () => {
        const tokenToDelete = "token_to_delete";
        db.query = jest.fn().mockResolvedValue();

        await Token.deleteByToken(tokenToDelete);

        expect(db.query).toHaveBeenCalledWith("DELETE FROM tokens WHERE token = $1", [tokenToDelete]);
    });
});

