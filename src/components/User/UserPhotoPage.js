import React, { useState, useEffect } from 'react';
import Firebase from '../../Firebase';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';

const UserPhotoPage = ({ match, location }) => {
	const {
		params: { userPhotoPageId },
	} = match;
	const userId = userPhotoPageId.split('-')[0];
	const firstName =
		userPhotoPageId.split('-')[1].length > 1
			? userPhotoPageId.split('-')[1][0].toUpperCase() +
			  userPhotoPageId.split('-')[1].slice(1)
			: userPhotoPageId.split('-')[1].toUpperCase();
	const [loaded, setLoaded] = useState(false);
	const [photoInfo, setPhotoInfo] = useState(null);

	useEffect(() => {
		const loadInfo = () => {};

		loadInfo();
	}, [userId]);

	const mainContent = loaded ? (
		<div className="user-photo-page-main-content">
			<span className="book-photo-page-title">
				<a href={Firebase.pageGenerator.generateUserPage(userId, firstName)}>
					{firstName}
				</a>
				<span>{'>'}</span>
				<span>Photos</span>
				<span>{'>'}</span>
				<span>Profile Photo</span>
			</span>
		</div>
	) : null;

	return (
		<div className="user-photo-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default UserPhotoPage;
