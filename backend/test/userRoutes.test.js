const request = require('supertest');
const app = require("../api")
const db = require("../database/db")
const setupTestDb = require('../database/setup-test-db');
const bcrypt = require("bcrypt");
const User = require("../models/Users")
const Token = require("../models/Token")


// Test getting all users
test('GET /user should return all users', async () => {
    const res = await request(app).get('/user');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('length');
});

// Test getting a user by ID
test('GET /user/:id should return a single user', async () => {
    const res = await request(app).get('/user/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', 1);
});


// Test error handling for getting a user by ID

test('GET /user/:id should handle user not found', async () => {
    const userId = 123;
    const res = await request(app).get(`/user/${userId}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', 'User not found.');
});


// Test updating a user
test('PUT /user/:id should update a user', async () => {
    const res = await request(app).put('/user/1').send({
        firstName: 'Updated',
        lastName: 'Name',
    });
    expect(res.statusCode).toEqual(202);
    expect(res.body).toHaveProperty('firstName', 'Updated');
});

// Test error handling for updating a user

test('PUT /user/:id should handle user not found', async () => {
    const userId = 123;

    const updatedUserData = {
        firstName: 'Updated',
        lastName: 'Name',
        email: 'updated@example.com',
        username: 'updatedusername',
        password: 'updatedpassword',
    };

    const res = await request(app)
        .put(`/user/${userId}`)
        .send(updatedUserData);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', 'User not found.');
});


// Test creating a user
test('POST /user should create a new user', async () => {
    const res = await request(app).post('/user/register').send({ "firstName": "John", "lastName": "Doe", "email": "john@example.com", "username": "johndoe", "password": "password" });
    expect(res.statusCode).toEqual(201);
});


// Test deleting a user
test('DELETE /user/:id should delete a user', async () => {
    const res = await request(app).delete('/user/3');
    expect(res.statusCode).toEqual(204);
});

// Test error handling for deleting a user

test('DELETE /user/:id should handle user not found', async () => {
    const userId = 123;

    const res = await request(app)
        .delete(`/user/${userId}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', 'User not found.');
});


// Test email
test('GET /email', async () => {
    const res = await request(app).get('/user/checkEmailToken/?token=d5e7d720-e5be-464b-9254-f6f94099ab6b');
    expect(res.statusCode).toEqual(302);
});

// Test getting user by username

test('GET /user/username should return a user by username', async () => {
    const username = 'elliot';
    const expectedUser = {
        id: 1,
        firstName: 'Elliot',
        lastName: 'Clowes',
        isVerified: true,
        email: 'hi@clowes.me',
        username: 'elliot',
        password: "$2b$10$ESylvA.25PVWUQQk/jLfd.FHiju/U.mxb4pnKxevyY0OYtj8dO3a6",
        "teacher": true
    };

    const res = await request(app)
        .get('/user/username')
        .send({ username });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expectedUser);
});

// Test error handling for getting a user by username

test('GET /user/username should handle user not found', async () => {
    const username = 'nonexistentuser';
    const res = await request(app)
        .get('/user/username')
        .send({ username });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', 'User not found.');
});

// Test getting a user by email

test('GET /user/email should return a user by email', async () => {
    const email = 'hi@clowes.me';
    const expectedUser = {
        id: 1,
        firstName: 'Elliot',
        lastName: 'Clowes',
        isVerified: true,
        email: 'hi@clowes.me',
        username: 'elliot',
        password: "$2b$10$ESylvA.25PVWUQQk/jLfd.FHiju/U.mxb4pnKxevyY0OYtj8dO3a6",
        "teacher": true
    };

    const res = await request(app)
        .get('/user/email')
        .send({ email });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expectedUser);
});

// Test error handling for getting a user by email

test('GET /user/email should handle user not found', async () => {
    const email = 'nonexistent@example.com';
    const res = await request(app)
        .get('/user/email')
        .send({ email });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', 'User not found.');
});


test('POST /user/register should handle registration error', async () => {
    const invalidRegistration = {
        firstName: '',
        lastName: '',
        email: 'invalidemail',
        username: '',
        password: 'invalidpassword',
    };

    const res = await request(app)
        .post('/user/register')
        .send(invalidRegistration);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
});

// Test login

test('POST /user/login should authenticate a user and return a token', async () => {

    const userData = {
        firstName: 'testuser',
        lastName: 'usertest',
        email: 'test@user.me',
        username: 'testuser',
        password: await bcrypt.hash('testpassword', 10),
    };
    await User.create(userData);

    const res = await request(app)
        .post('/user/login')
        .send({ username: 'testuser', password: 'testpassword' });


    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('authenticated', true);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('username', 'testuser');
    expect(res.body).toHaveProperty('token');
});

// Test error handling for incorrect password

test('POST /user/login should handle incorrect password', async () => {

    const userData = {
        firstName: 'testuser2',
        lastName: 'usertest2',
        email: 'test2@user.me',
        username: 'testuser2',
        password: await bcrypt.hash('testpassword', 10),
    };
    await User.create(userData);

    const res = await request(app)
        .post('/user/login')
        .send({ username: 'testuser', password: 'incorrectpassword' });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('error', 'Wrong username or password');
});

// Test error handling for non-existent user

test('POST /user/login should handle user not found', async () => {

    const res = await request(app)
        .post('/user/login')
        .send({ username: 'nonexistentuser', password: 'testpassword' });


    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('error', 'Username: Unable to locate user.');
});

//Test logout

test('GET /user/logout should log out a user and return success message', async () => {

    const userData = {
        firstName: 'testuser3',
        lastName: 'usertest3',
        email: 'test3@user.me',
        username: 'testuser3',
        password: await bcrypt.hash('testpassword', 10),
    };
    const user = await User.create(userData);
    const token = await Token.create(user.id);

    const res = await request(app)
        .get('/user/logout')
        .set('Authorization', token.token);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Logged out successfully.');
});


// Test error handling for invalid/missing token

// test('GET /user/logout should handle invalid token', async () => {

//     const userData = await request(app)
//         .post('/user/register')
//         .send({
//             firstName: 'testuser4',
//             lastName: 'usertest4',
//             email: 'test4@user.me',
//             username: 'test4',
//             password: 'password',
//         });

//     const loginResponse = await request(app)
//         .post('/user/login')
//         .send({
//             username: 'test4',
//             password: 'password',
//         });

//     const token = loginResponse.body.token;

//     const res = await request(app)
//         .get('/user/logout')
//         .set('Authorization', '');

//     expect(res.statusCode).toEqual(500);
//     expect(res.body).toHaveProperty('error', 'Unable to logout.');
// });


//Test invalid token should redirect to sign up page

test('GET /user/checkEmailToken should redirect to signup page on error', async () => {
    const fakeToken = 'invalidtoken';
    const res = await request(app).get(`/user/checkEmailToken/?token=${fakeToken}`);

    expect(res.statusCode).toEqual(302);
    expect(res.header.location).toContain('signup');
});


afterAll(async () => {
    await setupTestDb();
});