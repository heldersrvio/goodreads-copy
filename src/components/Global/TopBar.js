import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import TopBarSearchBar from './TopBarSearchBar';
import Firebase from '../../Firebase';
import '../styles/Global/TopBar.css';

const TopBar = () => {
	const [browseClicked, setBrowseClicked] = useState(false);
	const [profileClicked, setProfileClicked] = useState(false);
	const [notificationsClicked, setNotificationsClicked] = useState(false);
	const [notifications, setNotifications] = useState(null);
	const [newNotifications, setNewNotifications] = useState(0);
	const [newFriends, setNewFriends] = useState(0);
	const browseRef = useRef(null);
	const profileRef = useRef(null);
	const notificationsRef = useRef(null);
	const history = useHistory();

	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		const checkForNewNotifications = async () => {};

		const checkForNewFriends = async () => {
			if (user === null) {
				setNewFriends(0);
			} else {
				const numberOfNewFriends = 0;
				setNewFriends(numberOfNewFriends);
			}
		};

		document.addEventListener('click', (event) => {
			if (
				browseRef !== null &&
				browseRef.current !== null &&
				browseRef.current !== undefined &&
				!browseRef.current.contains(event.target)
			) {
				setBrowseClicked(false);
			}
			if (
				profileRef !== null &&
				profileRef.current !== null &&
				profileRef.current !== undefined &&
				!profileRef.current.contains(event.target)
			) {
				setProfileClicked(false);
			}

			if (
				notificationsRef !== null &&
				notificationsRef.current !== null &&
				notificationsRef.current !== undefined &&
				!notificationsRef.current.contains(event.target)
			) {
				setNotificationsClicked(false);
			}
		});

		checkForNewNotifications();
		checkForNewFriends();
	});

	const getNotifications = async () => {
		setNotifications([]);
	};

	const setNotificationsforDisplay = () => {
		if (notifications === null) {
			return null;
		}
		return notifications.map((notification) => (
			<div className="notification-card">
				<div className="notification-card-left-section">
					<img src={notification.image} alt="notification user" />
				</div>
				<div className="notification-card-right-section">
					<span>
						<strong>{notification.name}</strong>,{' '}
						{notification.nonAnchorContent !== undefined
							? notification.nonAnchorContent
							: ''}{' '}
						<a href={notification.anchorSrc}>{notification.content}</a>
					</span>
					<br></br>
					<span className="date-distance-span">
						{formatDistance(notification.time.toDate(), new Date(), {
							addSuffix: true,
						})}
					</span>
				</div>
			</div>
		));
	};

	const loadingSpinner = (
		<div id="loadingSpinner">
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);

	const rightSection =
		user === null || user.userUID === undefined || user.userUID === null ? (
			<div id="top-bar-right-section">
				<div id="top-bar-sign-in-link-container">
					<a
						id="top-bar-sign-in-link"
						href={Firebase.pageGenerator.generateSignInPage()}
					>
						Sign In
					</a>
				</div>
				<div id="top-bar-join-link-container">
					<a
						id="top-bar-join-link"
						href={Firebase.pageGenerator.generateSignUpPage()}
					>
						Join
					</a>
				</div>
			</div>
		) : (
			<div id="top-bar-right-section">
				<div id="notifications-button-container" ref={notificationsRef}>
					<button
						id="notifications-button"
						onClick={() => {
							if (newNotifications > 0) {
								setNewNotifications(0);
							}
							setNotificationsClicked(!notificationsClicked);
							getNotifications();
						}}
						className={notificationsClicked ? 'clicked' : ''}
					>
						{newNotifications > 0 ? <span>{newNotifications}</span> : null}
					</button>
					<div
						id="notifications-drop-down"
						className={notificationsClicked ? 'visible' : 'hidden'}
					>
						{notifications !== null && notifications.length > 0 ? (
							<div id="notifications-drop-down-top-section">
								<a id="notifications-a" href="/">
									NOTIFICATIONS
								</a>
								<a id="view-all-notifications-a" href="/">
									View all notifications
								</a>
							</div>
						) : notifications !== null ? (
							<span id="no-notifications-span">No notifications</span>
						) : (
							loadingSpinner
						)}
						<div id="notifications-drop-down-bottom-section">
							{setNotificationsforDisplay()}
						</div>
					</div>
				</div>
				<div id="friends-link-container">
					<button
						id="friends-link"
						onClick={async () => {
							setNewFriends(0);
							document.location.href = Firebase.pageGenerator.generateUserFriendsPage(
								user.userUID,
								user.userInfo.firstName
							);
						}}
					>
						{newFriends > 0 ? <span>{newFriends}</span> : null}
					</button>
				</div>
				<div id="profile-button-container" ref={profileRef}>
					<button
						id="profile-button"
						onClick={() => setProfileClicked(!profileClicked)}
						className={profileClicked ? 'clicked' : ''}
					>
						<img
							alt="profile"
							src={
								user.userInfo !== undefined &&
								user.userInfo.profileImage !== undefined
									? user.userInfo.profileImage
									: 'https://www.goodreads.com/assets/nophoto/user/u_60x60-267f0ca0ea48fd3acfd44b95afa64f01.png'
							}
						></img>
					</button>
					<div
						id="profile-drop-down"
						className={profileClicked ? 'visible' : 'hidden'}
					>
						<div id="profile-drop-down-top-section">
							<span>
								{user.userInfo !== undefined &&
								user.userInfo.firstName !== undefined
									? user.userInfo.firstName.toUpperCase()
									: ''}
							</span>
							<ul>
								<li>
									<a
										href={Firebase.pageGenerator.generateUserPage(
											user.userUID,
											user.userInfo.firstName
										)}
									>
										Profile
									</a>
								</li>
								<li>
									<a
										href={Firebase.pageGenerator.generateUserFriendsPage(
											user.userUID,
											user.userInfo.firstName
										)}
									>
										Friends
									</a>
								</li>
								<li>
									<a
										href={Firebase.pageGenerator.generateEditFavoriteGenresPage()}
									>
										Favorite genres
									</a>
								</li>
								<li>
									<a
										href={Firebase.pageGenerator.generateRecommendationsPage(
											true
										)}
									>
										Friends' recommendations
									</a>
								</li>
							</ul>
						</div>
						<div id="profile-drop-down-bottom-section">
							<ul>
								<li>
									<a
										href={Firebase.pageGenerator.generateAccountSettingsPage()}
									>
										Account settings
									</a>
								</li>
								<li>
									<a href="/">Help</a>
								</li>
								<li>
									<a
										href="/"
										onClick={(e) => {
											e.preventDefault();
											Firebase.signOut(history);
										}}
									>
										Sign out
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		);

	const browseDropDownGenresList =
		user === null || user.userUID === undefined || user.userUID === null ? (
			<div id="browse-drop-down-right-section">
				<span>GENRES</span>
				<ul>
					{[
						'Art',
						'Biography',
						'Business',
						"Children's",
						'Christian',
						'Classics',
						'Comics',
						'Cookbooks',
						'Ebooks',
						'Fantasy',
						'Fiction',
						'Graphic Novels',
						'Historical Fiction',
						'History',
						'Horror',
						'Memoir',
						'Music',
						'Mystery',
						'Nonfiction',
						'Poetry',
						'Psychology',
						'Romance',
						'Science',
						'Science Fiction',
						'Self Help',
						'Sports',
						'Thriller',
						'Travel',
						'Young Adult',
						'More Genres',
					].map((genre, index) => (
						<li key={index}>
							<a href="/">{genre}</a>
						</li>
					))}
				</ul>
			</div>
		) : (
			<div id="browse-drop-down-right-section">
				<span>FAVORITE GENRES</span>
				<ul>
					{user.userInfo !== undefined &&
					user.userInfo.favoriteGenres !== undefined
						? user.userInfo.favoriteGenres.map((genre) => (
								<li key={genre}>
									<a href="/">{genre}</a>
								</li>
						  ))
						: null}
				</ul>
				<a
					href={Firebase.pageGenerator.generateEditFavoriteGenresPage()}
					id="all-genres-a"
				>
					All Genres
				</a>
			</div>
		);

	const browseDropDown = (
		<div id="browse-drop-down" className={browseClicked ? 'visible' : 'hidden'}>
			<div id="browse-drop-down-left-section">
				<ul>
					<li>
						<a href={Firebase.pageGenerator.generateRecommendationsPage()}>
							Recommendations
						</a>
					</li>
					<li>
						<a href={Firebase.pageGenerator.generateExplorePage()}>Explore</a>
					</li>
					<li>
						<a href={Firebase.pageGenerator.generateNewsPage()}>
							{'News & Interviews'}
						</a>
					</li>
				</ul>
			</div>
			{browseDropDownGenresList}
		</div>
	);

	return (
		<div id="top-bar">
			<div id="logo-link-container">
				<a id="logo-home-link" href="/">
					<span>GH</span>
				</a>
			</div>
			<div id="top-bar-left-section">
				<div id="home-link-container">
					<a id="home-link" href="/">
						Home
					</a>
				</div>
				<div id="my-books-link-container">
					<a
						id="my-books-link"
						href={Firebase.pageGenerator.generateUserShelfPage(
							user.userUID,
							user.userInfo.firstName
						)}
					>
						My Books
					</a>
				</div>
				<div id="browse-button-container" ref={browseRef}>
					<button
						id="browse-button"
						onClick={() => setBrowseClicked(!browseClicked)}
						className={browseClicked ? 'clicked' : ''}
					>
						Browse ▾
					</button>
					{browseDropDown}
				</div>
			</div>
			<TopBarSearchBar userUID={user === null ? user : user.userUID} />
			{rightSection}
		</div>
	);
};

export default TopBar;
