const request = require('supertest');
const app = require("../api");
const db = require("../database/db")
const Token = require("../models/Token");
const User = require("../models/Users");



describe("TokenController", () => {

    jest.mock("../models/Token");
    Token.getOneByToken = jest.fn();

    jest.mock("../models/Users");
    User.getById = jest.fn();

    // Test should return user by token

    test('POST / should return user by token', async () => {
        const token = "valid_token";
        const userObj = { id: 1, username: "testuser" };
        Token.getOneByToken.mockResolvedValue({ user_id: userObj.id });
        User.getById.mockResolvedValue(userObj);

        const res = await request(app)
            .post('/token')
            .set('Authorization', 'Bearer ${token}')
            .send({ token: token });


        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(userObj);
    });

    // Test should handle token not found

    // test('POST / should handle token not found', async () => {
    //     const invalidToken = "invalid_token";

    //     Token.getOneByToken.mockRejectedValue(new Error("Token not found."));

    //     const res = await request(app)
    //         .post('/token')
    //         .set('Authorization', 'Bearer ${invalidToken}')
    //         .send({ token: invalidToken })

    //     expect(res.statusCode).toEqual(404);
    //     expect(res.body).toEqual({ error: "Token not found." });
    // });


    afterEach(() => {
        jest.clearAllMocks();
    });

});

describe("Token model", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test creating a new token
    // test('create should create and return a new token', async () => {
    //     const userId = 1;
    //     const fakeResponse = {
    //         rows: [{
    //             token_id: 1,
    //             user_id: userId,
    //             token: "fake_token"
    //         }]
    //     };

    //     db.query = jest.fn().mockResolvedValue(fakeResponse);

    //     const createdToken = await Token.create(userId);

    //     expect(createdToken).toBeDefined();
    //     expect(createdToken.token_id).toEqual(1);
    //     expect(createdToken.user_id).toEqual(userId);
    //     expect(createdToken.token).toEqual("fake_token");
    // });

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
        expect(retrievedToken.token).toEqual("fake_token");
    });

    // Test getting a token by valid token

    // test('getOneByToken should return a token by valid token', async () => {
    //     const validToken = "validToken"
    //     const tokenId = 1;
    //     const fakeResponse = {
    //         rows: [{
    //             token_id: tokenId,
    //             user_id: 1,
    //             token: "fake_token"
    //         }]
    //     };

    //     db.query = jest.fn().mockResolvedValue(fakeResponse);

    //     const retrievedToken = await Token.getOneByToken(validToken);

    //     expect(retrievedToken).toBeDefined();
    //     expect(retrievedToken.token_id).toEqual(tokenId);
    //     expect(retrievedToken.user_id).toEqual(1);
    //     expect(retrievedToken.token).toEqual("fake_token");
    // });


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
            expect(error.message).toEqual("Unable to locate token.");
        }
    });

    // Test deleting a token
    test('deleteByToken should delete a token', async () => {
        const tokenToDelete = "token_to_delete";

        db.query = jest.fn().mockResolvedValue();

        await Token.deleteByToken(tokenToDelete);

        expect(db.query).toHaveBeenCalledWith("DELETE FROM tokens WHERE token = $1", [tokenToDelete]);
    });

})


