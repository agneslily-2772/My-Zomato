// import the mongoose
const mongoose = require('mongoose');


// create a schema
const Schema = mongoose.Schema;


// we need to declare the fields present in the collection
const MealTypeSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        meal_type: {
            type: Number,
            required: true
        }
    }
);

// create a model from schema, connect to mongoDB collection and export the model
module.exports = mongoose.model('Mealtype', MealTypeSchema, 'MealType');
