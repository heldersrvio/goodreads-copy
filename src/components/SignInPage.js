import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './styles/SignInPage.css';

const SignInPage = (props) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(false);

	const errorMessage = props.error ? (
		<div id="wrong-email-password-message">
			<span>
				Sorry, that email or password isn't right. You can{' '}
				<a href="/user/forgot_password">reset your password.</a>
			</span>
		</div>
	) : null;

	return (
		<div id="sign-in-page">
			<a id="sign-in-page-home-link" href="/">
				<img
					src="https://www.goodreads.com/assets/layout/goodreads_logo_324-a908b923dc3ed9b7a13f3da4d1ffb2df.png"
					alt="Goodreads"
				/>
			</a>
			<div id="sign-in-page-main-card">
				<div id="sign-in-page-main-card-top">
					<h1>Sign in to Goodreads</h1>
					<button id="continue-with-facebook" onClick={props.facebookSignIn}>
						<span className="facebook-icon"></span>
						<span className="continue-with-facebook-label">
							Continue with Facebook
						</span>
					</button>
					<div className="smaller-buttons">
						<button id="sign-in-with-twitter" onClick={props.twitterSignIn}>
							Sign in with Twitter
						</button>
						<button id="sign-in-with-google" onClick={props.googleSignIn}>
							Sign in with Google
						</button>
					</div>
				</div>
				<p id="or-container">
					<span id="or-span">or</span>
				</p>
				{errorMessage}
				<form id="sign-in-page-main-card-center">
					<label htmlFor="sign-in-page-email">Email address</label>
					<input
						type="email"
						id="sign-in-page-email"
						placeholder="you@yours.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					></input>
					<label htmlFor="sign-in-page-password">Password</label>
					<input
						type="password"
						id="sign-in-page-password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					></input>
					<div id="sign-in-page-checkbox-and-label">
						<input
							type="checkbox"
							id="sign-in-page-keep-in"
							value={rememberMe}
							onChange={() => setRememberMe(!rememberMe)}
						></input>
						<label htmlFor="sign-in-page-keep-in">Keep me signed in</label>
					</div>
					<div id="sign-in-page-main-card-center-bottom-buttons">
						<button
							id="sign-in-page-sign-in"
							onClick={() => props.passwordSignIn(email, password, rememberMe)}
						>
							Sign in
						</button>
						<a id="sign-in-page-forgot-password" href="/user/forgot_password">
							Forgot password
						</a>
					</div>
				</form>
				<div id="sign-in-page-main-card-bottom">
					<span>Not a member?</span>
					<a href="/user/sign_up">Sign up</a>
				</div>
			</div>
			<div id="sign-in-page-bottom-section"></div>
		</div>
	);
};

SignInPage.propTypes = {
	error: PropTypes.bool,
	passwordSignIn: PropTypes.func,
	facebookSignIn: PropTypes.func,
	twitterSignIn: PropTypes.func,
	googleSignIn: PropTypes.func,
};

export default SignInPage;
