import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './styles/HomePageTopBar.css';

const HomePageTopBar = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    return (
        <div id= "home-page-top-bar">
            <div id="home-page-top-bar-left">
                <a id="goodreads-home-link" href="/"><img src="https://www.goodreads.com/assets/home/header_logo-8d96d7078a3d63f9f31d92282fd67cf4.png" alt="Goodreads logo"></img></a>
            </div>
            <div id="home-page-top-bar-right">
                <form id="signin-form">
                    <div id="form-email">
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address"></input>
                        <div>
                            <input id="remember-me" type="checkbox" value={rememberMe} onChange={() => setRememberMe(!rememberMe)}></input>
                            <label htmlFor="remember-me">Remember me</label>
                        </div>
                    </div>
                    <div id="form-password">
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"></input>
                        <a id="forgot-password-a" href="/reset-password">Forgot it?</a>
                    </div>
                    <button id="sign-in-button" onClick={() => props.signIn(props.email, props.password, props.rememberMe)}>Sign In</button>
                </form>
            </div>
        </div>
    );
};

HomePageTopBar.propTypes = {
    signIn: PropTypes.func,
};

export default HomePageTopBar;