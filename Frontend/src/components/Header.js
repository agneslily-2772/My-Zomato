import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

import '../styles/header.css';
const API_URL = require('../contants').API_URL;

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '450px'
    }
}

Modal.setAppElement('#root');

class Header extends Component {

    constructor() {
        super();
        this.state = {
            backgroundStyle: '',
            isLoginModalOpen: false,
            isSignupModalOpen: false,
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            user: undefined,
            isLoggedIn: false,
            loginError: undefined,
            signUpError: undefined
        }
    }

    componentDidMount() {
        const initialPath = this.props.history.location.pathname;
        this.setHeaderStyle(initialPath);
        this.props.history.listen((location, action) => {
            this.setHeaderStyle(location.pathname);
        })
    }
    
    setHeaderStyle = (path) => {
        let bg = '';
        if (path == '/' || path == '/home') {
            bg = 'transparent';
        } else {
            bg = 'coloured';
        }
        this.setState({
            backgroundStyle: bg
        });
    }

    navigate = (path) => {
        this.props.history.push(path);
    }

    openLoginModal = () => {
        this.setState({
            isLoginModalOpen: true
        });
    }

    closeLoginModal = () => {
        this.setState({
            isLoginModalOpen: false
        });
    }

    loginHandler = () => {
        const { username, password } = this.state;
        const req = {
            username: username,
            password: password
        }
        axios({
            method: 'POST',
            url: `${API_URL}/login`,
            headers: { 'Content-Type': 'application/json' },
            data: req
        }).then(result =>  {
            const user = result.data.user;
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("isLoggedIn", true);
            this.setState({
                user: user,
                isLoggedIn: true,
                loginError: undefined,
                isLoginModalOpen: false
            });
        }).catch(err => {
            this.setState({
                isLoggedIn: false,
                loginError: "Username or password is wrong"
            })
        });
    }

    cancelLoginHanlder = () => {
        this.closeLoginModal();
    }

    openSignupModal = () => {
        this.setState({
            isSignupModalOpen: true
        });
    }

    closeSignupModal = () => {
        this.setState({
            isSignupModalOpen: false
        });
    }

    signupHandler = () => {
        const { username, password, firstName, lastName } = this.state;
        const req = {
            email: username,
            password: password,
            firstName: firstName,
            lastName: lastName
        }
        axios({
            method: 'POST',
            url: `${API_URL}/signup`,
            headers: { 'Content-Type': 'application/json' },
            data: req
        }).then(result =>  {
            const user = result.data.user;
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("isLoggedIn", true);
            this.setState({
                user: user,
                isLoggedIn: true,
                signUpError: undefined,
                isSignupModalOpen: false
            });
        }).catch(err => {
            this.setState({
                isLoggedIn: false,
                signUpError: "Error Signing up"
            })
        });
    }

    cancelSignupHanlder = () => {
        this.closeSignupModal();
    }

    logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        this.setState({
            user: undefined,
            isLoggedIn: false
        });
    }

    handleChange = (e, field) => {
        const val = e.target.value;
        this.setState({
            [field]: val,
            loginError: undefined,
            signUpError: undefined
        })
    }

    faceBookLogin = (e) => {
        debugger

        // TODO: Learner Task to continue with the login or Signup flow
    }

    googleLogin = (e) => {
        debugger

        // TODO: Learner Task to continue with the login or Signup flow
    }

    render() {
        const { backgroundStyle, isLoginModalOpen, isSignupModalOpen, username, password, firstName, lastName, loginError, signUpError, isLoggedIn, user } = this.state;
        return (
            <React.Fragment>
                <div className="app-header" style={{ 'background': backgroundStyle == 'transparent' ? 'transparent' : '#eb2929'  }}>
                    <div className="container">
                        <div className="row">
                            <div className="logoSection col-6">
                                {
                                    backgroundStyle == 'transparent'
                                    ?
                                    null
                                    :
                                    <div className="logo-small" onClick={() => this.navigate('/home')}>e!</div>
                                }
                            </div>
                            <div className="loginSection col-6">
                                {
                                    isLoggedIn 
                                    ?
                                    <>
                                        <span className="text-white m-4">{user.firstName}</span>
                                        <button className="loginButton" onClick={this.logout}>Logout</button>
                                    </>
                                    :
                                    <>
                                        <button className="loginButton" onClick={this.openLoginModal}>Login</button>
                                        <button className="createAccountButton" onClick={this.openSignupModal}>Create an account</button>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <Modal isOpen={isLoginModalOpen} style={customStyles}>
                    <h2>
                        Login
                        <button onClick={this.closeLoginModal} className="btn btn-outline-danger float-end">X</button>
                    </h2>
                    <form className="mt-4">
                        { loginError ? <div className="alert alert-danger text-center my-3">{loginError}</div> : null }
                        <input className="form-control" type="text" placeholder="Email" required value={username} onChange={(e) => this.handleChange(e, 'username')}/>
                        <input className="form-control my-3" type="password" placeholder="Password" required value={password} onChange={(e) => this.handleChange(e, 'password')}/>
                        <div className="text-center">
                            <input type="button" className="btn btn-primary m-2" onClick={this.loginHandler} value="Login" />
                            <button className="btn" onClick={this.cancelLoginHanlder}>Cancel</button>
                        </div>
                        <div className="mt-4">
                            <FacebookLogin 
                                appId="203XXXXXXXXX261"
                                textButton="Continue with Facebook"
                                autoLoad={true}
                                fields="name,email,picture"
                                callback={this.faceBookLogin}
                                icon="fa-facebook"
                                cssClass="my-facebook-button-class"
                            />
                            <GoogleLogin 
                                clientId="SSSSXXXXXXXXXXXXXXX.apps.googleusercontent.com"
                                buttonText="Continue with Google"
                                onSuccess={this.googleLogin}
                                onFailure={this.googleLogin}
                                cookiePolicy={'single_host_origin'}
                                cssClass="my-google-button-class"
                                className="my-google-button-class"
                            />
                        </div>
                    </form>
                </Modal>
                <Modal isOpen={isSignupModalOpen} style={customStyles}>
                    <h2>
                        Signup
                        <button onClick={this.closeSignupModal} className="btn btn-outline-danger float-end">X</button>
                    </h2>
                    <form className="mt-4">
                        { signUpError ? <div className="alert alert-danger text-center my-3">{signUpError}</div> : null }
                        <input className="form-control" type="text" placeholder="Email" required value={username} onChange={(e) => this.handleChange(e, 'username')}/>
                        <input className="form-control my-3" type="password" placeholder="Password" required value={password} onChange={(e) => this.handleChange(e, 'password')}/>
                        <input className="form-control my-3" type="text" placeholder="Firstname" required value={firstName} onChange={(e) => this.handleChange(e, 'firstName')}/>
                        <input className="form-control my-3" type="text" placeholder="Lastname" required value={lastName} onChange={(e) => this.handleChange(e, 'lastName')}/>
                        <div className="text-center">
                            <input type="button" className="btn btn-primary m-2" onClick={this.signupHandler} value="Signup" />
                            <button className="btn" onClick={this.cancelSignupHanlder}>Cancel</button>
                        </div>
                        <div className="mt-4">
                            <FacebookLogin 
                                appId="203XXXXXXXXX261"
                                textButton="Continue with Facebook"
                                autoLoad={true}
                                fields="name,email,picture"
                                callback={this.faceBookLogin}
                                icon="fa-facebook"
                                cssClass="my-facebook-button-class"
                            />
                            <GoogleLogin 
                                clientId="SSSSXXXXXXXXXXXXXXX.apps.googleusercontent.com"
                                buttonText="Continue with Google"
                                onSuccess={this.googleLogin}
                                onFailure={this.googleLogin}
                                cookiePolicy={'single_host_origin'}
                                cssClass="my-google-button-class"
                                className="my-google-button-class"
                            />
                        </div>
                    </form>
                </Modal>
            </React.Fragment>
        )
    }
}

//export default Header;

export default withRouter(Header);