import React, { useState } from 'react';
import PropTypes from 'prop-types';
import HomePageTopBar from './HomePageTopBar';
import './styles/HomePageTopSection.css';

const HomePageTopSection = (props) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	return (
		<div id="homepage-top-section">
			<HomePageTopBar signIn={props.passwordSignIn} />
			<div id="new-user-presentation">
				<div id="headline">
					<img
						src="https://www.goodreads.com/assets/home/headline-e2cd420e71737ff2815d09af5b65c4e4.png"
						alt="Meet your next favorite book."
					></img>
				</div>
				<div id="new-account-section">
					<div id="create-new-account">
						<span>New here? Create a free account!</span>
						<input
							placeholder="Name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
						></input>
						<input
							placeholder="Email address"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						></input>
						<input
							placeholder="Password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						></input>
						<div id="sign-up-confirmation">
							<button id="sign-up-button" onClick={() => props.signUp(email, password, name)}>Sign up</button>
							<span>
								By clicking “Sign up” I confirm that I am at least 13 years old.
							</span>
						</div>
					</div>
					<div id="sign-in-sms">
						<span>or sign in using</span>
						<button id="facebook-button" onClick={props.facebookSignIn}>
							<span></span>
						</button>
						<button id="twitter-button" onClick={props.twitterSignIn}>
							<span></span>
						</button>
						<button id="google-button" onClick={props.googleSignIn}>
							<span></span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

HomePageTopSection.propTypes = {
	passwordSignIn: PropTypes.func,
	facebookSignIn: PropTypes.func,
	twitterSignIn: PropTypes.func,
	googleSignIn: PropTypes.func,
	signUp: PropTypes.func,
};

export default HomePageTopSection;
