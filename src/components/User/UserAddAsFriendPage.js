import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';

const UserAddAsFriendPage = ({ match }) => {
	const {
		params: { newFriendId },
	} = match;
	const [loaded, setLoaded] = useState(false);
	const [userInfo, setUserInfo] = useState({});

	const pageHeader = loaded ? (
		<h1 className="user-add-as-friend-page-header">
			<a
				href={Firebase.pageGenerator.generateUserPage(
					newFriendId,
					userInfo.name
				)}
			>
				{userInfo.name}
			</a>
			<span>{' > Add as a Friend'}</span>
		</h1>
	) : null;

	const mainContent = (
		<div className="user-add-as-friend-page-main-content"></div>
	);

	return (
		<div className="user-add-as-friend-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default UserAddAsFriendPage;
