import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import TopBarSearchBar from './TopBarSearchBar';
import Firebase from '../Firebase';
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
	const history = useHistory();

	useEffect(() => {
		const checkForNewNotifications = async () => {
			const query = await Firebase.queryNotifications();
			setNewNotifications(
				query.filter((notification) => notification.new === true).length
			);
		};

		const checkForNewFriends = async () => {
			const numberOfNewFriends = await Firebase.getNumberOfNewFriends(
				props.userUID
			);
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
		const query = await Firebase.queryNotifications();
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

	const rightSection =
		props.userUID === null ? (
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
								Firebase.setNewNotificationsToSeen();
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
							await Firebase.setNewFriendsToZero();
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
								Firebase.userInfo !== undefined &&
								Firebase.userInfo.profileImage !== undefined
									? Firebase.userInfo.profileImage
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
								{Firebase.userInfo !== undefined &&
								Firebase.userInfo.firstName !== undefined
									? Firebase.userInfo.firstName.toUpperCase()
									: ''}
							</span>
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
		props.userUID === null ? (
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
					{Firebase.userInfo !== undefined &&
					Firebase.userInfo.favoriteGenres !== undefined
						? Firebase.userInfo.favoriteGenres.map((genre) => (
								<li key={genre}>
									<a href="/">{genre}</a>
								</li>
						  ))
						: null}
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
			<div id="top-bar-left-section">
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
			</div>
			<TopBarSearchBar />
			{rightSection}
		</div>
	);
};

TopBar.propTypes = {
	userUID: PropTypes.string,
	userInfo: PropTypes.shape({
		profileImage: PropTypes.string,
		firstName: PropTypes.string,
		favoriteGenres: PropTypes.arrayOf(PropTypes.string),
	}),
};

export default TopBar;
