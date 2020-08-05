import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './styles/TopBar.css';

const TopBar = (props) => {
	const [browseClicked, setBrowseClicked] = useState(false);
	const [profileClicked, setProfileClicked] = useState(false);

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
				<button id="notifications-button"></button>
			</div>
			<div id="friends-link-container">
				<a id="friends-link" href="/">
					<span></span>
				</a>
			</div>
			<div id="profile-button-container">
				<button id="profile-button">
					<img alt="profile" src={props.profileImage}></img>
				</button>
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
			<div id="browse-button-container">
				<button
					id="browse-button"
					onClick={() => setBrowseClicked(!browseClicked)}
					className={browseClicked ? 'clicked' : ''}
				>
					Browse ▾
				</button>
				{browseDropDown}
			</div>
			<div id="search-bar-container"></div>
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
};

export default TopBar;
