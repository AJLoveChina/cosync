#! /usr/bin/env node
let arguments = process.argv.splice(2);


var index = require("../index")
index(arguments[0]);