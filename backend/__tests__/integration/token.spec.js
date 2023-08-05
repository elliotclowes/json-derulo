// const request = require("supertest")
// const app = require("../../api")
// const db = require("../../database/db")

// describe("Token", () => {
//     let api
//     let token
//     let token_id
//     let user_id

//     beforeAll(async () => {
//         api = app.listen(5003, () => {
//             console.log("Test server running on port 5003")
//         })
//     })

//     afterAll(async () => {
//         console.log("Stopping test server")
//         db.end()
//         await api.close()
//     })

//     //GET ONE BY TOKEN
//     it("should return token with provided token", async () => {
//         let data = {
//             username: "anthony",
//             password: "123"
//         }
//         let response = await request(app)
//             .post("/user/login")
//             .send(data)

//         data = {
//             token: response.body.token
//         }
//         response = await request(app)
//             .get(`/token`)
//             .send(data)
//             .expect(200)
//     })

// })
