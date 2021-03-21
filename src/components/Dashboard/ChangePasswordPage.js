import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';
import '../styles/Dashboard/ChangePasswordPage.css';

const ChangePassswordPage = () => {
	const history = useHistory();
	const [errors, setErrors] = useState([]);
	const [currentPasswordInput, setCurrentPasswordInput] = useState('');
	const [newPasswordInput, setNewPasswordInput] = useState('');
	const [confirmPasswordInput, setConfirmPasswordInput] = useState('');

	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		if (user.userUID === null || user.userUID === undefined) {
			history.push({
				pathname: '/user/sign_in',
				state: { error: 'User not logged in' },
			});
		}
	}, [user.userUID, history]);

	const checkIfPasswordsMatch = async () => {
		return await Firebase.checkIfPasswordsMatch(
			user.userUID,
			currentPasswordInput
		);
	};

	const changePassword = async () => {
		await Firebase.changePassword(user.userUID, newPasswordInput, history);
	};

	const pageHeader = (
		<h1 className="change-password-page-header">Change Password</h1>
	);

	const errorList = (
		<div className="change-password-page-error-list">
			<span className="error-list-title">
				{errors.length === 1
					? '1 error prohibited this book from being saved:'
					: `${errors.length} errors prohibited this book from being saved:`}
			</span>
			<ul>
				{errors.includes('matching') ? (
					<li>Password doesn't match the one in your account.</li>
				) : null}
				{errors.includes('short') ? (
					<li>Password is too short. (minimum is 6 characters)</li>
				) : null}
				{errors.includes('confirm') ? (
					<li>Password is invalid or doesn't match</li>
				) : null}
			</ul>
		</div>
	);

	const mainContent = (
		<div className="change-password-page-main-content">
			{pageHeader}
			{errors.length > 0 ? errorList : null}
			<div className="password-area">
				<label htmlFor="current-password">current password</label>
				<input
					type="password"
					name="current-password"
					value={currentPasswordInput}
					onChange={(e) => setCurrentPasswordInput(e.target.value)}
				></input>
				<label htmlFor="new-password">new password</label>
				<input
					type="password"
					name="new-password"
					value={newPasswordInput}
					onChange={(e) => setNewPasswordInput(e.target.value)}
				></input>
				<label htmlFor="confirm-password">confirm password</label>
				<input
					type="password"
					name="confirm-password"
					value={confirmPasswordInput}
					onChange={(e) => setConfirmPasswordInput(e.target.value)}
				></input>
				<div className="bottom-section">
					<input
						type="submit"
						value="save changes"
						onClick={async (e) => {
							e.preventDefault();
							const passwordsMatch = await checkIfPasswordsMatch();
							if (!passwordsMatch) {
								setErrors(['matching']);
							} else if (newPasswordInput !== confirmPasswordInput) {
								setErrors(['confirm']);
							} else if (newPasswordInput.length < 6) {
								setErrors(['short']);
							} else {
								changePassword();
							}
						}}
					></input>
					<a href={Firebase.pageGenerator.generateAccountSettingsPage()}>
						cancel
					</a>
				</div>
			</div>
		</div>
	);

	return (
		<div className="change-password-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default ChangePassswordPage;
