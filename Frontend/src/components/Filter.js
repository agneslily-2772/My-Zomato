import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import '../styles/filter.css';
import axios from 'axios';
import queryString from 'query-string';
const API_URL = require('../contants').API_URL;

class Filter extends Component {

    constructor() {
        super();
        this.state = {
            mealType: '',
            mealTypeId: 0,
            locations: [],
            selectedCityName: '',
            locationsInCity: [],
            selectedLocation: '',
            pageNo: 1,
            restaurantList: [],
            totalResults: 0,
            noOfPages: 0,
            cuisines: [],
            hCost: undefined,
            lCost: undefined,
            sortOrder: 1
        }
    }

    componentDidMount() {
        // capture the restaurant id from the query params from the URL
        const qs = queryString.parse(this.props.location.search);
        const { mealType, mealTypeId } = qs;

        this.setState({
            mealType,
            mealTypeId,
        });
        const city_id = localStorage.getItem('city_id');


        // make API call to get the list of locations and filter by city_id
        axios
            .get(`${API_URL}/getAllLocations`)
            .then(res => {
                const locations = res.data.locations;
                const selectedCity = locations.find(city => city.city_id == city_id);
                const selectedCityLocations = locations.filter(city => city.city_id == city_id);
                this.setState({
                    locations: res.data.locations,
                    selectedCityName: selectedCity.city,
                    locationsInCity: selectedCityLocations,
                    selectedLocation: selectedCityLocations[0].location_id,
                });
                setTimeout(() => this.filterRestaurants(), 0);
            })
            .catch(err => {
                console.log(err);
            });

    }

    filterRestaurants() {
        // logic to filter the restaurants
        const {
            mealTypeId,
            selectedLocation,
            cuisines,
            hCost,
            lCost,
            sortOrder,
            pageNo
        } = this.state;

        // make API call to filter the restaurant
        const req = {
            mealtype: mealTypeId, 
            location: selectedLocation,
            page: pageNo
        };

        if (cuisines.length > 0) {
            req.cuisine = cuisines;
        }

        if (hCost != undefined && lCost != undefined) {
            req.lcost = lCost;
            req.hcost = hCost;
        }

        if (sortOrder != undefined) {
            req.sort = sortOrder;
        }

        axios({
            method: 'POST',
            url: `${API_URL}/filterRestaurants`,
            headers: { 'Content-Type': 'application/json' },
            data: req
        }).then(result => {
            const totalResults = result.data.totalResultsCount;
            const pageSize = result.data.pageSize;
            const noOfPages = Math.ceil((totalResults/pageSize));
            this.setState({
                pageNo: result.data.pageNo,
                restaurantList: result.data.restaurants,
                totalResults: totalResults,
                noOfPages: noOfPages
            });
        }).catch(err => {
            console.log(err);
        });
    }

    handleLocationChange = (e) => {
        const location_id = e.target.value;
        this.setState({
            selectedLocation: location_id
        });
        setTimeout(() => this.filterRestaurants(), 0);
    }

    handleCuisineChange = (e, cuisine) => {
        let { cuisines } = this.state;
        const index = cuisines.indexOf(cuisine);
        if (index < 0 && e.target.checked) {
            cuisines.push(cuisine);
        } else {
            cuisines.splice(index, 1);
        }
        this.setState({
            cuisines: cuisines
        });
        setTimeout(() => this.filterRestaurants(), 0);
    }

    handleCostChange = (e, lCost, hCost) => {
        this.setState({
            hCost: hCost,
            lCost: lCost,
        });
        setTimeout(() => this.filterRestaurants(), 0);
    }

    handleSortChange = (e, sortOrder) => {
        this.setState({
            sortOrder: sortOrder
        })
        setTimeout(() => this.filterRestaurants(), 0);
    }

    handlePageChange = (page) => {
        if (page < 1) return;
        this.setState({
            pageNo: page
        });
        setTimeout(() => this.filterRestaurants(), 0);
    }

    goToRestaurant = (restaurant) => {
        const url = `/details?id=${restaurant._id}`;
        this.props.history.push(url);
    }

    getPages = () => {
        const { noOfPages } = this.state;
        let pages = [];
        for (let i = 0; i < noOfPages; i++) {
            pages.push(
                <div key={i} className="pagination-button" onClick={() => this.handlePageChange(i + 1)}>{ i + 1}</div>
            )
        }
        return pages;
    }

    render() {
        const {
            mealType,
            selectedCityName,
            locationsInCity,
            pageNo,
            restaurantList
        } = this.state;
        let currPage = pageNo;
        return (
            <React.Fragment>
                <div className="container-fluid no-padding filter-layout">
                    <div className="container">
                        <div className="heading">{mealType} Places in {selectedCityName}</div>
                        <div className="row">
                            <div className="leftSection col-xl-3 col-lg-4 col-md-5">
                                <div className="filterSection">
                                    <div className="filter-heading">Filters</div>
                                    <div className="filter-subheading">Select Location</div>
                                    <select className="filter-location" onChange={(e) => this.handleLocationChange(e)}>
                                        <option valu="">-- Select Location --</option>
                                        {
                                            locationsInCity.map((item, index) => {
                                                return <option key={index} value={item.location_id}>{item.name}</option>
                                            })
                                        }
                                    </select>
                                    <div className="filter-subheading">Cuisine</div>
                                    <div>
                                        <input type="checkbox" className="filter-cuisine" name="cuisine" onChange={(e) => this.handleCuisineChange(e, 'North Indian')} /><span className="filter-cuisine">North Indian</span>
                                    </div>
                                    <div>
                                        <input type="checkbox" className="filter-cuisine" name="cuisine" onChange={(e) => this.handleCuisineChange(e, 'South Indian')} /><span className="filter-cuisine">South Indian</span>
                                    </div>
                                    <div>
                                        <input type="checkbox" className="filter-cuisine" name="cuisine" onChange={(e) => this.handleCuisineChange(e, 'Chinese')} /><span className="filter-cuisine">Chinese</span>
                                    </div>
                                    <div>
                                        <input type="checkbox" className="filter-cuisine" name="cuisine" onChange={(e) => this.handleCuisineChange(e, 'Fast Food')} /><span className="filter-cuisine">Fast Food</span>
                                    </div>
                                    <div>
                                        <input type="checkbox" className="filter-cuisine" name="cuisine" onChange={(e) => this.handleCuisineChange(e, 'Street Food')} /><span className="filter-cuisine">Street Food</span>
                                    </div>

                                    <div className="filter-subheading">Cost For Two</div>
                                    <input type="radio" className="filter-cuisine" name="cost" onChange={(e) => this.handleCostChange(e, 0, 500)} /> Less than &#8377; 500
                                    <br/>
                                    <input type="radio" className="filter-cuisine" name="cost" onChange={(e) => this.handleCostChange(e, 500, 1000)} /> &#8377; 500 to &#8377; 1000
                                    <br/>
                                    <input type="radio" className="filter-cuisine" name="cost" onChange={(e) => this.handleCostChange(e, 1000, 1500)} /> &#8377; 1000 to &#8377; 1500
                                    <br/>
                                    <input type="radio" className="filter-cuisine" name="cost" onChange={(e) => this.handleCostChange(e, 1500, 2000)} /> &#8377; 1500 to &#8377; 2000
                                    <br/>
                                    <input type="radio" className="filter-cuisine" name="cost" onChange={(e) => this.handleCostChange(e, 2000, 100000)} /> &#8377; 2000+

                                    <div className="filter-heading">Sort</div>
                                    <input type="radio" className="filter-cuisine" name="sort" onChange={(e) => this.handleSortChange(e, 1)} /> Price low to high
                                    <br/>
                                    <input type="radio" className="filter-cuisine" name="sort" onChange={(e) => this.handleSortChange(e, -1)} /> Price high to low
                                </div>
                            </div>
                            <div className="rightSection col-xl-9 col-lg-8 col-md-7">
                                <div className="resultSection">

                                    {
                                        restaurantList.length > 0
                                        ?
                                        restaurantList.map((item, index) => {
                                            return (
                                                <div key={index} onClick={() => this.goToRestaurant(item)} className="result">
                                                    <div className="result-top row">
                                                        <div className="col-xl-2 col-lg-3 col-md-4">
                                                            <img src={require('../Assets/breakfast.png').default} className="result-image" alt="not found" />
                                                        </div>
                                                        <div className="col-xl-10 col-lg-9 col-md-8">
                                                            <div className="result-header">{item.name}</div>
                                                            <div className="result-subheader">{item.locality}</div>
                                                            <div className="result-address">{item.city}</div>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                    <div className="result-bottom row">
                                                        <div className="col-xl-2 col-lg-3 col-md-4">
                                                            <div className="result-details">CUISINES:</div>
                                                            <div className="result-details">COST FOR TWO:</div>
                                                        </div>
                                                        <div className="col-xl-10 col-lg-9 col-md-8">
                                                            <div className="result-values">
                                                                {
                                                                    item.cuisine.map((c, i) => {
                                                                        return `${c.name}`;
                                                                    })
                                                                }
                                                            </div>
                                                            <div className="result-values">&#8377; {item.min_price}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                        :
                                        <div className="text-danger text-center my-5">No Results Found</div>
                                    }
                                    {
                                        restaurantList.length > 0
                                        ?
                                        <div className="mypagination">
                                            <div className="pagination-button" onClick={() => this.handlePageChange(--currPage)}>&#8592;</div>
                                            {
                                                this.getPages()
                                            }
                                            <div className="pagination-button" onClick={() => this.handlePageChange(++currPage)}>&#8594;</div>
                                        </div>
                                        :
                                        null
                                    }
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default withRouter(Filter);