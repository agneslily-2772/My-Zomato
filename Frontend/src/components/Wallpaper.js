import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios';
const API_URL = require('../contants').API_URL;

class Wallpaper extends Component {

    constructor() {
        super();
        this.state = {
            restaurants: [],
            text: '',
            suggestions: []
        }
    }


    getRestaurantsForLocation = (event) => {
        const locationId = event.target.value;
        const selectedLocation = this.props.locations.find(item => item.location_id == parseInt(locationId));
        const city_id = selectedLocation.city_id;
        const city_name = selectedLocation.city;
        localStorage.setItem('city_id', city_id);
        axios
            .get(`${API_URL}/getRestaurantsByLocation/${city_name}`)
            .then(res => {
                this.setState({
                    restaurants: res.data.restaurants
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    onSearchTextChange = (event) => {
        const searchText = event.target.value;
        const { restaurants } = this.state;
        let suggestions = [];
        if (searchText.length > 0) {
            suggestions = restaurants.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
        }
        this.setState({
            text: searchText,
            suggestions: suggestions || []
        });
    }

    renderSuggestions = () => {
        const { suggestions } = this.state;
        if (suggestions.length == 0) {
            return null;
        }
        return (
            <ul className="suggestionsBox"> 
                {
                    suggestions.map((item, index) => {
                        return (
                            <li key={index} className="suggestionItem" onClick={() => this.navigateToRestaurant(item)}>
                                <div className="suggestionImage">
                                    <img src={require('../' + item.image).default} alt="not found" />
                                </div>
                                <div className="suggestionText">
                                    <div className="suggestionTextName">
                                        { item.name }
                                    </div>
                                    <div className="suggestionTextLocality">
                                        { item.locality }
                                    </div>
                                </div>
                                <div className="orderButton text-danger">
                                    Order Now
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        )
    }

    navigateToRestaurant = (rest) => {
        this.props.history.push(`/details?id=${rest._id}`);
    }

    render() {
        const { locations } = this.props;
        return (
            <React.Fragment>
                <div className="topSection">
                    <img src={require("../Assets/home.png").default} alt="Image not found" className="heroImage" />
                    <div className="branding">
                        <div className="logo">e<span className="logo-internal">!</span></div>
                        <div className="tagline">Find the best restaurants, cafe's and bars</div>
                    </div>
                    <div className="search-options">
                        <select className="location-selection" onChange={this.getRestaurantsForLocation}>
                            <option valu="">-- Select City --</option>
                            {
                                locations.map((item, index) => {
                                    return <option key={index} value={item.location_id}>{item.name}, {item.city}</option>
                                })
                            }
                        </select>
                        <div className="searchSection">
                            <input className="search-box" type="text" placeholder="Search for restaurants..." onChange={this.onSearchTextChange} />
                            {
                                this.renderSuggestions()
                            }
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default withRouter(Wallpaper);