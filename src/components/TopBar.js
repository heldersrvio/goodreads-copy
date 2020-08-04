import React, {useState} from 'react';
import PropTypes from 'prop-types';
import './styles/TopBar.css';

const TopBar = (props) => {
    const [browseClicked, setBrowseClicked] = useState(false);
    const [profileClicked, setProfileClicked] = useState(false);

    const rightSection = !props.isLoggedIn ?
        <div id="right-section">
            <div id="sign-in-link-container">
                <a id="sign-in-link" href="/">Sign In</a>
            </div>
            <div id="join-link-container">
                <a id="join-link" href="/">Join</a>
            </div>
        </div> :
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
        </div>;

    const browseDropDownGenresList = !props.isLoggedIn ?
        <div id="browse-drop-down-right-section">
            <span>GENRES</span>
            <ul>
                <li><a href="/">Art</a></li>
                <li><a href="/">Biography</a></li>
                <li><a href="/">Business</a></li>
                <li><a href="/">Children's</a></li>
                <li><a href="/">Christian</a></li>
                <li><a href="/">Classics</a></li>
                <li><a href="/">Comics</a></li>
                <li><a href="/">Cookbooks</a></li>
                <li><a href="/">Ebooks</a></li>
                <li><a href="/">Fantasy</a></li>
                <li><a href="/">Fiction</a></li>
                <li><a href="/">Graphic Novels</a></li>
                <li><a href="/">Historical Fiction</a></li>
                <li><a href="/">History</a></li>
                <li><a href="/">Horror</a></li>
                <li><a href="/">Memoir</a></li>
                <li><a href="/">Music</a></li>
                <li><a href="/">Mystery</a></li>
                <li><a href="/">Nonfiction</a></li>
                <li><a href="/">Poetry</a></li>
                <li><a href="/">Psychology</a></li>
                <li><a href="/">Romance</a></li>
                <li><a href="/">Science</a></li>
                <li><a href="/">Science Fiction</a></li>
                <li><a href="/">Self Help</a></li>
                <li><a href="/">Sports</a></li>
                <li><a href="/">Thriller</a></li>
                <li><a href="/">Travel</a></li>
                <li><a href="/">Young Adult</a></li>
                <li><a href="/">More Genres</a></li>
            </ul>
        </div> :
        <div id="browse-drop-down-right-section">
            <span>FAVORITE GENRES</span>
            <ul>
                {props.favoriteGenres.map(genre => <li><a href="/">{genre}</a></li>)}
            </ul>
        </div>;


    const browseDropDown = 
        <div id="browse-drop-down" className={browseClicked ? 'visible' : 'hidden'}>
            <div id="browse-drop-down-left-section">
                <ul>
                    <li><a href="/">Recommendations</a></li>
                    <li><a href="/">Choice Awards</a></li>
                    <li><a href="/">New Releases</a></li>
                    <li><a href="/">Lists</a></li>
                    <li><a href="/">Explore</a></li>
                    <li><a href="/">{'News & Interviews'}</a></li>
                </ul>
            </div>
            {browseDropDownGenresList}
        </div>;

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
				<button id="browse-button" onClick={() => setBrowseClicked(!browseClicked)} className={browseClicked ? 'clicked' : ''}>Browse ▾</button>
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
