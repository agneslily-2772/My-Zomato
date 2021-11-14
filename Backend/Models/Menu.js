// import the mongoose
const mongoose = require('mongoose');

// create a schema
const Schema = mongoose.Schema;

// we need to declare the fields present in the collection
const MenuSchema = new Schema(
    {
        restaurantId: {
            type: String,
            required: true
        },
        itemPrice: {
            type: Number,
            required: true
        },
        itemName: {
            type: String,
            required: true
        },
        itemDescription: {
            type: String,
            required: true
        },
        isVeg: {
            type: Boolean,
            required: true
        }
    }
);

// create a model from schema, connect to mongoDB collection and export the model
module.exports = mongoose.model('Menu', MenuSchema, 'menu');

