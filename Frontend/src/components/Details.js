import React, { Component } from 'react'
import Modal from 'react-modal';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import '../styles/details.css';
import axios from 'axios';
import queryString from 'query-string';
const { v4: uuidv4 } = require('uuid');

const API_URL = require('../contants').API_URL , BACKEND_URL = require('../contants').BACKEND_URL;

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        background: 'white',
        zIndex: 1000
    }
}

Modal.setAppElement('#root');


export default class Details extends Component {

    constructor() {
        super();
        this.state = {
            restaurant: null,
            menu: null,
            isMenuModalOpen: false,
            totalPrice: 0
        }
    }

    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const { id } = qs;
        axios
            .get(`${API_URL}/getRestaurantById/${id}`)
            .then(res => {
                this.setState({
                    restaurant: res.data.restaurant
                });
            })
            .catch(err => {
                console.log(err);
            });

        axios
            .get(`${API_URL}/getMenuByRestaurant/${id}`)
            .then(res => {
                this.setState({
                    menu: res.data.menu
                });
            })
            .catch(err => {
                console.log(err);
            });

    }

    openMenu = () => {
        this.setState({
            isMenuModalOpen: true
        });
    }

    closeMenu = () => {
        this.setState({
            isMenuModalOpen: false
        });
    }

    addItemHandler = (item) => {
        const { totalPrice } = this.state;
        this.setState({
            totalPrice: totalPrice + item.itemPrice
        })
    }

    isObj = (val) => {
        return typeof val === 'object';
    }

    isDate = (val) => {
        return Object.prototype.toString.call(val) === '[object Date]';
    }

    stringifyValue = (value) => {
        if (this.isObj(value) && !this.isDate(value)) {
            return JSON.stringify(value);
        } else {
            return value;
        }
    }

    buildForm = (details) => {
        const { action, params } = details;
        const form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', action);
        Object.keys(params).forEach(key => {
            const input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', key);
            input.setAttribute('value', this.stringifyValue(params[key]));
            form.appendChild(input);
        });
        return form;
    }

    postTheInformationTOPaytm = (info) => {
        const form = this.buildForm(info);
        document.body.appendChild(form);
        form.submit();
        form.remove();
    }

    getCheckSum = (data) => {
        return fetch(`${BACKEND_URL}/payment`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(data)
        }).then(result => {
            return result.json();
        }).catch(err => {
            console.log(err);
        })
    }

    paymentHandler = () => {
        const data = {
            amount: this.state.totalPrice,
            email: 'agneslily2772@gmail.com',
            mobileNo: '9999999999',
        };

        this.getCheckSum(data)
            .then(result => {
                let information = {
                    action: 'https://securegw-stage.paytm.in/order/process',
                    params: result
                }
                this.postTheInformationTOPaytm(information);
            })
            .catch(err => {
                console.log(err);
            })
    }

    render() {
        const { restaurant, menu, isMenuModalOpen, totalPrice } = this.state;
        return (
            <div className="container details">
            {
                restaurant
                ?
                <>
                    <div className="images">
                        <Carousel showThumbs={false}>
                            {
                                restaurant.thumb.map((item, index) => {
                                    return (
                                        <div>
                                            <img key={indexedDB} src={require('../' + item).default} alt="not found" />
                                        </div>
                                    )
                                })
                            }
                        </Carousel>
                    </div>
                    <div className="restName my-3">
                        { restaurant.name }
                        <button className="btn btn-danger float-end mt-4" onClick={this.openMenu}>Place Online Order</button>
                    </div>
                    <div className="myTabs mb-5">
                        <Tabs>
                            <TabList>
                                <Tab>Overview</Tab>
                                <Tab>Contact</Tab>
                            </TabList>
                            <TabPanel>
                                <div className="about my-5">About this place</div>
                                <div className="cuisine">Cuisine</div>
                                <div className="cuisines">
                                    {
                                        restaurant.cuisine.map((item, index) => {
                                            return <span key={index}>{ item.name },</span>
                                        })
                                    }
                                </div>
                                <div className="cuisine mt-3">Average Cost</div>
                                <div className="cuisines"> &#8377; { restaurant.min_price } for two people (approx.)</div>
                            </TabPanel>
                            <TabPanel>
                                <div className="cuisine my-5">Phone Number
                                    <div className="text-danger">{ restaurant.contact_number }</div>
                                </div>
                                <div className="cuisine mt-4">{ restaurant.name }</div>
                                <div className="text-muted mt-2">
                                    { restaurant.locality },
                                    <br/>
                                    { restaurant.city }
                                </div>
                            </TabPanel>
                        </Tabs>
                    </div>
                    <Modal isOpen={isMenuModalOpen} style={customStyles}>
                        <h2>
                            Menu
                            <button onClick={this.closeMenu} className="btn btn-outline-danger float-end">X</button>
                        </h2>
                        <h3>{ restaurant.name }</h3>
                        <ul className="menu">
                            {
                                menu
                                ?
                                menu.map((item, index) => {
                                    return (
                                        <li key={index}>
                                            <div className="row no-gutters menuItem">
                                                <div className="col-10">
                                                    {
                                                        item.isVeg
                                                        ?
                                                        <div className="text-success fs-6">Veg</div>
                                                        :
                                                        <div className="text-danger fs-6">Non-Veg</div>
                                                    }
                                                    <div className="cuisines">{ item.itemName }</div>
                                                    <div className="cuisines">&#8377;{ item.itemPrice }</div>
                                                    <div className="cuisines">{ item.itemDescription }</div>
                                                </div>
                                                <div className="col-2">
                                                    <button className="btn btn-light addButton" onClick={() => this.addItemHandler(item)}>Add</button>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })
                                :
                                null
                            }
                        </ul>
                        <div className="mt-3 restName fs-4">
                            Subtotal <span className="m-4">&#8377; { totalPrice }</span>
                            <button className="btn btn-danger float-end" onClick={this.paymentHandler}>Pay Now</button>
                        </div>
                    </Modal>
                </>
                :
                <div>Loading...</div>
            }
            </div>
        )
    }
}