const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config({path: './config.env'});  // To link the conn file for database connection purposes

const app = express();
const port = process.env.PORT;
app.use(express.json()); //middleware to understand json response
app.use(require('./router/routes.js'));  // To link the router file for routing purposes
app.use(cookieParser())
// listening the requests
app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})