import React, { useState, useEffect } from 'react';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';
import ProfileSettings from './ProfileSettings';
import Settings from './Settings';
import FeedUpdateSettings from './FeedUpdateSettings';

const AccountSettingsPage = () => {
	const [loaded, setLoaded] = useState(false);
	const [userInfo, setUserInfo] = useState({});
	const [tab, setTab] = useState('profile');

	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		const getUserInfo = () => {
			setUserInfo({
				firstName: 'James',
				middleName: 'Stuart',
				lastName: 'Jacobson',
				showLastNameTo: 'friends',
				gender: 'm',
				customGender: '',
				pronouns: 'male',
				showGenderTo: 'everyone',
				zipCode: '',
				city: 'Austin',
				stateProvinceCode: 'TX',
				country: 'United States',
				locationViewableBy: 'everyone',
				dateOfBirth: new Date(1991, 10, 12),
				ageAndBirthdayPrivacy: 'age-no-one-birthday-no-one',
				website: '',
				interests: '',
				typeOfBooks: '',
				aboutMe: '',
			});
			setLoaded(true);
		};
		getUserInfo();
	}, []);

	const pageHeader = (
		<h1 className="account-settings-page-header">Account Settings</h1>
	);

	const mainContentTopSection =
		loaded && user !== null ? (
			<div className="account-settings-page-main-content-top-section">
				{pageHeader}
				<a
					href={Firebase.pageGenerator.generateUserPage(
						user.userUID,
						userInfo.firstName
					)}
				>
					View My Profile
				</a>
			</div>
		) : null;

	const tabNavigationSection = (
		<div className="tab-navigation-section">
			<button
				className="tab-navigation-button"
				onClick={(_e) => setTab('profile')}
			>
				Profile
			</button>
			<button
				className="tab-navigation-button"
				onClick={(_e) => setTab('settings')}
			>
				Settings
			</button>
			<button
				className="tab-navigation-button"
				onClick={(_e) => setTab('feeds')}
			>
				Feeds
			</button>
		</div>
	);

	const mainForm =
		tab === 'profile' ? (
			<ProfileSettings />
		) : tab === 'settings' ? (
			<Settings />
		) : (
			<FeedUpdateSettings />
		);

	return (
		<div className="account-settings-page">
			<TopBar />
			<div className="account-settings-page-main-content">
				{mainContentTopSection}
				{tabNavigationSection}
				{mainForm}
			</div>
			<HomePageFootBar />
		</div>
	);
};

export default AccountSettingsPage;
