import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Firebase from '../../Firebase';
import '../styles/Authentication/SignInPage.css';

const SignInPage = (props) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(false);
	const history = useHistory();
	const location = useLocation();

	const errorMessage =
		location.state !== undefined && location.state.error !== undefined ? (
			<div id="wrong-email-password-message">
				<span>
					Sorry, that email or password isn't right. You can{' '}
					<a href={Firebase.pageGenerator.generateForgotPasswordPage()}>
						reset your password.
					</a>
				</span>
			</div>
		) : null;

	return (
		<div className="sign-in-up-page" id="sign-in-page">
			<a
				className="sign-in-up-page-home-link"
				href={Firebase.pageGenerator.generateHomePage()}
			>
				<img
					src="https://www.goodreads.com/assets/layout/goodreads_logo_324-a908b923dc3ed9b7a13f3da4d1ffb2df.png"
					alt="Goodreads"
				/>
			</a>
			<div className="sign-in-up-page-main-card">
				<div className="sign-in-up-page-main-card-top">
					<h1>Sign in to Goodreads</h1>
					<button
						id="continue-with-facebook"
						onClick={async () => {
							await Firebase.facebookSignIn();
							history.push({
								pathname: '/',
							});
						}}
					>
						<span className="facebook-icon"></span>
						<span className="continue-with-facebook-label">
							Continue with Facebook
						</span>
					</button>
					<div className="smaller-buttons">
						<button
							id="sign-in-with-twitter"
							onClick={async () => {
								await Firebase.twitterSignIn();
								history.push({
									pathname: '/',
								});
							}}
						>
							Sign in with Twitter
						</button>
						<button
							id="sign-in-with-google"
							onClick={async () => {
								await Firebase.googleSignIn();
								history.push({
									pathname: '/',
								});
							}}
						>
							Sign in with Google
						</button>
					</div>
				</div>
				<p className="or-container">
					<span className="or-span">or</span>
				</p>
				{errorMessage}
				<form className="sign-in-up-page-main-card-center">
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
					<div className="sign-in-up-page-checkbox-and-label">
						<input
							type="checkbox"
							className="sign-in-up-page-keep-in"
							id="sign-in-page-keep-in"
							value={rememberMe}
							onChange={() => setRememberMe(!rememberMe)}
						></input>
						<label htmlFor="sign-in-page-keep-in">Keep me signed in</label>
					</div>
					<div className="sign-in-up-page-main-card-center-bottom-buttons">
						<button
							className="sign-in-up-page-sign-in"
							onClick={async (e) => {
								e.preventDefault();
								await Firebase.passwordSignIn(
									email,
									password,
									rememberMe,
									history
								);
							}}
						>
							Sign in
						</button>
						<a
							className="sign-in-up-page-forgot-password"
							href={Firebase.pageGenerator.generateForgotPasswordPage()}
						>
							Forgot password
						</a>
					</div>
				</form>
				<div className="sign-in-up-page-main-card-bottom">
					<span>Not a member?</span>
					<a href={Firebase.pageGenerator.generateSignUpPage()}>Sign up</a>
				</div>
			</div>
			<div className="sign-in-up-page-bottom-section"></div>
		</div>
	);
};

export default SignInPage;
