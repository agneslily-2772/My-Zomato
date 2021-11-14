// need the router from the express
const express = require('express');
const router = express.Router();

// import the controllers
const locationController = require('../Controllers/Locations');
const restaurantsController = require('../Controllers/Restaurants');
const mealtypesController = require('../Controllers/Mealtypes');
const userController = require('../Controllers/Users');
const paymentController = require('../Controllers/Payments');
const menuController = require('../Controllers/Menu');


// declare the routes and bind to the controller methods
router.get('/getAllRestaurants', restaurantsController.getAllRestaurants);
router.get('/getRestaurantsByLocation/:cityName', restaurantsController.getAllRestaurantsByLocation);
router.get('/getRestaurantById/:restaurantId', restaurantsController.getRestaurantById);
router.post('/filterRestaurants', restaurantsController.filterRestaurants);
router.get('/getAllLocations', locationController.getAllLocations);
router.get('/getAllMealTypes', mealtypesController.getAllMealTypes);
router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.post('/payment', paymentController.payments);
router.post('/paymentCallback', paymentController.paymentsCallback);
router.get('/getMenuByRestaurant/:restaurantId', menuController.getMenuForRestaurant)


// export the router
module.exports = router;