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
	const [topMessage, setTopMessage] = useState('');
	const [topMessageType, setTopMessageType] = useState('yellow');

	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		const getUserInfo = () => {
			setUserInfo({
				profile: {
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
				},
				account: {
					email: 'jamessjacobson@gmail.com',
					emailVerifiedDate: new Date(2017, 6, 20),
					passwordLength: 10,
					whoCanViewMyProfile: 'anyone',
					emailAddressVisibleTo: 'friends-friends-requests',
					friendChallengeQuestion: '',
					friendChallengeAnswer: '',
				},
				feed: {
					addBookToShelves: true,
					addAFriend: true,
					voteForABookReview: true,
					addAQuote: true,
					recommendABook: true,
					addANewStatusToBook: true,
					followAnAuthor: true,
				},
			});
			setLoaded(true);
		};
		getUserInfo();
	}, []);

	const saveProfileOrFeedSettings = async (settings) => {
		await Firebase.saveUserSettings(user.userUID, settings);
		setTopMessage('The changes to your profile have been saved.');
		setTopMessageType('yellow');
	};

	const saveAccountSettings = async (settings) => {
		if (
			settings.friendChallengeAnswerInput.split(' ').length > 1 ||
			settings.friendChallengeAnswerInput
				.split()
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
		await Firebase.deleteProfilePicture(user.userUID);
		setTopMessage('Your photo has been deleted.');
		setTopMessageType('yellow');
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
				{topMessage !== '' ? topMessageDiv : null}
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
				{mainContentTopSection}
				{tabNavigationSection}
				{mainForm}
			</div>
			<HomePageFootBar />
		</div>
	);
};

export default AccountSettingsPage;
