import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';

const FavoriteAuthorsPage = () => {
	const history = useHistory();
	const [loaded, setLoaded] = useState(false);
	const [authors, setAuthors] = useState([]);

	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		if (user === null || user.userUID === null || user.userUID === undefined) {
			history.push({
				pathname: '/user/sign_in',
			});
		} else {
			// Load information here
			setLoaded(true);
		}
	}, [user, history]);

	const pageHeader = (
		<h1 className="favorite-authors-page-header">Your Favorite Authors</h1>
	);

	const noAuthorsYetMessage = (
		<span className="no-authors-yet-message">
			You haven’t marked any author as your favorite.
		</span>
	);

	const mainContentLeftSection = loaded ? (
		<div className="favorite-authors-page-main-content-left-section">
			{pageHeader}
			{authors.length === 0 ? noAuthorsYetMessage : null}
		</div>
	) : null;

	const mainContentRightSection =
		loaded && user !== null ? (
			<div className="favorite-authors-page-main-content-right-section">
				<a
					href={Firebase.pageGenerator.generateUserPage(
						user.userUID,
						user.userInfo.firstName
					)}
				>
					Your profile »
				</a>
			</div>
		) : null;

	const mainContent = (
		<div className="favorite-authors-page-main-content">
			{mainContentLeftSection}
			{mainContentRightSection}
		</div>
	);

	return (
		<div className="favorite-authors-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default FavoriteAuthorsPage;
