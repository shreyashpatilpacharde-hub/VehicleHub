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