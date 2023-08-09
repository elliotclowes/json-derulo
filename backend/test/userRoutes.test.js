const request = require('supertest');
const app = require("../api")
const db = require("../database/db")
const setupTestDb = require('../database/setup-test-db');


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

// Test updating a user
test('PUT /user/:id should update a user', async () => {
    const res = await request(app).put('/user/1').send({
      firstName: 'Updated',
      lastName: 'Name',
    });
    expect(res.statusCode).toEqual(202);
    expect(res.body).toHaveProperty('firstName', 'Updated');
});

// Test creating a user
test('POST /user should create a new user', async () => {
    const res = await request(app).post('/user/register').send({"firstName":"John","lastName":"Doe","email":"john@example.com","username":"johndoe","password":"password"});
    expect(res.statusCode).toEqual(201);
  });


// Test deleting a user
test('DELETE /user/:id should delete a user', async () => {
    const res = await request(app).delete('/user/3');
    expect(res.statusCode).toEqual(204);
});


// Test email
test('GET /email', async () => {
    const res = await request(app).get('/user/checkEmailToken/?token=d5e7d720-e5be-464b-9254-f6f94099ab6b');
    expect(res.statusCode).toEqual(302);
});





afterAll(async () => {
    await setupTestDb();
});
