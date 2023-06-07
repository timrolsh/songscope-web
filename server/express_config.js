const cookieParser = require("cookie-parser");
const express = require("express");
const root_path = require("./root_path");
const server = express();
// root path of this project
const rootPath = require("./root_path");

// if we decide to use bootstrap add it as a dependancy and
// // bootstrap files path
// server.use("/bootstrap", express.static(`${root_path}/node_modules/bootstrap`));
// static files routes for the frontend
server.use(express.static(`${rootPath}/frontend`));

// json middleware to parse post request JSON bodies from clients
server.use(express.urlencoded({extended: false}));
server.use(express.json());

// cookie parser
server.use(cookieParser());

module.exports = server;
