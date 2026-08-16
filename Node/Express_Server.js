const express = require("express");
const Joi = require('joi');

const schema = Joi.object({
    name: Joi.string().min(3).required(),
    age: Joi.number().min(18).required()
});

const data = { name: "Yuvraj", age: 18};

const { error, value } = schema.validate(data);

if(error) {
    console.log(error.details[0].message);
}
else {
    console.log("Validation successful:",value);
}

var {add,sub}=require("./test");
var addition=add(2,3);
console.log("Addition : "+addition);
console.log("subtraction : "+sub(5,2));


const app = express();

app.get("/", (req, res) => {
    res.send("Welcome to express!");
});

app.listen(3000, () => {
    console.log("Server Started");
});