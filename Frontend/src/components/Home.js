import React, { Component } from 'react'
import '../styles/home.css';
import Wallpaper from './Wallpaper';
import QuickSearches from './QuickSearches';
import axios from 'axios';
const API_URL = require('../contants').API_URL;

export default class Home extends Component {

    constructor() {
        super();
        this.state = {
            locations: [],
            mealtypes: []
        }
    }

    componentDidMount() {
        // to get all locations 
        axios
            .get(`${API_URL}/getAllLocations`)
            .then(res => {
                this.setState({
                    locations: res.data.locations
                });
            })
            .catch(err => {
                console.log(err);
            });

        // to get all mealtypes 
        axios
            .get(`${API_URL}/getAllMealTypes`)
            .then(res => {
                this.setState({
                    mealtypes: res.data.mealtypes
                });
            })
            .catch(err => {
                console.log(err);
            });

    }

    render() {
        const { locations, mealtypes } = this.state;
        return (
            <React.Fragment>
                <Wallpaper locations={locations} />
                <QuickSearches mealtypes={mealtypes} />
            </React.Fragment>
        )
    }
}