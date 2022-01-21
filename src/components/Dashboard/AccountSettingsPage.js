import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';
import ProfileSettings from './ProfileSettings';
import Settings from './Settings';
import FeedUpdateSettings from './FeedUpdateSettings';
import '../styles/Dashboard/AccountSettingsPage.css';
import { trackPromise } from 'react-promise-tracker';

const AccountSettingsPage = () => {
	const history = useHistory();
	const [loaded, setLoaded] = useState(false);
	const [userInfo, setUserInfo] = useState({});
	const [tab, setTab] = useState('profile');
	const [topMessage, setTopMessage] = useState('');
	const [topMessageType, setTopMessageType] = useState('yellow');

	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		const getUserInfo = async () => {
			setUserInfo(
				await trackPromise(Firebase.getUserSettings(user.userUID, history))
			);
			setLoaded(true);
		};
		getUserInfo();
	}, [user.userUID, history]);

	const saveProfileOrFeedSettings = async (settings) => {
		await Firebase.saveUserSettings(user.userUID, settings);
		setTopMessage('The changes to your profile have been saved.');
		setTopMessageType('yellow');
	};

	const saveAccountSettings = async (settings) => {
		if (
			settings.friendChallengeAnswer.split(' ').length > 1 ||
			settings.friendChallengeAnswer
				.split('')
				.some((character) =>
					[',', '.', ':', '"', "'", '?', '!'].includes(character)
				)
		) {
			setTopMessage(
				'Challenge answer must be one word and contain no spaces or punctuation.'
			);
			setTopMessageType('red');
		} else {
			await Firebase.saveUserSettings(user.userUID, settings);
			setTopMessage('The changes to your profile have been saved.');
			setTopMessageType('yellow');
		}
	};

	const saveProfilePicture = async (file) => {
		if (file !== undefined) {
			const objectURL = URL.createObjectURL(file);
			await Firebase.saveUserSettings(user.userUID, {
				profileImage: objectURL,
			});
			setTopMessage('The changes to your profile have been saved.');
			setTopMessageType('yellow');
		}
	};

	const deleteProfilePicture = async () => {
		if (window.confirm('Are you sure?')) {
			await Firebase.deleteProfilePicture(user.userUID);
			setTopMessage('Your photo has been deleted.');
			setTopMessageType('yellow');
		}
	};

	const moveToProfileTab = () => {
		setTab('profile');
	};

	const topMessageDiv = (
		<div
			className={
				topMessageType === 'yellow'
					? 'account-settings-saved-message yellow'
					: 'account-settings-saved-message red'
			}
		>
			<span>{topMessage}</span>
			<button
				className="close-button"
				onClick={(_e) => setTopMessage('')}
			></button>
		</div>
	);

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
						userInfo.profile.firstName
					)}
				>
					View My Profile
				</a>
			</div>
		) : null;

	const tabNavigationSection = (
		<div className="tab-navigation-section">
			<button
				className={
					tab === 'profile'
						? 'tab-navigation-button selected'
						: 'tab-navigation-button'
				}
				onClick={(_e) => setTab('profile')}
			>
				Profile
			</button>
			<button
				className={
					tab === 'settings'
						? 'tab-navigation-button selected'
						: 'tab-navigation-button'
				}
				onClick={(_e) => setTab('settings')}
			>
				Settings
			</button>
			<button
				className={
					tab === 'feeds'
						? 'tab-navigation-button selected'
						: 'tab-navigation-button'
				}
				onClick={(_e) => setTab('feeds')}
			>
				Feeds
			</button>
		</div>
	);

	const mainForm = loaded ? (
		tab === 'profile' ? (
			<ProfileSettings
				{...userInfo.profile}
				saveProfileSettings={saveProfileOrFeedSettings}
				saveProfilePicture={saveProfilePicture}
				deleteProfilePicture={deleteProfilePicture}
			/>
		) : tab === 'settings' ? (
			<Settings
				{...userInfo.account}
				saveAccountSettings={saveAccountSettings}
				moveToProfileTab={moveToProfileTab}
			/>
		) : (
			<FeedUpdateSettings
				{...userInfo.feed}
				saveFeedSettings={saveProfileOrFeedSettings}
			/>
		)
	) : null;

	return (
		<div className="account-settings-page">
			<TopBar />
			<div className="account-settings-page-main-content">
				{topMessage !== '' ? topMessageDiv : null}
				{mainContentTopSection}
				{tabNavigationSection}
				{mainForm}
			</div>
			<HomePageFootBar />
		</div>
	);
};

export default AccountSettingsPage;
