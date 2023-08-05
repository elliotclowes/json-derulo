const api = require("./api");
require("dotenv").config();
const port = process.env.PORT || 3000;

api.listen(port, () => {
  console.log(`API is listening on port ${port}.`);
});
