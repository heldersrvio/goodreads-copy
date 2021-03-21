import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';
import '../styles/Dashboard/DeleteAccountPage.css';

const DeleteAccountPage = () => {
	const history = useHistory();
	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		if (user.userUID === null || user.userUID === undefined) {
			history.push({
				pathname: '/user/sign_in',
				state: { error: 'User not logged in' },
			});
		}
	}, [user.userUID, history]);

	const deleteAccount = async () => {
		if (
			window.confirm(
				'This will remove all your books and data from goodreads forever - are you sure?'
			)
		) {
			await Firebase.deleteAccount(user.userUID, history);
		}
	};

	const pageHeader = (
		<h1 className="delete-account-page-header">Delete My Account</h1>
	);

	const mainContentLeftSection = (
		<div className="delete-account-page-main-content-left-section">
			{pageHeader}
			<span>
				This will delete your account. The ratings and reviews you've posted,
				your comments, writing, etc. will be removed from the site.
			</span>
			<div className="bottom-section">
				<input
					type="submit"
					value="Delete My Account"
					onClick={async (e) => {
						e.preventDefault();
						await deleteAccount();
					}}
				></input>
				<a href={Firebase.pageGenerator.generateAccountSettingsPage()}>
					cancel
				</a>
			</div>
		</div>
	);

	const mainContentRightSection = (
		<div className="delete-account-page-main-content-right-section">
			<a href={Firebase.pageGenerator.generateAccountSettingsPage()}>
				account settings
			</a>
		</div>
	);

	return (
		<div className="delete-account-page">
			<TopBar />
			<div className="delete-account-page-main-content">
				{mainContentLeftSection}
				{mainContentRightSection}
			</div>
			<HomePageFootBar />
		</div>
	);
};

export default DeleteAccountPage;
