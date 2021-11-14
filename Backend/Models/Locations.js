// import the mongoose
const mongoose = require('mongoose');

// create a schema
const Schema = mongoose.Schema;

// we need to declare the fields present in the collection
const LocationSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        city_id: {
            type: Number,
            required: true
        },
        location_id: {
            type: Number,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        country_name: {
            type: String,
            required: true
        }
    }
);

// create a model from schema, connect to mongoDB collection and export the model
module.exports = mongoose.model('Location', LocationSchema, 'location');

