import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';

const UserPage = ({ match }) => {
	const {
		params: { userPageId },
	} = match;
	const userId = userPageId.split('-')[0];
	const firstName =
		userPageId.split('-')[1].length > 1
			? userPageId.split('-')[1][0].toUpperCase() +
			  userPageId.split('-')[1].slice(1)
			: userPageId.split('-')[1].toUpperCase();
	const [loaded, setLoaded] = useState(false);
	const [userInfo, setUserInfo] = useState({});
	const [savingFollow, setSavingFollow] = useState(false);
	const [showingMoreDropdown, setShowingMoreDropdown] = useState(false);
	const location = loaded
		? userInfo.city !== undefined &&
		  userInfo.stateProvinceCode !== undefined &&
		  userInfo.country !== undefined
			? `${userInfo.city}, ${userInfo.stateProvinceCode}, ${userInfo.country}`
			: userInfo.city !== undefined && userInfo.stateProvinceCode !== undefined
			? `${userInfo.city}, ${userInfo.stateProvinceCode}`
			: userInfo.city !== undefined && userInfo.country !== undefined
			? `${userInfo.city}, ${userInfo.country}`
			: userInfo.stateProvinceCode !== undefined &&
			  userInfo.country !== undefined
			? `${userInfo.stateProvinceCode}, ${userInfo.country}`
			: userInfo.city !== undefined
			? userInfo.city
			: userInfo.stateProvinceCode !== undefined
			? userInfo.stateProvinceCode
			: userInfo.country !== undefined
			? userInfo.country
			: ''
		: '';
	const showGender =
		loaded &&
		userInfo.gender !== '' &&
		(userInfo.showGenderTo === 'everyone' ||
			(userInfo.showGenderTo === 'friendOnly' && userInfo.isUserFriend));
	const showLocation =
		loaded &&
		location !== '' &&
		(userInfo.locationViewableBy === 'everyone' ||
			(userInfo.locationViewableBy === 'friendOnly' && userInfo.isUserFriend));
	/*
    userInfo: {
        isFollowedByUser,
        isUserFriend,
        lastName,
        showGenderTo,
        gender,
        locationViewableBy,
        country,
        stateProvinceCode,
        city,
        website,
        lastActiveDate,
        joinedDate,
        interests,
        favoriteBooks,
        about,
        profilePicture,
        numberOfRatings,
        averageRating,
        numberOfReviews,
        bookShelves: [{
            name,
            numberOfBooks,
        }],
        toReadBooks: [{
            id,
            title,
            cover,
        }],
        currentlyReadingBooks: [{
            id,
            title,
            mainAuthorId,
            mainAuthorName,
            mainAuthorIsMember,
            updateDate,
            userStatus,
            userRating,
            userProgress,
            userToReadPosition,
        }],
        recentUpdates: [{
            type,
            date,
            authorInfo: {
                id,
                name,
                picture,
                isMember,
                userIsFollowing,
            },
            bookInfo: {
                id,
                title,
                mainAuthorId,
                mainAuthorName,
                mainAuthorIsMember,
                updateDate,
                userStatus,
                userRating,
                userProgress,
                userToReadPosition,
            },
        }],
        quotes: [{
            id,
            content,
            authorId,
            authorName,
            authorProfilePicture,
            bookTitle,
            numberOfLikes,
            likedByUser,
        }],
        friends: [{
            id,
            name,
            picture,
            numberOfBooks,
            numberOfFriends,
        }],
        following: [{
            id,
            picture,
            name,
        }],
        numberOfFollowers,
        votedLists: [{
            id,
            title,
            bookCovers,
            numberOfBooks,
            numberOfVoters,
        }],
        favoriteGenres,
    }
    */

	const introduction = loaded ? (
		<div className="user-page-introduction">
			<div className="left-section">
				{userInfo.profilePicture !== undefined ? (
					<a
						className="user-photo-a"
						href={Firebase.pageGenerator.generateUserPhotoPage(userId)}
					>
						<img
							src={userInfo.profilePicture}
							alt={firstName + ' ' + userInfo.lastName}
						/>
					</a>
				) : (
					<img
						src={
							'https://s.gr-assets.com/assets/nophoto/user/u_225x300-c928cbb998d4ac6dd1f0f66f31f74b81.png'
						}
						alt={firstName + ' ' + userInfo.lastName}
					/>
				)}
			</div>
			<div className="right-section">
				<h1>{firstName + ' ' + userInfo.lastName}</h1>
				{!savingFollow ? (
					<div className="follow-friends-buttons">
						<button
							className={
								userInfo.isFollowedByUser
									? 'follow-button following'
									: 'follow-button'
							}
							onMouseOver={(e) => {
								if (userInfo.isFollowedByUser) {
									e.target.innerHTML = 'Unfollow';
								}
							}}
						>
							{userInfo.isFollowedByUser ? (
								<span>
									<div className="following-checkmark"></div>
									<span>Following</span>
								</span>
							) : (
								<span>Follow</span>
							)}
						</button>
						<a
							className="add-as-friend-a"
							href={Firebase.pageGenerator.generateAddAsFriendPage}
						>
							Add friend
						</a>
						<button
							className="more-dropdown-trigger"
							onClick={(_e) => setShowingMoreDropdown((previous) => !previous)}
						>
							<span>More</span>
							<div className="downwards-arrow"></div>
							<div className="more-dropdown">
								<ul>
									<li>
										<a
											className="compare-books-a"
											href={Firebase.pageGenerator.generateUserCompareBooksPage(
												userId
											)}
										>
											Compare books
										</a>
									</li>
								</ul>
							</div>
						</button>
					</div>
				) : (
					<div className="follow-loading-spinner"></div>
				)}
				<table className="user-misc">
					<tbody>
						{showGender || showLocation ? (
							<tr>
								<th>Details</th>
								<td>
									{showGender && showLocation
										? `${
												userInfo.gender[0].toUpperCase() +
												userInfo.gender.slice(1)
										  }, ${location}`
										: showGender
										? userInfo.gender[0].toUpperCase() +
										  userInfo.gender.slice(1)
										: location}
								</td>
							</tr>
						) : null}
						{userInfo.website !== undefined ? (
							<tr>
								<th>Website</th>
								<td>{userInfo.website}</td>
							</tr>
						) : null}
						<tr>
							<th>Activity</th>
							<td>{`Joined in ${format(
								userInfo.joinedDate,
								'MMMM yyyy'
							)}, last active ${
								userInfo.lastActiveDate.getFullYear() ===
									new Date().getFullYear() &&
								userInfo.lastActiveDate.getMonth() === new Date().getMonth()
									? 'this month'
									: (userInfo.lastActiveDate.getFullYear() ===
											new Date().getFullYear() &&
											userInfo.lastActiveDate.getMonth() ===
												new Date().getMonth() - 1) ||
									  (userInfo.lastActiveDate.getFullYear() ===
											new Date().getFullYear() - 1 &&
											userInfo.lastActiveDate.getMonth() === 11 &&
											new Date().getMonth() === 0)
									? 'last month'
									: userInfo.lastActiveDate.getFullYear() ===
									  new Date().getFullYear()
									? 'this year'
									: `in ${format(userInfo.lastActiveDate, 'MMMM yyyy')}`
							}`}</td>
						</tr>
						{userInfo.interests.length > 0 ? (
							<tr>
								<th>Interests</th>
								<td>{userInfo.interests}</td>
							</tr>
						) : null}
						{userInfo.favoriteBooks.length > 0 ? (
							<tr>
								<th>Favorite Books</th>
								<td>{userInfo.favoriteBooks}</td>
							</tr>
						) : null}
						{userInfo.about.length > 0 ? (
							<tr>
								<th>About</th>
								<td>{userInfo.about}</td>
							</tr>
						) : null}
					</tbody>
				</table>
			</div>
		</div>
	) : null;

	const userToReadShelfSection = loaded ? (
		<div className="user-page-to-read-shelf-section">
			<a
				href={Firebase.pageGenerator.generateUserShelfPage(
					userId,
					firstName,
					'to-read'
				)}
				className="section-title"
			>{`${firstName.toUpperCase()}'S TO-READ SHELF`}</a>
			<div className="book-list">
				{userInfo.toReadBooks.map((book, index) => {
					return (
						<a
							className="book-a"
							href={Firebase.pageGenerator.generateBookPage(
								book.id,
								book.title
							)}
							key={index}
						>
							<img
								src={
									book.cover !== undefined
										? book.cover
										: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png'
								}
								alt={book.title}
							/>
						</a>
					);
				})}
			</div>
			<a
				className="more-books-a"
				href={Firebase.pageGenerator.generateUserShelfPage(
					userId,
					firstName,
					'to-read'
				)}
			>
				More...
			</a>
		</div>
	) : null;
};

export default UserPage;
