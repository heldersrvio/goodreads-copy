import React, { useState, useRef, useEffect } from 'react';
import { formatDistance } from 'date-fns';
import TopBarSearchBar from './TopBarSearchBar';
import PropTypes from 'prop-types';
import './styles/TopBar.css';

const TopBar = (props) => {
	const [browseClicked, setBrowseClicked] = useState(false);
	const [profileClicked, setProfileClicked] = useState(false);
	const [notificationsClicked, setNotificationsClicked] = useState(false);
	const [notifications, setNotifications] = useState(null);
	const [newNotifications, setNewNotifications] = useState(0);
	const [newFriends, setNewFriends] = useState(0);
	const browseRef = useRef(null);
	const profileRef = useRef(null);
	const notificationsRef = useRef(null);

	useEffect(() => {
		const checkForNewNotifications = async () => {
			const query = await props.fetchNotifications();
			setNewNotifications(
				query.filter((notification) => notification.new === true).length
			);
		};

		const checkForNewFriends = async () => {
			const numberOfNewFriends = await props.fetchNewFriends();
			setNewFriends(numberOfNewFriends);
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
		const query = await props.fetchNotifications();
		setNotifications(query);
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

	const rightSection = !props.isLoggedIn ? (
		<div id="top-bar-right-section">
			<div id="top-bar-sign-in-link-container">
				<a id="top-bar-sign-in-link" href="/">
					Sign In
				</a>
			</div>
			<div id="top-bar-join-link-container">
				<a id="top-bar-join-link" href="/">
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
							console.log('Here');
							props.setNewNotificationsToSeen();
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
					<div id="notifications-drop-down-bottom-section">{setNotificationsforDisplay()}</div>
				</div>
			</div>
			<div id="friends-link-container">
				<button
					id="friends-link"
					onClick={async () => {
						await props.setNewFriendsToZero();
						setNewFriends(0);
						document.location.href = 'https://www.google.com';
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
							props.profileImage !== null
								? props.profileImage
								: 'https://camo.githubusercontent.com/db6bd56a6ead4c0d902278e7c1f642ea166d9ddd/687474703a2f2f69636f6e732e69636f6e617263686976652e636f6d2f69636f6e732f746865686f74682f73656f2f3235362f73656f2d70616e64612d69636f6e2e706e67'
						}
					></img>
				</button>
				<div
					id="profile-drop-down"
					className={profileClicked ? 'visible' : 'hidden'}
				>
					<div id="profile-drop-down-top-section">
						<span>{props.profileName.toUpperCase()}</span>
						<ul>
							<li>
								<a href="/">Profile</a>
							</li>
							<li>
								<a href="/">Friends</a>
							</li>
							<li>
								<a href="/">Quotes</a>
							</li>
							<li>
								<a href="/">Favorite genres</a>
							</li>
							<li>
								<a href="/">Friends' recommendations</a>
							</li>
						</ul>
					</div>
					<div id="profile-drop-down-bottom-section">
						<ul>
							<li>
								<a href="/">Account settings</a>
							</li>
							<li>
								<a href="/">Help</a>
							</li>
							<li>
								<a
									href="/"
									onClick={(e) => {
										e.preventDefault();
										props.signOut();
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

	const browseDropDownGenresList = !props.isLoggedIn ? (
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
				].map((genre) => (
					<li>
						<a href="/">{genre}</a>
					</li>
				))}
			</ul>
		</div>
	) : (
		<div id="browse-drop-down-right-section">
			<span>FAVORITE GENRES</span>
			<ul>
				{props.favoriteGenres.map((genre) => (
					<li key={genre}>
						<a href="/">{genre}</a>
					</li>
				))}
			</ul>
			<a href="/" id="all-genres-a">
				All Genres
			</a>
		</div>
	);

	const browseDropDown = (
		<div id="browse-drop-down" className={browseClicked ? 'visible' : 'hidden'}>
			<div id="browse-drop-down-left-section">
				<ul>
					<li>
						<a href="/">Recommendations</a>
					</li>
					<li>
						<a href="/">Choice Awards</a>
					</li>
					<li>
						<a href="/">New Releases</a>
					</li>
					<li>
						<a href="/">Lists</a>
					</li>
					<li>
						<a href="/">Explore</a>
					</li>
					<li>
						<a href="/">{'News & Interviews'}</a>
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
			<div id="home-link-container">
				<a id="home-link" href="/">
					Home
				</a>
			</div>
			<div id="my-books-link-container">
				<a id="my-books-link" href="/">
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
			<TopBarSearchBar queryBooksFunction={props.queryBooksFunction} />
			{rightSection}
		</div>
	);
};

TopBar.propTypes = {
	isLoggedIn: PropTypes.bool,
	profileImage: PropTypes.string,
	profileName: PropTypes.string,
	favoriteGenres: PropTypes.arrayOf(PropTypes.string),
	signOut: PropTypes.func,
	queryBooksFunction: PropTypes.func,
	fetchNotifications: PropTypes.func,
	fetchNewFriends: PropTypes.func,
	setNewFriendsToZero: PropTypes.func,
	setNewNotificationsToSeen: PropTypes.func,
};

export default TopBar;
