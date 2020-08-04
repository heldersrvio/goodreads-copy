import React from 'react';
import './styles/TopBar.css';

const TopBar = (props) => {
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
				<button id="browse-button">Browse ▾</button>
			</div>
			<div id="search-bar-container"></div>
			<div id="notifications-button-container">
				<button id="notifications-button"></button>
			</div>
			<div id="friends-link-container">
				<a id="friends-link" href="/">
					<span></span>
				</a>
			</div>
			<div id="profile-button-container">
				<button id="profile-button"></button>
			</div>
		</div>
	);
};

export default TopBar;
