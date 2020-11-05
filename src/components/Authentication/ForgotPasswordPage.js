import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/Authentication/ForgotPasswordPage.css';

const ForgotPasswordPage = (props) => {
	const [email, setEmail] = useState('');

	return (
		<div className="sign-in-up-page" id="forgot-password-page">
			<a className="sign-in-up-page-home-link" href="/">
				<img
					src="https://www.goodreads.com/assets/layout/goodreads_logo_324-a908b923dc3ed9b7a13f3da4d1ffb2df.png"
					alt="Goodreads"
				/>
			</a>
			<div className="sign-in-up-page-main-card">
				<div className="sign-in-up-page-main-card-top">
					<h2>Reset your password.</h2>
				</div>
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
					<div className="sign-in-up-page-main-card-center-bottom-buttons">
						<button
							className="sign-in-up-page-sign-in"
							onClick={() => props.resetPassword(email)}
						>
							Reset password
						</button>
						<a className="sign-in-up-page-forgot-password" href="/user/sign_in">
							Cancel
						</a>
					</div>
				</form>
			</div>
			<div id="forgot-password-not-a-member">
				<span>Not a member?</span>
				<a className="sign-in-up-page-sign-in" href="/user/sign_up">
					Sign up
				</a>
			</div>
			<div className="sign-in-up-page-bottom-section"></div>
		</div>
	);
};

ForgotPasswordPage.propTypes = {
	resetPassword: PropTypes.func,
};

export default ForgotPasswordPage;
