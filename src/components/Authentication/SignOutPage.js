import React from 'react';
import '../styles/Authentication/SignOutPage.css';

const SignOutPage = () => {
	return (
		<div className="sign-in-up-page" id="sign-out-page">
			<a className="sign-in-up-page-home-link" href="/">
				<img
					src="https://www.goodreads.com/assets/layout/goodreads_logo_324-a908b923dc3ed9b7a13f3da4d1ffb2df.png"
					alt="Goodreads"
				/>
			</a>
			<div className="sign-in-up-page-main-card">
				<div
					className="sign-in-up-page-main-card-top"
					id="sign-out-main-card-top"
				>
					<span>You've been signed out.</span>
					<a href="/">Goodreads Home</a>
				</div>
				<p className="or-container" id="sign-out-or-container">
					<span className="or-span">or</span>
				</p>
				<div id="sign-out-page-bottom">
					<a href="/user/sign_in">Sign in again</a>
				</div>
			</div>
			<div className="sign-in-up-page-bottom-section"></div>
		</div>
	);
};

export default SignOutPage;
