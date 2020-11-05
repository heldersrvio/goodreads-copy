import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Authentication/SignUpPage.css';

const SignUpPage = (props) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const location = useLocation();

	const errorMessage =
		location.state !== undefined && location.state.error === 'name' ? (
			<span>Sorry, you must enter a name to sign up for Goodreads.</span>
		) : location.state !== undefined &&
		  location.state.error === 'email-missing' ? (
			<span>
				Sorry, you must enter an email address to sign up for Goodreads.
			</span>
		) : location.state !== undefined &&
		  location.state.error === 'email-exists' ? (
			<span>
				Sorry, that email has already been used to sign up for Goodreads.{' '}
				<a href="/user/sign_in">Sign in</a>
			</span>
		) : null;

	return (
		<div className="sign-in-up-page" id="sign-up-page">
			<a className="sign-in-up-page-home-link" href="/">
				<img
					src="https://www.goodreads.com/assets/layout/goodreads_logo_324-a908b923dc3ed9b7a13f3da4d1ffb2df.png"
					alt="Goodreads"
				/>
			</a>
			<div className="sign-in-up-page-main-card">
				<div className="sign-in-up-page-main-card-top">
					<h1>Sign up for Goodreads</h1>
					<span>
						Sign up to see what your friends are reading, get book
						recommendations, and join the world’s largest community of readers.
					</span>
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
				<p className="or-container" id="sign-up-or-container">
					<span className="or-span">or</span>
				</p>
				<h2 className="sign-up-with-email">Sign Up with Email</h2>
				{errorMessage !== null ? (
					<div id="wrong-email-password-message" className="sign-up-error">
						{errorMessage}
					</div>
				) : null}
				<form className="sign-in-up-page-main-card-center">
					<label htmlFor="sign-up-page-name">Name</label>
					<input
						type="text"
						className="sign-in-up-page-email"
						id="sign-up-page-name"
						placeholder="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					></input>
					<label htmlFor="sign-in-page-email">Email address</label>
					<input
						type="email"
						className="sign-in-up-page-email"
						id="sign-in-page-email"
						placeholder="you@yours.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					></input>
					<label htmlFor="sign-in-page-password">Password</label>
					<input
						type="password"
						className="sign-in-up-page-password"
						id="sign-in-page-password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					></input>
					<div
						className="sign-in-up-page-main-card-center-bottom-buttons"
						id="sign-up-card-bottom-buttons"
					>
						<button
							className="sign-in-up-page-sign-in"
							onClick={() => props.signUp(email, password, name)}
						>
							Sign up
						</button>
						<div
							className="sign-in-up-page-main-card-bottom"
							id="sign-up-page-already-member"
						>
							<span>Already a member?</span>
							<a href="/user/sign_in">Sign in</a>
						</div>
					</div>
					<div id="sign-up-page-main-card-bottom">
						<span>
							By clicking “Sign up” I confirm that I am at least 13 years of
							age.
						</span>
					</div>
				</form>
			</div>
			<div className="sign-in-up-page-bottom-section"></div>
		</div>
	);
};

export default SignUpPage;
