// to use environment variables
require("dotenv").config();

// framework (-> express)
const express = require("express");

// mongoose to connect to mongoDB
const mongoose = require("mongoose");

// microservices
const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publications = require("./API/Publication");

// initialising express
const bookAPI = express();

// configurations
bookAPI.use(express.json());

// establishing database connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => console.log("Connection established!"));

/*

*************************API****************************

*/

// ----------------     BOOKS      -----------------

bookAPI.use("/book", Books);

// ----------------     AUTHORS      -----------------

bookAPI.use("/author", Authors);

// ----------------     PUBLICATIONS      -----------------

bookAPI.use("/publication", Publications);

// Port to listen
bookAPI.listen(3000, () => console.log("Server is running")
);