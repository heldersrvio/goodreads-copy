import React, { useState, useRef, useEffect } from 'react';
import TopBarSearchBar from './TopBarSearchBar';
import PropTypes from 'prop-types';
import './styles/TopBar.css';

const TopBar = (props) => {
	const [browseClicked, setBrowseClicked] = useState(false);
	const [profileClicked, setProfileClicked] = useState(false);
	const [notificationsClicked, setNotificationsClicked] = useState(false);
	const [notifications, setNotifications] = useState(null);
	const browseRef = useRef(null);
	const profileRef = useRef(null);

	useEffect(() => {
		document.addEventListener('click', (event) => {
			if (
				browseRef !== null &&
				browseRef.current !== undefined &&
				!browseRef.current.contains(event.target)
			) {
				setBrowseClicked(false);
			}
			if (
				profileRef !== null &&
				profileRef.current !== undefined &&
				!profileRef.current.contains(event.target)
			) {
				setProfileClicked(false);
			}
		});
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
						<strong>{notification.name}</strong> {notification.content}
					</span>
					<br></br>
					<span>{notification.time}</span>
				</div>
			</div>
		));
	};

	const rightSection = !props.isLoggedIn ? (
		<div id="right-section">
			<div id="sign-in-link-container">
				<a id="sign-in-link" href="/">
					Sign In
				</a>
			</div>
			<div id="join-link-container">
				<a id="join-link" href="/">
					Join
				</a>
			</div>
		</div>
	) : (
		<div id="right-section">
			<div id="notifications-button-container">
				<button
					id="notifications-button"
					onClick={() => {
						setNotificationsClicked(!notificationsClicked);
						getNotifications();
					}}
				></button>
				<div
					id="notifications-drop-down"
					className={notificationsClicked ? 'visible' : 'hidden'}
				>
					<div id="top-section">
						<a id="notifications-a" href="/">
							NOTIFICATIONS
						</a>
						<a id="view-all-notifications-a" href="/">
							View all notifications
						</a>
					</div>
					<div id="bottom-section">{setNotificationsforDisplay()}</div>
				</div>
			</div>
			<div id="friends-link-container">
				<a id="friends-link" href="/">
					<span></span>
				</a>
			</div>
			<div id="profile-button-container" ref={profileRef}>
				<button
					id="profile-button"
					onClick={() => setProfileClicked(!profileClicked)}
				>
					<img alt="profile" src={props.profileImage}></img>
				</button>
				<div
					id="profile-drop-down"
					className={profileClicked ? 'visible' : 'hidden'}
				>
					<div id="top-section">
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
					<div id="bottom-section">
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
					<li>
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
};

export default TopBar;
