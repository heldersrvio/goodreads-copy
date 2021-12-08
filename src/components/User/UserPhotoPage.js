import React, { useState, useEffect } from 'react';
import Firebase from '../../Firebase';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import '../styles/User/UserPhotoPage.css';

const UserPhotoPage = ({ match }) => {
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

	const loggedInUser = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		const loadInfo = async () => {
			const userObj = await Firebase.getUserInfoForUserPage(
				userId,
				loggedInUser.userUID
			);
			setPhotoInfo(userObj.profilePicture);
			setLoaded(true);
		};

		loadInfo();
	}, [userId, loggedInUser.userUID]);

	const mainContent = loaded ? (
		<div className="user-photo-page-main-content">
			<span className="user-photo-page-title">
				<a href={Firebase.pageGenerator.generateUserPage(userId, firstName)}>
					{firstName}
				</a>
				<span>{'>'}</span>
				<span>Photos</span>
				<span>{'>'}</span>
				<span>Profile Photo</span>
			</span>
			<a
				href={Firebase.pageGenerator.generateUserPhotoPage(userId)}
				className="small-photo-a"
			>
				<img src={photoInfo} alt="Profile" />
			</a>
			<div className="main-photo-section">
				<a className="largest-size-a" href={photoInfo}>
					largest size
				</a>
				<img src={photoInfo} alt="Profile" />
			</div>
			<span className="description-span">Profile photo.</span>
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
