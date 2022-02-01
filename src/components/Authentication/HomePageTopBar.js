import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Firebase from '../../Firebase';
import '../styles/Authentication/HomePageTopBar.css';

const HomePageTopBar = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(false);
	const history = useHistory();

	return (
		<div id="home-page-top-bar">
			<div id="home-page-top-bar-left">
				<a
					id="goodreads-home-link"
					href={Firebase.pageGenerator.generateHomePage()}
				>
					<img
						src="https://www.goodreads.com/assets/home/header_logo-8d96d7078a3d63f9f31d92282fd67cf4.png"
						alt="Goodreads logo"
					></img>
				</a>
			</div>
			<div id="home-page-top-bar-right">
				<form id="signin-form">
					<div id="form-email">
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Email address"
						></input>
						<div>
							<input
								id="remember-me"
								type="checkbox"
								value={rememberMe}
								onChange={() => setRememberMe(!rememberMe)}
							></input>
							<label htmlFor="remember-me">Remember me</label>
						</div>
					</div>
					<div id="form-password">
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Password"
						></input>
						<a
							id="forgot-password-a"
							href={Firebase.pageGenerator.generateChangePasswordPage()}
						>
							Forgot it?
						</a>
					</div>
					<button
						id="sign-in-button"
						onClick={async (e) => {
							e.preventDefault();
							if (email.length > 0 && password.length > 0) {
								await Firebase.passwordSignIn(
									email,
									password,
									rememberMe,
									history
								);
							} else {
								history.push({
									pathname: '/user/sign_in',
								});
							}
						}}
					>
						Sign In
					</button>
				</form>
			</div>
		</div>
	);
};

export default HomePageTopBar;
