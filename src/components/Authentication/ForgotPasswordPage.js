import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Firebase from '../../Firebase';
import '../styles/Authentication/ForgotPasswordPage.css';

const ForgotPasswordPage = (props) => {
	const history = useHistory();
	const [email, setEmail] = useState('');

	return (
		<div className="sign-in-up-page" id="forgot-password-page">
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
							onClick={async () => {
								await Firebase.resetPassword(email);
								history.push({
									pathname: '/user/sign_in',
								});
							}}
						>
							Reset password
						</button>
						<a
							className="sign-in-up-page-forgot-password"
							href={Firebase.pageGenerator.generateSignInPage()}
						>
							Cancel
						</a>
					</div>
				</form>
			</div>
			<div id="forgot-password-not-a-member">
				<span>Not a member?</span>
				<a
					className="sign-in-up-page-sign-in"
					href={Firebase.pageGenerator.generateSignUpPage()}
				>
					Sign up
				</a>
			</div>
			<div className="sign-in-up-page-bottom-section"></div>
		</div>
	);
};

export default ForgotPasswordPage;
