const request = require('supertest');
const app = require("../api");
const Token = require("../models/Token");
const User = require("../models/Users");
const authenticator = require("../middleware/authenticator")


describe("Authenticator function", () => {

    jest.mock("../models/Token");
    Token.getOneByToken = jest.fn();

    jest.mock("../models/Users");
    User.getById = jest.fn();

    test('POST / should handle authentication error', async () => {
        const invalidToken = "invalid_token";

        Token.getOneByToken.mockRejectedValue(new Error("User not authenticated"));

        const res = await request(app)
            .post('/token')
            .set('Authorization', `Bearer ${invalidToken}`)
            .send({ token: invalidToken });

        expect(res.statusCode).toEqual(401);
        expect(res.body).toEqual({ error: "User not authenticated" });
    });


})