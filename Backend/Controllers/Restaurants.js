// import the model
const Restaurant = require('../Models/Restaurants');


// export the below controller functionality


// get all the restaurant
exports.getAllRestaurants = (req, res) => {
    Restaurant.find().then(result => {
        res.status(200).json({
            message: "Restaurants fetched",
            restaurants: result
        });
    }).catch(error => {
        res.status(500).json({
            message: "Error in Database",
            error: error
        });
    });
}

// get all the restaurants by location
exports.getAllRestaurantsByLocation = (req, res) => {
    const cityName = req.params.cityName;
    Restaurant.find({
        city: cityName
    }).then(result => {
        res.status(200).json({
            message: `Restaurants fetched for city ${cityName}`,
            restaurants: result
        });
    }).catch(error => {
        res.status(500).json({
            message: "Error in Database",
            error: error
        });
    });
}

// get restaurant by id
exports.getRestaurantById = (req, res) => {
    const restId = req.params.restaurantId;
    Restaurant.find({
        _id: restId
    }).then(result => {
        res.status(200).json({
            message: `Restaurant fetched for Id ${restId}`,
            restaurant: result[0]
        });
    }).catch(error => {
        res.status(500).json({
            message: "Error in Database",
            error: error
        });
    });
}

// filter the restaurants based on mealtype, location, cuisine, lcost, hcost, sort, page
exports.filterRestaurants = (req, res) => {
    const {
        mealtype, 
        location, 
        cuisine, 
        lcost, 
        hcost, 
        sort, 
        page = 1
    } = req.body;

    let filters = {};

    // add logic to apply filters

    if (mealtype) {
        filters.mealtype_id = mealtype;
    }

    if (location) {
        filters.location_id = location;
    }

    if (cuisine && cuisine.length > 0) {
        filters['cuisine.name'] = {
            $in: cuisine
        }
    }

    if (hcost && lcost) {
        if (lcost == 0) {
            filters.min_price = {
                $lt: hcost
            }
        } else {
            filters.min_price = {
                $gt: lcost,
                $lt: hcost
            }
        }
    }


    Restaurant.find(filters).sort({ min_price: sort }).then(result => {

        // Assignment: 6 write a logic to paginate the results:
        /*
        -> suppose after filtering we get 5 results.
        -> but as per out design we only show 2 results on one page.
        -> which means
            for page no 1 : I need to show the first two results i.e.  result[0] and result[1]
            for page no 2 : I need to show the 3rd and 4th results i.e.  result[2] and result[3]
            for page no 3 : I need to show the 5th and the final result i.e.  result[4]
        */

        const pageSize = 2;
        let tempArray = [];

        function paginate(arr, page_size, page_no) {
            let paginatedResult = [];
            // Learner Task: TODO: Logic, use array slice method on arr
            // we will use slice method
            /*
                example: page_size: 2, page_no: 4
                arr.slice((4 - 1) * 2, 4 * 2); 
                arr.slice(6, 8); //  arr[6], arr[7]
            */
            paginatedResult = arr.slice((page_no - 1) * page_size, page_no * page_size);  
            return paginatedResult;
        }

        tempArray = paginate(result, pageSize, page);

        res.status(200).json({
            message: `Filtered Restaurants fetched`,
            restaurants: tempArray,
            totalResultsCount: result.length,
            pageNo: page,
            pageSize: pageSize
        });
    }).catch(error => {
        res.status(500).json({
            message: "Error in Database",
            error: error
        });
    });

}

