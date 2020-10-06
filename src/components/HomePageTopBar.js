import React, { useState } from 'react';
import PropTypes from 'prop-types';

const HomePageTopBar = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    return (
        <div id= "home-page-top-bar">
            <div id="home-page-top-bar-left">
                <a id="goodreads-home-link" href="/"><span></span></a>
            </div>
            <div id="home-page-top-bar-right">
                <form id="signin-form">
                    <div id="form-email">
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address"></input>
                        <label for="remember-me">Remember me</label>
                        <input id="remember-me" type="checkbox" value={rememberMe} onChange={() => setRememberMe(!rememberMe)}></input>
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